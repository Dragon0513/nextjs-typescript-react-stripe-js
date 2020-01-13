import { NextPage } from "next";
import Link from "next/link";

import Layout from "../../components/Layout";
import List from "../../components/List";

import { SERVER_URL } from "../../config";
import { fetchGetJSON } from "../../utils/api-helpers";

// Import Stripe types of apiVersion: '2019-12-03'.
import Stripe from "stripe";

type Props = {
  items: Stripe.Sku[];
  pathname: string;
};

const WithInitialProps: NextPage<Props> = ({ items, pathname }) => (
  <Layout title="Product List | Next.js + TypeScript Example">
    <h1>Product List</h1>
    <p>
      Example fetching data from inside <code>getInitialProps()</code>.
    </p>
    <p>You are currently on: {pathname}</p>
    <List items={items} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

WithInitialProps.getInitialProps = async ({ pathname }) => {
  // Example for including initial props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: Stripe.Sku[] = await fetchGetJSON(`${SERVER_URL}/api/products`);

  return { items, pathname };
};

export default WithInitialProps;
