import { NextApiRequest, NextApiResponse } from "next";

// Initialise Stripe with Typescript.
import Stripe from "stripe";
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY as string; // TODO make better.
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2019-12-03",
  typescript: true
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.confirm(
        req.query.id as string
      );

      res.status(200).json(payment_intent);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
};
