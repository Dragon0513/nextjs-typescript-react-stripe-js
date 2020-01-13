export const CURRENCY = "usd";
export const MIN_AMOUNT = 10;
export const MAX_AMOUNT = 5000;
export const AMOUNT_STEP = 5;

const dev = process.env.NODE_ENV !== "production";
export const SERVER_URL = dev
  ? "http://localhost:3000"
  : "https://your_deployment.server.com";
