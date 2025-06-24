// app/api/webhooks/app-store/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for webhook
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface AppStoreNotification {
  signedPayload: string;
}

interface NotificationPayload {
  notificationType: string;
  subtype?: string;
  notificationUUID: string;
  data?: {
    appAppleId?: number;
    bundleId?: string;
    bundleVersion?: string;
    environment?: string;
    signedTransactionInfo?: string;
    signedRenewalInfo?: string;
  };
  version?: string;
}

interface TransactionInfo {
  transactionId: string;
  originalTransactionId: string;
  bundleId: string;
  productId: string;
  subscriptionGroupIdentifier: string;
  purchaseDate: number;
  originalPurchaseDate: number;
  expiresDate?: number;
  quantity: number;
  type: string;
  appAccountToken?: string;
  inAppOwnershipType: string;
  signedDate: number;
  environment: string;
  transactionReason?: string;
  storefront?: string;
  storefrontId?: string;
  price?: number;
  currency?: string;
}

interface RenewalInfo {
  originalTransactionId: string;
  autoRenewProductId: string;
  productId: string;
  autoRenewStatus: number;
  environment: string;
  recentSubscriptionStartDate: number;
  renewalDate?: number;
  renewalPrice?: number;
  currency?: string;
  signedDate: number;
  gracePeriodExpiresDate?: number;
  offerType?: number;
  offerIdentifier?: string;
}

// Add a union type for decoded payloads
type DecodedPayload = TransactionInfo | RenewalInfo | Record<string, unknown>;

// Test endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'App Store Server Notifications webhook is running',
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing'
    }
  });
}

