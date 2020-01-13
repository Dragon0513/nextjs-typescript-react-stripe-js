import { NextApiRequest, NextApiResponse } from "next";

// Initialise Stripe with Typescript.
import Stripe from "stripe";
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY as string; // TODO make better.
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2019-12-03",
  typescript: true
});

export default async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const productList: Stripe.ApiList<Stripe.Sku> = await stripe.skus.list();
    const products: Stripe.Sku[] = productList.data;

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};
