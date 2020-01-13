import * as React from "react";
import Link from "next/link";
import Layout from "../components/Layout";

import ElementsForm from "../components/ElementsForm";

import StripeProvider from "../components/StripeProvider";

const DonatePage: React.FunctionComponent = () => {
  return (
    <Layout title="Donate with Elements | Next.js + TypeScript Example">
      <h1>Donate with Elements</h1>
      <p>Donate to our project 💖</p>
      <StripeProvider>
        <ElementsForm />
      </StripeProvider>
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
    </Layout>
  );
};

export default DonatePage;
