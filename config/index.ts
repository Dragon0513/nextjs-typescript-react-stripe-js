export const CURRENCY: "usd" = "usd";
// Set your amount limits: Use float for decimal currencies and
// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
export const MIN_AMOUNT: 10.0 = 10.0;
export const MAX_AMOUNT: 5000.0 = 5000.0;
export const AMOUNT_STEP: 5.0 = 5.0;

const dev: boolean = process.env.NODE_ENV !== "production";
export const SERVER_URL: string = dev
  ? "http://localhost:3000"
  : "https://your_deployment.server.com";
