import React, { useState, useEffect } from "react";

import { Elements } from "@stripe/react-stripe-js";

declare global {
  interface Window {
    Stripe: any;
  }
}

type Props = {
  children: React.ReactNode;
};

// This component initialises and instance of Stripe.js and passes a reference down to the children.
const StripeProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [stripe, setStripe] = useState(null);
  useEffect(() => {
    setStripe(window.Stripe(process.env.STRIPE_PUBLISHABLE_KEY));
  }, []);

  return <Elements stripe={stripe}>{children}</Elements>;
};

export default StripeProvider;
