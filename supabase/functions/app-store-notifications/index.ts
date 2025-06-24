import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { decode as base64Decode } from "https://deno.land/std@0.140.0/encoding/base64.ts"

// App Store Server Notification types
interface AppStoreNotification {
  signedPayload: string
}

interface NotificationPayload {
  notificationType: string
  subtype?: string
  notificationUUID: string
  data?: {
    appAppleId?: number
    bundleId?: string
    bundleVersion?: string
    environment?: string
    signedTransactionInfo?: string
    signedRenewalInfo?: string
  }
  version?: string
  externalPurchaseToken?: {
    externalPurchaseId?: string
    tokenCreationDate?: number
    appAppleId?: number
    bundleId?: string
  }
}

interface TransactionInfo {
  transactionId: string
  originalTransactionId: string
  bundleId: string
  productId: string
  subscriptionGroupIdentifier: string
  purchaseDate: number
  originalPurchaseDate: number
  expiresDate?: number
  quantity: number
  type: string
  appAccountToken?: string
  inAppOwnershipType: string
  signedDate: number
  environment: string
  transactionReason?: string
  storefront?: string
  storefrontId?: string
  price?: number
  currency?: string
}

interface RenewalInfo {
  originalTransactionId: string
  autoRenewProductId: string
  productId: string
  autoRenewStatus: number
  environment: string
  recentSubscriptionStartDate: number
  renewalDate?: number
  renewalPrice?: number
  currency?: string
  signedDate: number
  gracePeriodExpiresDate?: number
  offerType?: number
  offerIdentifier?: string
}

