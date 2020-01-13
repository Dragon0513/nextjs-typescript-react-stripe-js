import { NextApiRequest, NextApiResponse } from "next";

// Initialise Stripe with Typescript.
import Stripe from "stripe";
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY as string; // TODO make better.
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2019-12-03",
  typescript: true
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const checkout_session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(
      req.query.id as string,
      { expand: ["payment_intent"] }
    );

    res.status(200).json(checkout_session);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
