import { NextApiRequest, NextApiResponse } from "next";

// Initialise Stripe with Typescript.
import Stripe from "stripe";
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2019-12-03",
  typescript: true
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const id: string = req.query.id as string;
    try {
      if (!id.startsWith("pi_")) {
        throw Error("Incorrect PaymentIntent ID.");
      }
      const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.confirm(
        id
      );

      res.status(200).json(payment_intent);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
};