serve(async (req) => {
  const url = new URL(req.url)

  // Add test endpoints for debugging (no auth required)
  if (req.method === 'GET') {
    if (url.pathname.endsWith('/test')) {
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'App Store Server Notifications webhook is running',
        timestamp: new Date().toISOString(),
        environment: {
          supabaseUrl: Deno.env.get('SUPABASE_URL') ? 'set' : 'missing',
          supabaseKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'set' : 'missing'
        }
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 200
      })
    }
    
    return new Response('App Store Server Notifications Webhook', { 
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }

  // Simulation endpoint for testing
  if (req.method === 'POST' && url.pathname.endsWith('/simulate')) {
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      console.log('🧪 Simulating App Store notification...')
      
      // Create a test user first
      const testUserId = crypto.randomUUID()
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: testUserId,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'parent',
          subscription_status: 'free'
        })
      
      if (createError) {
        console.error('❌ Error creating test user:', createError)
        return new Response(JSON.stringify({ error: 'Failed to create test user' }), { status: 500 })
      }
      
      // Simulate updating subscription
      await updateUserSubscription(supabase, {
        originalTransactionId: 'test_transaction_123',
        productId: 'chores_ai_premium_monthly',
        expiresDate: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000), // 30 days from now
        autoRenewStatus: 1,
        environment: 'Sandbox',
        status: 'active'
      })
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Test subscription update completed',
        testUserId: testUserId
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    } catch (error) {
      console.error('❌ Error in simulation:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
  }

  // Only allow POST requests for actual webhooks
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the notification payload
    const notification: AppStoreNotification = await req.json()
    console.log('📱 Received App Store Server Notification')

    // Decode the signed payload
    const decodedPayload = await decodeAndVerifyNotification(notification.signedPayload)
    
    if (!decodedPayload) {
      console.error('❌ Failed to decode or verify notification payload')
      return new Response('Invalid payload', { status: 400 })
    }

    console.log(`📋 Notification Type: ${decodedPayload.notificationType}`)
    console.log(`🆔 Notification UUID: ${decodedPayload.notificationUUID}`)

    // Process the notification based on type
    await processNotification(decodedPayload, supabase)

    // Respond with success
    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('❌ Error processing App Store notification:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

async function decodeAndVerifyNotification(signedPayload: string): Promise<NotificationPayload | null> {
  try {
    // Split the JWT into its three parts
    const parts = signedPayload.split('.')
    if (parts.length !== 3) {
      console.error('Invalid JWT format')
      return null
    }

    // Decode the payload (second part)
    const payloadPart = parts[1]
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payloadPart + '='.repeat((4 - payloadPart.length % 4) % 4)
    
    const decodedBytes = base64Decode(paddedPayload)
    const decodedString = new TextDecoder().decode(decodedBytes)
    
    const payload: NotificationPayload = JSON.parse(decodedString)
    
    // In production, you should verify the JWT signature using Apple's public keys
    // For now, we'll just decode and use the payload
    console.log('✅ Successfully decoded notification payload')
    
    return payload
  } catch (error) {
    console.error('❌ Error decoding notification:', error)
    return null
  }
}

async function processNotification(payload: NotificationPayload, supabase: any) {
  const { notificationType, subtype, data } = payload

  // Enhanced logging for debugging
  console.log('🔍 WEBHOOK DEBUG INFO:')
  console.log('- Notification Type:', notificationType)
  console.log('- Subtype:', subtype || 'none')
  console.log('- UUID:', payload.notificationUUID)
  console.log('- Data present:', !!data)
  console.log('- Environment:', data?.environment || 'unknown')

  // Decode transaction and renewal info if present
  let transactionInfo: TransactionInfo | null = null
  let renewalInfo: RenewalInfo | null = null

  if (data?.signedTransactionInfo) {
    transactionInfo = await decodeJWTPayload(data.signedTransactionInfo)
    console.log('📱 Transaction Info decoded:', !!transactionInfo)
  }

  if (data?.signedRenewalInfo) {
    renewalInfo = await decodeJWTPayload(data.signedRenewalInfo)
    console.log('🔄 Renewal Info decoded:', !!renewalInfo)
  }

  console.log(`🔄 Processing notification: ${notificationType}${subtype ? ` (${subtype})` : ''}`)

  switch (notificationType) {
    case 'INITIAL_BUY':
      await handleInitialPurchase(transactionInfo, renewalInfo, supabase)
      break

    case 'DID_RENEW':
      await handleSuccessfulRenewal(transactionInfo, renewalInfo, supabase)
      break

    case 'DID_FAIL_TO_RENEW':
      await handleFailedRenewal(transactionInfo, renewalInfo, supabase)
      break

    case 'DID_CHANGE_RENEWAL_PREF':
      await handleRenewalPreferenceChange(transactionInfo, renewalInfo, supabase)
      break

    case 'DID_CHANGE_RENEWAL_STATUS':
      await handleRenewalStatusChange(transactionInfo, renewalInfo, supabase)
      break

    case 'OFFER_REDEEMED':
      await handleOfferRedemption(transactionInfo, renewalInfo, supabase)
      break

    case 'SUBSCRIBED':
      await handleSubscription(transactionInfo, renewalInfo, supabase)
      break

    case 'EXPIRED':
      await handleExpiration(transactionInfo, renewalInfo, supabase)
      break

    case 'GRACE_PERIOD_EXPIRED':
      await handleGracePeriodExpired(transactionInfo, renewalInfo, supabase)
      break

    case 'REFUND':
      await handleRefund(transactionInfo, supabase)
      break

    case 'PRICE_INCREASE':
      await handlePriceIncrease(transactionInfo, renewalInfo, supabase)
      break

    case 'CONSUMPTION_REQUEST':
      await handleConsumptionRequest(transactionInfo, supabase)
      break

    case 'RENEWAL_EXTENDED':
      await handleRenewalExtension(transactionInfo, renewalInfo, supabase)
      break

    case 'REVOKE':
      await handleRevocation(transactionInfo, supabase)
      break

    case 'TEST':
      console.log('📝 Test notification received - no action needed')
      break

    case 'EXTERNAL_PURCHASE_TOKEN':
      await handleExternalPurchaseToken(payload, supabase)
      break

    default:
      console.log(`⚠️ Unhandled notification type: ${notificationType}`)
  }
}

async function decodeJWTPayload(jwt: string): Promise<any> {
  try {
    const parts = jwt.split('.')
    if (parts.length !== 3) return null

    const paddedPayload = parts[1] + '='.repeat((4 - parts[1].length % 4) % 4)
    const decodedBytes = base64Decode(paddedPayload)
    const decodedString = new TextDecoder().decode(decodedBytes)
    
    return JSON.parse(decodedString)
  } catch (error) {
    console.error('❌ Error decoding JWT payload:', error)
    return null
  }
}

// Notification Handlers

async function handleInitialPurchase(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`💰 Initial purchase: ${transaction.productId}`)
  
  // If transaction has appAccountToken, try to find user by it first
  let targetUserId: string | null = null
  if (transaction.appAccountToken) {
    targetUserId = await findUserByAppAccountToken(supabase, transaction.appAccountToken)
  }
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal?.autoRenewStatus || 1,
    environment: transaction.environment,
    status: 'active'
  })
}

