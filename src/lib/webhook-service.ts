import crypto from 'crypto';

/**
 * Webhook service for sending outgoing webhooks with HMAC signature
 */

/**
 * Generate HMAC signature for webhook payload
 * @param payload - The data to sign (will be JSON stringified)
 * @param secret - The secret key for signing
 * @returns The HMAC-SHA256 signature as a hex string
 */
export function generateWebhookSignature(payload: object, secret: string): string {
  const payloadString = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');
}

/**
 * Webhook payload structure
 */
export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: object;
}

/**
 * Webhook response structure
 */
export interface WebhookResponse {
  success: boolean;
  statusCode?: number;
  responseBody?: string;
  error?: string;
}

/**
 * Trigger a webhook by sending POST request to WEBHOOK_URL with HMAC signature
 * @param event - The event type/name
 * @param data - The event data payload
 * @returns Promise resolving to webhook response
 */
export async function triggerWebhook(
  event: string, 
  data: object
): Promise<WebhookResponse> {
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookUrl) {
    console.warn('[Webhook] WEBHOOK_URL environment variable is not set');
    return {
      success: false,
      error: 'WEBHOOK_URL environment variable is not set',
    };
  }

  if (!webhookSecret) {
    console.warn('[Webhook] WEBHOOK_SECRET environment variable is not set');
    return {
      success: false,
      error: 'WEBHOOK_SECRET environment variable is not set',
    };
  }

  // Construct payload
  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  // Generate HMAC signature
  const signature = generateWebhookSignature(payload, webhookSecret);

  try {
    console.log(`[Webhook] Sending ${event} event to ${webhookUrl}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature,
        'x-webhook-event': event,
        'x-webhook-timestamp': payload.timestamp,
      },
      body: JSON.stringify(payload),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      console.error(`[Webhook] Failed with status ${response.status}: ${responseBody}`);
      return {
        success: false,
        statusCode: response.status,
        responseBody,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    console.log(`[Webhook] Successfully sent ${event} event`);
    return {
      success: true,
      statusCode: response.status,
      responseBody,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Webhook] Error sending request: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify incoming webhook signature
 * @param payload - The raw request body (as string)
 * @param signature - The signature from x-webhook-signature header
 * @param secret - The secret key for verification
 * @returns boolean indicating if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    // Use timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Batch trigger webhooks for multiple events
 * @param events - Array of event objects with event name and data
 * @returns Promise resolving to array of webhook responses
 */
export async function triggerBatchWebhooks(
  events: Array<{ event: string; data: object }>
): Promise<WebhookResponse[]> {
  const results = await Promise.all(
    events.map(({ event, data }) => triggerWebhook(event, data))
  );
  return results;
}
