import React from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

type Props = {
  children: React.ReactNode;
};

// This component initialises and instance of Stripe.js and passes a reference down to the children.
const StripeProvider: React.FunctionComponent<Props> = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export default StripeProvider;
