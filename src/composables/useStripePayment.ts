import { ref } from 'vue'
import { useApiGateway } from '@/utils/useApiGateway'
import { useToast } from '@/lib/toast'
import { useAuth } from '@/lib/auth'

export interface StripeCheckoutSession {
  id: string
  url?: string
  clientSecret?: string
}

export interface StripeLineItem {
  /** Stripe Price ID (e.g., price_1234) - preferred if available */
  price?: string
  /** Price data for dynamic pricing (used if price ID not available) */
  price_data?: {
    currency: string
    product_data: {
      name: string
      description?: string
    }
    unit_amount: number // Amount in cents
  }
  quantity: number
}

export interface CreateCheckoutSessionParams {
  /** Line items for the checkout session */
  line_items: StripeLineItem[]
  /** Payment mode: 'payment' for one-time, 'subscription' for recurring */
  mode?: 'payment' | 'subscription'
  /** Return URL for embedded checkout (replaces success_url/cancel_url) */
  return_url?: string
  /** Job ID for reference */
  jobId?: string
  /** Metadata to attach to the session */
  metadata?: Record<string, string>
}

/**
 * Composable for Stripe payment integration
 * Handles creating checkout sessions and processing payments
 */
export function useStripePayment() {
  const apiClient = useApiGateway('billing')
  const { error } = useToast()
  const { user } = useAuth()

  const isLoading = ref(false)
  const isProcessing = ref(false)
  const errorMessage = ref<string | null>(null)

  /**
   * Create a Stripe Checkout session
   * @param params - Checkout session parameters
   * @returns Checkout session with URL to redirect user
   */
  const createCheckoutSession = async (
    params: CreateCheckoutSessionParams,
  ): Promise<StripeCheckoutSession> => {
    isLoading.value = true
    errorMessage.value = null

    try {
      if (!user.value?.id) {
        throw new Error('User must be authenticated to create payment session')
      }

      // Format request for Stripe hosted checkout (redirect)
      // For hosted checkout, we use success_url and cancel_url (NOT ui_mode: "custom")
      // Backend will assume ui_mode: "custom" if not specified, so we must explicitly set it
      // For hosted checkout, we should NOT use ui_mode or set it to null/undefined
      const baseUrl = params.return_url?.split('?')[0] || `${window.location.origin}/client/jobs`

      // Check if modal parameter exists in return_url or current URL
      let modalParam = ''
      if (params.return_url?.includes('modal=')) {
        const urlParams = new URLSearchParams(params.return_url.split('?')[1])
        if (urlParams.has('modal')) {
          modalParam = `&modal=${urlParams.get('modal')}`
        }
      } else {
        const currentUrlParams = new URLSearchParams(window.location.search)
        if (currentUrlParams.has('modal')) {
          modalParam = `&modal=${currentUrlParams.get('modal')}`
        }
      }

      const successUrl =
        params.return_url ||
        `${baseUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}${modalParam}`
      const cancelUrl = `${baseUrl}?payment=cancelled${modalParam}`

      const sessionData: Record<string, unknown> = {
        mode: params.mode || 'payment', // One-time payment (not subscription)
        line_items: params.line_items,
        success_url: successUrl,
        cancel_url: cancelUrl,
        // Explicitly set ui_mode to 'hosted' for hosted checkout (redirect)
        // This prevents backend from assuming 'custom' which conflicts with success_url/cancel_url
        ui_mode: 'hosted', // Hosted checkout uses success_url and cancel_url
        // Prefill email in checkout form
        customer_email: user.value.email || undefined,
        metadata: {
          jobId: params.jobId || '',
          userId: user.value.id,
          userEmail: user.value.email || '',
          ...params.metadata,
        },
      }

      // Create checkout session via API
      // Endpoint: /billing/create-checkout-sessions (matches viewer app pattern)
      const response = await apiClient.post('/create-checkout-sessions', sessionData)

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      // Handle response format - could be direct or wrapped in data property
      const responseData =
        (data as { data?: StripeCheckoutSession }).data || (data as StripeCheckoutSession)

      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response from payment service')
      }

      const session = responseData as StripeCheckoutSession

      // For embedded checkout (ui_mode: custom), we need clientSecret
      // For hosted checkout, we'd get url instead
      if (!session.clientSecret && !session.url) {
        throw new Error('Invalid checkout session response: missing clientSecret or url')
      }

      // Ensure we have an id (session ID)
      if (!session.id) {
        throw new Error('Invalid checkout session response: missing session id')
      }

      return session
    } catch (err) {
      let message = 'Failed to create payment session'

      if (err instanceof Error) {
        // Check for 404 - backend endpoint not implemented
        if (err.message.includes('404') || err.message.includes('Not Found')) {
          message =
            'Payment service not available. Backend endpoint /billing/create-checkout-sessions needs to be implemented.'
        } else {
          message = err.message
        }
      }

      errorMessage.value = message
      error(message)
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verify payment status for a checkout session
   * @param sessionId - Stripe checkout session ID
   * @returns Payment status and job ID if payment was successful
   */
  const verifyPayment = async (
    sessionId: string,
  ): Promise<{
    status: 'paid' | 'unpaid' | 'pending'
    jobId?: string
    paymentIntentId?: string
  }> => {
    isProcessing.value = true
    errorMessage.value = null

    try {
      // Verify payment status via API (similar to viewer app pattern)
      const response = await apiClient.get(`/session-status?session_id=${sessionId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data as {
        status: 'paid' | 'unpaid' | 'pending'
        jobId?: string
        paymentIntentId?: string
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify payment'
      errorMessage.value = message
      error(message)
      throw err
    } finally {
      isProcessing.value = false
    }
  }

  /**
   * Redirect user to Stripe Checkout
   * @param checkoutUrl - Stripe Checkout session URL
   */
  const redirectToCheckout = (checkoutUrl: string): void => {
    window.location.href = checkoutUrl
  }

  return {
    isLoading,
    isProcessing,
    errorMessage,
    createCheckoutSession,
    verifyPayment,
    redirectToCheckout,
  }
}
