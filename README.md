# Type-safe payments with Next.js TypeScript and react-stripe-js

This is a full-stack TypeScript sample using:

- Frontend:
  - [Next.js 9](https://nextjs.org/blog/next-9) for [SSR](https://nextjs.org/features/server-side-rendering)
  - [react-stripe-js](https://github.com/stripe/react-stripe-js) for [Checkout](https://stripe.com/checkout) and [Elements](https://stripe.com/elements)
- Backend
  - Next.js 9 [API routes](https://nextjs.org/blog/next-9#api-routes)
  - [stripe-node with TypeScript](https://github.com/stripe/stripe-node#usage-with-typescript)

## Included functionality

- Custom Next.js App to load Stripe.js in the `<head></head>`: [pages/\_app.js](pages/_app.js)
- Making .env variables available to next: [next.config.js](next.config.js)
- Fetching product data from the Stripe API:
  - Frontend: [pages/products/index.tsx](pages/products/index.tsx)
  - Backend: [pages/api/products/index.ts](pages/api/products/index.ts)
- Implementation of `StripeProvider` that sets up Stripe.js and Elements for usage with SSR via `useEffect` hook: [components/StripeProvider.tsx](components/StripeProvider.tsx)
- Custom Amount Donation with redirecting to Stripe Checkout:
  - Frontend: [pages/products/donate-with-checkout.tsx](pages/products/donate-with-checkout.tsx)
  - Backend: [pages/api/checkout_sessions/](pages/api/checkout_sessions/)
- Custom Amount Donation with Stripe Elements (no redirect; [server-side confirmation](https://stripe.com/docs/payments/accept-a-payment-synchronously#web)):
  - Frontend: [pages/products/donate-with-elements.tsx](pages/products/donate-with-checkout.tsx)
  - Backend: [pages/api/payment_intents/](pages/api/payment_intents/)
- Helpers
  - [utils/api-helpers.ts](utils/api-helpers.ts)
    - `isomorphic-unfetch` helpers for GET and POST requests
  - [utils/stripe-helpers.ts](utils/stripe-helpers.ts)
    - Format amount strings properly using `Intl.NumberFormat`
    - Format amount for usage with Stripe, including zero decimal currency detection
  - [ambient.d.ts](ambient.d.ts)
    - Needed to exclude react-stripe-js from type checking (_can be removed once react-stripe-js ships with types_)

## Setup:

    npm install
    npm run dev