async function handleSuccessfulRenewal(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`🔄 Successful renewal: ${transaction.productId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal?.autoRenewStatus || 1,
    environment: transaction.environment,
    status: 'active'
  })
}

async function handleFailedRenewal(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`❌ Failed renewal: ${transaction.productId}`)
  
  // Don't immediately mark as expired - might be in billing retry or grace period
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal?.autoRenewStatus || 0,
    environment: transaction.environment,
    status: 'billing_retry'
  })
}

async function handleExpiration(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`⏰ Subscription expired: ${transaction.productId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: 0,
    environment: transaction.environment,
    status: 'expired'
  })
}

async function handleRefund(transaction: TransactionInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`💸 Refund processed: ${transaction.productId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: 0,
    environment: transaction.environment,
    status: 'refunded'
  })
}

async function handleRevocation(transaction: TransactionInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`🚫 Subscription revoked: ${transaction.productId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: 0,
    environment: transaction.environment,
    status: 'revoked'
  })
}

async function handleRenewalStatusChange(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction || !renewal) return

  const status = renewal.autoRenewStatus === 1 ? 'active' : 'cancelled'
  console.log(`🔄 Renewal status changed: ${status}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal.autoRenewStatus,
    environment: transaction.environment,
    status: status
  })
}

async function handleRenewalPreferenceChange(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction || !renewal) return

  console.log(`🔄 Renewal preference changed to: ${renewal.autoRenewProductId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: renewal.autoRenewProductId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal.autoRenewStatus,
    environment: transaction.environment,
    status: 'active'
  })
}

async function handleSubscription(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`✅ Subscription confirmed: ${transaction.productId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal?.autoRenewStatus || 1,
    environment: transaction.environment,
    status: 'active'
  })
}

async function handleOfferRedemption(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`🎁 Offer redeemed: ${transaction.productId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal?.autoRenewStatus || 1,
    environment: transaction.environment,
    status: 'active'
  })
}

