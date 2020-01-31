import { NextApiRequest, NextApiResponse } from "next";

import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from "../../../config";
import { formatAmountForStripe } from "../../../utils/stripe-helpers";

// Initialise Stripe with Typescript.
import Stripe from "stripe";
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2019-12-03",
  typescript: true
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const amount: number = req.body.amount;
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
        throw new Error("Invalid amount.");
      }
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "donate",
        payment_method_types: ["card"],
        line_items: [
          {
            name: "Custom amount donation",
            amount: formatAmountForStripe(amount, CURRENCY),
            currency: CURRENCY,
            quantity: 1
          }
        ],
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`
      };
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
        params
      );

      res.status(200).json(checkoutSession);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
};