// Main webhook endpoint
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Handle simulation for testing via query parameter
    if (url.searchParams.get('simulate') === 'true') {
      console.log('🧪 Simulating App Store notification...');
      
      // Create a test user first
      const testUserId = randomUUID();
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: testUserId,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'parent',
          subscription_status: 'free'
        });
      
      if (createError) {
        console.error('❌ Error creating test user:', createError);
        return NextResponse.json(
          { error: 'Failed to create test user', details: createError },
          { status: 500 }
        );
      }
      
      // Simulate updating subscription
      await updateUserSubscription({
        originalTransactionId: 'test_transaction_123',
        productId: 'chores_ai_premium_monthly',
        expiresDate: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000), // 30 days from now
        autoRenewStatus: 1,
        environment: 'Sandbox',
        status: 'active'
      });
      
      return NextResponse.json({
        success: true,
        message: 'Test subscription update completed',
        testUserId: testUserId
      });
    }

    // Parse the notification payload from Apple
    const notification: AppStoreNotification = await request.json();
    console.log('📱 Received App Store Server Notification');

    // Decode the signed payload
    const decodedPayload = await decodeAndVerifyNotification(notification.signedPayload);
    
    if (!decodedPayload) {
      console.error('❌ Failed to decode or verify notification payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    console.log(`📋 Notification Type: ${decodedPayload.notificationType}`);
    console.log(`🆔 Notification UUID: ${decodedPayload.notificationUUID}`);

    // Process the notification based on type
    await processNotification(decodedPayload);

    // Respond with success
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('❌ Error processing App Store notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function decodeAndVerifyNotification(signedPayload: string): Promise<NotificationPayload | null> {
  try {
    // Split the JWT into its three parts
    const parts = signedPayload.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Decode the payload (second part)
    const payloadPart = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payloadPart + '='.repeat((4 - payloadPart.length % 4) % 4);
    
    const decodedBytes = Buffer.from(paddedPayload, 'base64url');
    const decodedString = decodedBytes.toString('utf-8');
    
    const payload: NotificationPayload = JSON.parse(decodedString);
    
    console.log('✅ Successfully decoded notification payload');
    
    return payload;
  } catch (error) {
    console.error('❌ Error decoding notification:', error);
    return null;
  }
}

// Add a union type for decoded payloads
// type DecodedPayload = TransactionInfo | RenewalInfo | Record<string, unknown>;

async function decodeJWTPayload(jwt: string): Promise<DecodedPayload | null> {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;

    const paddedPayload = parts[1] + '='.repeat((4 - parts[1].length % 4) % 4);
    const decodedBytes = Buffer.from(paddedPayload, 'base64url');
    const decodedString = decodedBytes.toString('utf-8');
    
    return JSON.parse(decodedString) as DecodedPayload;
  } catch (error) {
    console.error('❌ Error decoding JWT payload:', error);
    return null;
  }
}

async function processNotification(payload: NotificationPayload) {
  const { notificationType, subtype, data } = payload;

  // Enhanced logging for debugging
  console.log('🔍 WEBHOOK DEBUG INFO:');
  console.log('- Notification Type:', notificationType);
  console.log('- Subtype:', subtype || 'none');
  console.log('- UUID:', payload.notificationUUID);
  console.log('- Data present:', !!data);
  console.log('- Environment:', data?.environment || 'unknown');

  // Decode transaction and renewal info if present
  let transactionInfo: TransactionInfo | null = null;
  let renewalInfo: RenewalInfo | null = null;

  if (data?.signedTransactionInfo) {
    const decoded = await decodeJWTPayload(data.signedTransactionInfo);
    transactionInfo = decoded as TransactionInfo | null;
    console.log('📱 Transaction Info decoded:', !!transactionInfo);
  }

  if (data?.signedRenewalInfo) {
    const decoded = await decodeJWTPayload(data.signedRenewalInfo);
    renewalInfo = decoded as RenewalInfo | null;
    console.log('🔄 Renewal Info decoded:', !!renewalInfo);
  }

  console.log(`🔄 Processing notification: ${notificationType}${subtype ? ` (${subtype})` : ''}`);

  switch (notificationType) {
    case 'INITIAL_BUY':
    case 'DID_RENEW':
    case 'SUBSCRIBED':
    case 'OFFER_REDEEMED':
      await handleActiveSubscription(transactionInfo, renewalInfo);
      break;

    case 'DID_FAIL_TO_RENEW':
      await handleFailedRenewal(transactionInfo, renewalInfo);
      break;

    case 'EXPIRED':
    case 'GRACE_PERIOD_EXPIRED':
    case 'DID_CHANGE_RENEWAL_STATUS':
      await handleExpiration(transactionInfo, renewalInfo);
      break;

    case 'REFUND':
    case 'REVOKE':
      await handleRefund(transactionInfo);
      break;

    case 'TEST':
      console.log('📝 Test notification received - no action needed');
      break;

    default:
      console.log(`⚠️ Unhandled notification type: ${notificationType}`);
  }
}

async function handleActiveSubscription(transaction: TransactionInfo | null, renewal: RenewalInfo | null) {
  if (!transaction) return;

  console.log(`💰 Active subscription: ${transaction.productId}`);
  
  await updateUserSubscription({
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal?.autoRenewStatus || 1,
    environment: transaction.environment,
    status: 'active'
  });
}

async function handleFailedRenewal(transaction: TransactionInfo | null, renewal: RenewalInfo | null) {
  if (!transaction) return;

  console.log(`❌ Failed renewal: ${transaction.productId}`);
  
  await updateUserSubscription({
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: renewal?.autoRenewStatus || 0,
    environment: transaction.environment,
    status: 'billing_retry'
  });
}

async function handleExpiration(transaction: TransactionInfo | null, renewal: RenewalInfo | null) {
  if (!transaction) return;

  console.log(`⏰ Subscription expired: ${transaction.productId}`);
  console.log('- Renewal Info:', renewal);
  
  await updateUserSubscription({
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: 0,
    environment: transaction.environment,
    status: 'expired'
  });
}

async function handleRefund(transaction: TransactionInfo | null) {
  if (!transaction) return;

  console.log(`💸 Refund/Revocation: ${transaction.productId}`);
  
  await updateUserSubscription({
    originalTransactionId: transaction.originalTransactionId,
    productId: transaction.productId,
    expiresDate: transaction.expiresDate,
    autoRenewStatus: 0,
    environment: transaction.environment,
    status: 'refunded'
  });
}

async function updateUserSubscription(subscriptionData: {
  originalTransactionId: string;
  productId: string;
  expiresDate?: number;
  autoRenewStatus: number;
  environment: string;
  status: string;
}) {
  try {
    console.log('📊 SUBSCRIPTION UPDATE DATA:');
    console.log('- Original Transaction ID:', subscriptionData.originalTransactionId);
    console.log('- Product ID:', subscriptionData.productId);
    console.log('- Status:', subscriptionData.status);
    console.log('- Expires:', subscriptionData.expiresDate ? new Date(subscriptionData.expiresDate * 1000) : 'never');

    // Find user by their subscription receipt data containing the original transaction ID
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('id, subscription_receipt_data')
      .or(`subscription_receipt_data.cs.${subscriptionData.originalTransactionId},subscription_product_id.eq.${subscriptionData.productId}`);

    if (findError) {
      console.error('❌ Error finding user:', findError);
      return;
    }

    console.log(`🔍 Found ${users?.length || 0} potential matching users`);

    // Filter to find the exact user with this transaction ID
    let targetUserId: string | null = null;
    
    if (users && users.length > 0) {
      // Try to match by transaction ID in receipt data
      for (const user of users) {
        if (user.subscription_receipt_data && 
            user.subscription_receipt_data.includes(subscriptionData.originalTransactionId)) {
          targetUserId = user.id;
          console.log(`✅ Found exact match by transaction ID: ${targetUserId}`);
          break;
        }
      }
      
      // If no exact match by transaction ID, use the first user with this product ID
      if (!targetUserId && users.length === 1) {
        targetUserId = users[0].id;
        console.log(`⚠️ Using product ID match: ${targetUserId}`);
      }
    }

    if (!targetUserId) {
      console.log('⚠️ No user found for transaction:', subscriptionData.originalTransactionId);
      return;
    }

    const expirationDate = subscriptionData.expiresDate 
      ? new Date(subscriptionData.expiresDate * 1000).toISOString()
      : null;

    // Determine subscription status
    let subscriptionStatus = 'free';
    switch (subscriptionData.status) {
      case 'active':
      case 'billing_retry':
        subscriptionStatus = 'premium';
        break;
      case 'expired':
      case 'cancelled':
      case 'refunded':
      case 'revoked':
        subscriptionStatus = 'free';
        break;
      default:
        subscriptionStatus = 'free';
    }

    console.log(`📝 Updating user ${targetUserId} to subscription status: ${subscriptionStatus}`);

    // Update user subscription data
    const updateData = {
      subscription_status: subscriptionStatus,
      subscription_product_id: subscriptionData.productId,
      subscription_expires_at: expirationDate,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', targetUserId);

    if (updateError) {
      console.error('❌ Error updating user subscription:', updateError);
    } else {
      console.log(`✅ Successfully updated user ${targetUserId}:`);
      console.log(`   Status: ${subscriptionStatus}`);
      console.log(`   Product: ${subscriptionData.productId}`);
      console.log(`   Expires: ${expirationDate || 'N/A'}`);
    }

  } catch (error) {
    console.error('❌ Error updating subscription:', error);
  }
}