async function handleGracePeriodExpired(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`⏰ Grace period expired: ${transaction.productId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: 0,
    environment: transaction.environment,
    status: 'expired'
  })
}

async function handlePriceIncrease(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction || !renewal) return

  console.log(`💰 Price increase notification: ${transaction.productId}`)
  
  // Update with new renewal info but keep status the same
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal.autoRenewStatus,
    environment: transaction.environment,
    status: 'active'
  })
}

async function handleConsumptionRequest(transaction: TransactionInfo | null, supabase: any) {
  if (!transaction) return
  
  console.log(`📊 Consumption request: ${transaction.productId}`)
  // Handle consumable in-app purchases if you have any
}

async function handleRenewalExtension(transaction: TransactionInfo | null, renewal: RenewalInfo | null, supabase: any) {
  if (!transaction) return

  console.log(`⏰ Renewal extended: ${transaction.productId}`)
  
  await updateUserSubscription(supabase, {
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal?.autoRenewStatus || 1,
    environment: transaction.environment,
    status: 'active'
  })
}

async function handleExternalPurchaseToken(payload: NotificationPayload, supabase: any) {
  console.log('🔗 External purchase token notification')
  
  if (payload.subtype === 'UNREPORTED') {
    console.log('⚠️ Unreported external purchase token detected')
    // Handle unreported external purchase tokens if you support alternative payments in EU
  }
}

// Database Operations

async function updateUserSubscription(supabase: any, subscriptionData: {
  originalTransactionId: string
  productId: string
  expiresDate?: number
  autoRenewStatus: number
  environment: string
  status: string
}) {
  try {
    console.log('📊 SUBSCRIPTION UPDATE DATA:')
    console.log('- Original Transaction ID:', subscriptionData.originalTransactionId)
    console.log('- Product ID:', subscriptionData.productId)
    console.log('- Status:', subscriptionData.status)
    console.log('- Expires:', subscriptionData.expiresDate ? new Date(subscriptionData.expiresDate * 1000) : 'never')

    // Find user by their subscription receipt data containing the original transaction ID
    // Since we store receipt data as text, we'll search for users with this transaction ID
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('id, subscription_receipt_data')
      .or(`subscription_receipt_data.cs.${subscriptionData.originalTransactionId},subscription_product_id.eq.${subscriptionData.productId}`)

    if (findError) {
      console.error('❌ Error finding user:', findError)
      return
    }

    console.log(`🔍 Found ${users?.length || 0} potential matching users`)

    // Filter to find the exact user with this transaction ID
    let targetUserId: string | null = null
    
    if (users && users.length > 0) {
      // If we found users by product ID, try to match by transaction ID in receipt data
      for (const user of users) {
        if (user.subscription_receipt_data && 
            user.subscription_receipt_data.includes(subscriptionData.originalTransactionId)) {
          targetUserId = user.id
          console.log(`✅ Found exact match by transaction ID: ${targetUserId}`)
          break
        }
      }
      
      // If no exact match by transaction ID, use the first user with this product ID
      if (!targetUserId && users.length === 1) {
        targetUserId = users[0].id
        console.log(`⚠️ Using product ID match (no exact transaction match): ${targetUserId}`)
      }
    }

    if (!targetUserId) {
      console.log('⚠️ No user found for transaction:', subscriptionData.originalTransactionId)
      console.log('💡 This might be normal for TEST notifications or new purchases not yet recorded locally')
      return
    }

    const expirationDate = subscriptionData.expiresDate 
      ? new Date(subscriptionData.expiresDate * 1000).toISOString()
      : null

    // Determine subscription status based on the notification type
    let subscriptionStatus = 'free'
    switch (subscriptionData.status) {
      case 'active':
      case 'billing_retry':
        subscriptionStatus = 'premium'
        break
      case 'expired':
      case 'cancelled':
      case 'refunded':
      case 'revoked':
        subscriptionStatus = 'free'
        break
      default:
        subscriptionStatus = 'free'
    }

    console.log(`📝 Updating user ${targetUserId} to subscription status: ${subscriptionStatus}`)

    // Update user subscription data
    const updateData = {
      subscription_status: subscriptionStatus,
      subscription_product_id: subscriptionData.productId,
      subscription_expires_at: expirationDate,
      updated_at: new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', targetUserId)

    if (updateError) {
      console.error('❌ Error updating user subscription:', updateError)
    } else {
      console.log(`✅ Successfully updated user ${targetUserId}:`)
      console.log(`   Status: ${subscriptionStatus}`)
      console.log(`   Product: ${subscriptionData.productId}`)
      console.log(`   Expires: ${expirationDate || 'N/A'}`)
    }

  } catch (error) {
    console.error('❌ Error updating subscription:', error)
  }
}

async function findUserByAppAccountToken(supabase: any, appAccountToken: string): Promise<string | null> {
  try {
    // If you're passing user ID as appAccountToken in StoreKit purchases
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', appAccountToken)
      .single()

    if (error || !user) {
      console.log('❌ User not found by app account token:', appAccountToken)
      return null
    }

    return user.id
  } catch (error) {
    console.error('❌ Error finding user by app account token:', error)
    return null
  }
}