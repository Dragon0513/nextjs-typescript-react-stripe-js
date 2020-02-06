# Type-safe payments with Next.js TypeScript and react-stripe-js

This is a full-stack TypeScript sample using:

- Frontend:
  - [Next.js 9](https://nextjs.org/blog/next-9) for [SSR](https://nextjs.org/features/server-side-rendering)
  - [react-stripe-js](https://github.com/stripe/react-stripe-js) for [Checkout](https://stripe.com/checkout) and [Elements](https://stripe.com/elements)
- Backend
  - Next.js 9 [API routes](https://nextjs.org/blog/next-9#api-routes)
  - [stripe-node with TypeScript](https://github.com/stripe/stripe-node#usage-with-typescript)

## Included functionality

- Making .env variables available to next: [next.config.js](next.config.js)
- Implementation of a Layout component that loads and sets up Stripe.js and Elements for usage with SSR via `loadStripe` helper: [components/Layout.tsx](components/Layout.tsx)
- Custom Amount Donation with redirecting to Stripe Checkout:
  - Frontend: [pages/donate-with-checkout.tsx](pages/donate-with-checkout.tsx)
  - Backend: [pages/api/checkout_sessions/](pages/api/checkout_sessions/)
- Custom Amount Donation with Stripe Elements (no redirect; [server-side confirmation](https://stripe.com/docs/payments/accept-a-payment-synchronously#web)):
  - Frontend: [pages/donate-with-elements.tsx](pages/donate-with-checkout.tsx)
  - Backend: [pages/api/payment_intents/](pages/api/payment_intents/)
- Webhook handling
  - By default Next.js API routes are same-origin only. To allow Stripe webhook event requests to reach out API route, we need to add `micro-cors` and [verify the webhook signature](https://stripe.com/docs/webhooks/signatures) of the event. All of this happens in [pages/api/webhooks/index.ts](pages/api/webhooks/index.ts)
- Helpers
  - [utils/api-helpers.ts](utils/api-helpers.ts)
    - `isomorphic-unfetch` helpers for GET and POST requests
  - [utils/stripe-helpers.ts](utils/stripe-helpers.ts)
    - Format amount strings properly using `Intl.NumberFormat`
    - Format amount for usage with Stripe, including zero decimal currency detection
  - [ambient.d.ts](ambient.d.ts)
    - Needed to exclude react-stripe-js from type checking (_can be removed once react-stripe-js ships with types_)

## Setup:

Copy the `.env.example` file into a file named `.env` in the root directory of this project:

    cp .env.example .env

You will need a Stripe account to run this sample. Once you set up your account, go to the Stripe [developer dashboard](https://stripe.com/docs/development#api-keys) to find your API keys and replace them in the `.env` file.

    STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>
    STRIPE_SECRET_KEY=<replace-with-your-secret-key>

Now install the dependencies and start the development server.

    npm install
    npm run dev

### Forward webhooks to your local dev server

First [install the CLI](https://stripe.com/docs/stripe-cli) and [link your Stripe account](https://stripe.com/docs/stripe-cli#link-account).

Next, start the webhook forwarding:

    stripe listen --forward-to localhost:3000/api/webhooks

The CLI will print a webhook secret key to the console. Set `STRIPE_WEBHOOK_SECRET` to this value in your `.env` file.

When you are ready to create a live webhook endpoint, follow our guide in the docs on [configuring a webhook endpoint in the dashboard](https://stripe.com/docs/webhooks/setup#configure-webhook-settings).
