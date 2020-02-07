import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeSecretKey, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2019-12-03',
  typescript: true,
  telemetry: true
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const id: string = req.query.id as string;
    try {
      if (!id.startsWith('pi_')) {
        throw Error('Incorrect PaymentIntent ID.');
      }
      const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.confirm(
        id
      );

      res.status(200).json(payment_intent);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
