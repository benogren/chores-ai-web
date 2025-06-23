import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  console.log(`📧 Received ${req.method} request to send-push-notification`);
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return new Response('Method not allowed', {
        status: 405
      });
    }
    
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('❌ Missing authorization header');
      return new Response('Missing authorization header', {
        status: 401
      });
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log('🔗 Supabase URL:', supabaseUrl);
    console.log('🔑 Service key configured:', !!supabaseServiceKey);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse the request body
    const payload = await req.json();
    console.log('📦 Payload received:', {
      userIds: payload.userIds,
      title: payload.title,
      body: payload.body,
      dataKeys: Object.keys(payload.data || {})
    });
    
    // Validate userIds are UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = payload.userIds.filter((id) => !uuidRegex.test(id));
    if (invalidIds.length > 0) {
      console.log('❌ Invalid UUIDs detected:', invalidIds);
      return new Response(JSON.stringify({
        error: 'Invalid user IDs provided',
        invalidIds: invalidIds
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 400
      });
    }
    console.log('✅ All user IDs are valid UUIDs');
    
    console.log('🔍 Fetching users from database...');
    // Get device tokens for the specified users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, device_token, platform, first_name')
      .in('id', payload.userIds)
      .not('device_token', 'is', null);
      
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return new Response(JSON.stringify({
        error: 'Error fetching users',
        details: usersError
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 500
      });
    }
    
    console.log(`📊 Found ${users?.length || 0} users with device tokens`);
    if (!users || users.length === 0) {
      console.log('⚠️ No users found with device tokens for IDs:', payload.userIds);
      // Let's also check if the users exist at all
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('id, first_name, device_token')
        .in('id', payload.userIds);
      console.log('🔍 All matching users (including those without tokens):', allUsers);
      
      return new Response(JSON.stringify({
        message: 'No users found with device tokens',
        requestedIds: payload.userIds,
        foundUsers: allUsers?.map((u) => ({
          id: u.id,
          name: u.first_name,
          hasToken: !!u.device_token
        })) || []
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 200
      });
    }
    
    // Log user details
    users.forEach((user) => {
      console.log(`👤 User: ${user.first_name} (${user.id})`);
      console.log(`📱 Platform: ${user.platform}`);
      console.log(`🔑 Has device token: ${!!user.device_token}`);
    });
    
    // Prepare APNs payload
    const apnsPayload = {
      aps: {
        alert: {
          title: payload.title,
          body: payload.body
        },
        sound: 'default'
      },
      data: payload.data || {}
    };
    console.log('📤 APNs payload prepared:', apnsPayload);
    
    // Get APNs credentials from environment
    const apnsKeyId = Deno.env.get('APNS_KEY_ID');
    const apnsTeamId = Deno.env.get('APNS_TEAM_ID');
    const apnsPrivateKey = Deno.env.get('APNS_PRIVATE_KEY');
    const apnsBundleId = Deno.env.get('APNS_BUNDLE_ID');
    
    console.log('🔐 APNs credentials check:');
    console.log('  Key ID:', !!apnsKeyId, apnsKeyId ? `(${apnsKeyId.substring(0, 4)}...)` : '');
    console.log('  Team ID:', !!apnsTeamId, apnsTeamId ? `(${apnsTeamId.substring(0, 4)}...)` : '');
    console.log('  Private Key:', !!apnsPrivateKey, apnsPrivateKey ? `(${apnsPrivateKey.length} chars)` : '');
    console.log('  Bundle ID:', !!apnsBundleId, apnsBundleId || '');
    
    if (!apnsKeyId || !apnsTeamId || !apnsPrivateKey || !apnsBundleId) {
      console.error('❌ Missing APNs configuration');
      return new Response(JSON.stringify({
        error: 'Missing APNs configuration',
        missing: {
          keyId: !apnsKeyId,
          teamId: !apnsTeamId,
          privateKey: !apnsPrivateKey,
          bundleId: !apnsBundleId
        }
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 500
      });
    }
    
    // Send notifications to each device
    const results = [];
    for (const user of users) {
      if (user.platform === 'ios' && user.device_token) {
        console.log(`📱 Sending notification to ${user.first_name}...`);
        try {
          const result = await sendAPNSNotification(user.device_token, apnsPayload, {
            keyId: apnsKeyId,
            teamId: apnsTeamId,
            privateKey: apnsPrivateKey,
            bundleId: apnsBundleId
          });
          
          results.push({
            userId: user.id,
            userName: user.first_name,
            deviceToken: user.device_token.substring(0, 8) + '...',
            success: true,
            response: result
          });
          
          console.log(`✅ Notification sent to ${user.first_name}`);
        } catch (error) {
          console.error(`❌ Failed to send notification to ${user.first_name}:`, error);
          results.push({
            userId: user.id,
            userName: user.first_name,
            deviceToken: user.device_token.substring(0, 8) + '...',
            success: false,
            error: error.message
          });
        }
      }
    }
    
    const response = {
      success: true,
      results: results,
      totalSent: results.filter((r) => r.success).length,
      totalFailed: results.filter((r) => !r.success).length,
      summary: {
        requested: payload.userIds.length,
        foundWithTokens: users.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length
      }
    };
    
    console.log('📊 Final results:', response.summary);
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
    
  } catch (error) {
    console.error('💥 Unexpected error in send-push-notification function:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});

// REAL APNs Implementation (replaces the simulation)
async function sendAPNSNotification(deviceToken, payload, config) {
  console.log(`🚀 Sending REAL APNs notification...`);
  console.log(`📱 Device token: ${deviceToken.substring(0, 8)}...`);
  console.log(`📦 Bundle ID: ${config.bundleId}`);
  
  try {
    // Generate JWT token for APNs authentication
    const jwt = await generateAPNSJWT(config.keyId, config.teamId, config.privateKey);
    console.log(`🔐 JWT generated successfully (${jwt.length} chars)`);
    
    // Use production APNs endpoint (change to api.sandbox.push.apple.com for development)
    // const apnsUrl = `https://api.push.apple.com/3/device/${deviceToken}`;
    
    // For development, use the sandbox endpoint
    const apnsUrl = `https://api.sandbox.push.apple.com/3/device/${deviceToken}`;
    
    console.log(`📤 Sending to APNs: ${apnsUrl.substring(0, 50)}...`);
    console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));
    
    const response = await fetch(apnsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
        'apns-topic': config.bundleId,
        'apns-priority': '10',
        'apns-push-type': 'alert'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    
    console.log(`📊 APNs response status: ${response.status}`);
    console.log(`📊 APNs response headers:`, Object.fromEntries(response.headers.entries()));
    console.log(`📊 APNs response body: ${responseText}`);
    
    if (!response.ok) {
      console.error(`❌ APNs request failed: ${response.status} ${responseText}`);
      throw new Error(`APNs request failed: ${response.status} ${responseText}`);
    }

    console.log(`✅ Notification sent successfully to APNs!`);
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      timestamp: new Date().toISOString(),
      message: 'Real notification sent to APNs'
    };
    
  } catch (error) {
    console.error(`❌ Error sending APNs notification:`, error);
    throw error;
  }
}

async function generateAPNSJWT(keyId, teamId, privateKey) {
  console.log('🔐 Generating APNs JWT...');
  
  try {
    const header = {
      alg: 'ES256',
      kid: keyId
    };

    const payload = {
      iss: teamId,
      iat: Math.floor(Date.now() / 1000)
    };

    // Encode header and payload
    const encoder = new TextEncoder();
    const headerB64 = btoa(JSON.stringify(header))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    const payloadB64 = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const signingInput = `${headerB64}.${payloadB64}`;
    
    // Clean up the private key format
    const privateKeyPem = privateKey.replace(/\\n/g, '\n');
    
    // Parse the PEM key
    const keyData = privateKeyPem
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\s/g, '');
    
    // Convert base64 to ArrayBuffer
    const keyBuffer = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    
    // Import the private key for ES256 signing
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      false,
      ['sign']
    );
    
    // Sign the JWT
    const signature = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      cryptoKey,
      encoder.encode(signingInput)
    );
    
    // Convert signature to base64url
    const signatureArray = new Uint8Array(signature);
    const signatureB64 = btoa(String.fromCharCode(...signatureArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const jwt = `${signingInput}.${signatureB64}`;
    console.log(`✅ JWT generated successfully`);
    
    return jwt;
    
  } catch (error) {
    console.error('❌ JWT generation failed:', error);
    throw new Error(`JWT generation failed: ${error.message}`);
  }
}