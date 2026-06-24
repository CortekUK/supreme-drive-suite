import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  // Fail loud rather than silently falling back to a test key in production
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not set — payments will not work.');
}

// Initialize Stripe with the publishable key from the environment
export const stripePromise = loadStripe(publishableKey ?? '');
