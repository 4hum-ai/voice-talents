import { ref, onUnmounted } from 'vue'
import {
  loadStripe,
  type Stripe,
  type StripeCheckout,
  type Appearance,
  type CssFontSource,
} from '@stripe/stripe-js'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

/**
 * Composable for embedded Stripe checkout payment element
 * Handles mounting and managing the Stripe payment element for embedded checkout
 */
export function useStripeEmbedded() {
  const stripe = ref<Stripe | null>(null)
  const checkout = ref<StripeCheckout | undefined>()
  const paymentElementRef = ref<{ unmount?: () => void; submit?: () => Promise<void> } | null>(null) // Payment element instance
  const containerElement = ref<HTMLElement | null>(null)
  const clientSecretRef = ref<string | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  const authStore = useAuthStore()
  const { mode: theme } = useTheme()

  /**
   * Initialize Stripe with publishable key
   */
  const initializeStripe = async (): Promise<Stripe | null> => {
    if (stripe.value) {
      return stripe.value
    }

    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      console.error('VITE_STRIPE_PUBLISHABLE_KEY is not set in environment variables')
      return null
    }

    const stripeInstance = await loadStripe(publishableKey)
    stripe.value = stripeInstance
    return stripeInstance
  }

  /**
   * Create and mount payment element with clientSecret
   * For ui_mode: "custom", we use initCheckout with checkout session client secret
   */
  const mountPaymentElement = async (
    clientSecret: string,
    container: HTMLElement,
  ): Promise<void> => {
    isLoading.value = true

    try {
      // Initialize Stripe if not already done
      const stripeInstance = await initializeStripe()
      if (!stripeInstance) {
        throw new Error('Failed to initialize Stripe')
      }

      // Clean up existing checkout if any
      if (paymentElementRef.value) {
        try {
          if (paymentElementRef.value.unmount) {
            paymentElementRef.value.unmount()
          }
        } catch (error) {
          console.error('Error unmounting existing payment element:', error)
        }
        paymentElementRef.value = null
      }
      checkout.value = undefined

      // Configure appearance based on theme
      const appearance: Appearance = {
        theme: theme.value === 'dark' ? 'night' : 'stripe',
        variables: {
          colorPrimary: theme.value === 'dark' ? '#3b82f6' : '#3182ce',
          colorBackground: theme.value === 'dark' ? '#09090b' : '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }

      const cssFontSource: CssFontSource = {
        cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
      }

      // Store clientSecret for later use
      clientSecretRef.value = clientSecret

      // For ui_mode: "custom", use initCheckout with checkout session client secret
      // Pass clientSecret directly (not fetchClientSecret)
      // Note: Email prefilling for embedded checkout is handled at the session creation level
      // (customer_email parameter in useStripePayment.createCheckoutSession)
      checkout.value = await stripeInstance.initCheckout({
        clientSecret, // Checkout session client secret (cs_live_...)
        elementsOptions: {
          appearance,
          fonts: [cssFontSource],
        },
      })

      // Create and mount payment element
      const element = checkout.value.createPaymentElement()
      await element.mount(container)
      containerElement.value = container
      isInitialized.value = true

      // Store the element for potential submit
      paymentElementRef.value = element
    } catch (error) {
      console.error('Error mounting payment element:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Confirm payment using Stripe Checkout
   * For ui_mode: "custom" checkout sessions, the payment element handles submission
   * We need to find and click the submit button within the payment element
   */
  const confirmPayment = async (): Promise<void> => {
    if (!checkout.value || !paymentElementRef.value || !containerElement.value) {
      throw new Error('Payment element not initialized')
    }

    if (!authStore.user?.email) {
      throw new Error('User email is required for payment')
    }

    try {
      // For checkout sessions with ui_mode: "custom", the payment element
      // has its own submit button. We need to find and click it.
      // The payment element is mounted in the container, so we look for the submit button there

      // Wait a bit for the payment element to fully render
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Look for the submit button within the payment element container
      // Stripe payment elements typically have a button with specific classes or attributes
      const submitButton = containerElement.value.querySelector(
        'button[type="submit"], button[data-testid*="submit"], button[data-testid*="pay"], .SubmitButton, button:not([type="button"])',
      ) as HTMLButtonElement

      if (submitButton && !submitButton.disabled) {
        submitButton.click()
        return
      }

      // Alternative: Try to trigger form submission if there's a form
      const form = containerElement.value.querySelector('form') as HTMLFormElement
      if (form) {
        const formSubmitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
        if (formSubmitButton) {
          formSubmitButton.click()
          return
        }
        // If no submit button, try submitting the form directly
        form.requestSubmit()
        return
      }

      // If we can't find a submit button, the payment element might handle it automatically
      // when the user interacts with it. In this case, we might not need manual confirmation.
      // However, for better UX, we should show an error or message to the user.
      throw new Error(
        'Unable to find payment submit button. Please complete the payment form and click the submit button within the payment element.',
      )
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw error instanceof Error ? error : new Error('Failed to confirm payment')
    }
  }

  /**
   * Clean up payment element
   */
  const unmountPaymentElement = async (): Promise<void> => {
    // Unmount the payment element first
    if (paymentElementRef.value) {
      try {
        if (paymentElementRef.value.unmount) {
          paymentElementRef.value.unmount()
        }
      } catch (error) {
        console.error('Error unmounting payment element:', error)
      }
      paymentElementRef.value = null
    }

    // Clean up checkout reference (no destroy method available)
    checkout.value = undefined
    containerElement.value = null
    clientSecretRef.value = null
    isInitialized.value = false
  }

  // Cleanup on unmount
  onUnmounted(() => {
    unmountPaymentElement()
  })

  return {
    stripe,
    checkout,
    isLoading,
    isInitialized,
    mountPaymentElement,
    confirmPayment,
    unmountPaymentElement,
  }
}
