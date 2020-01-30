import * as React from "react";
import { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import PrintObject from "../components/PrintObject";

import { SERVER_URL } from "../config";
import { fetchGetJSON } from "../utils/api-helpers";

// Import Stripe types of apiVersion: '2019-12-03'.
import Stripe from "stripe";

type Props = {
  checkoutSession: Stripe.Checkout.Session;
  paymentIntent: Stripe.PaymentIntent;
};

const ResultPage: NextPage<Props> = ({ checkoutSession, paymentIntent }) => (
  <Layout title="Checkout Payment Result | Next.js + TypeScript Example">
    <h1>Checkout Payment Result</h1>
    <h2>Status: {paymentIntent.status}</h2>
    <p>
      Your Checkout Session ID: <code>{checkoutSession.id}</code>
    </p>
    <PrintObject content={checkoutSession} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

ResultPage.getInitialProps = async ({ query }) => {
  // Example for including initial props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const checkoutSession: Stripe.Checkout.Session = await fetchGetJSON(
    `${SERVER_URL}/api/checkout_sessions/${query.session_id}`
  );
  const paymentIntent: Stripe.PaymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  return { checkoutSession, paymentIntent };
};

export default ResultPage;
