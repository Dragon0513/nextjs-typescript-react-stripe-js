import * as React from "react";

// Import Stripe types of apiVersion: '2019-12-03'.
import Stripe from "stripe";

type Props = {
  items: Stripe.Sku[];
};

const List: React.FunctionComponent<Props> = ({ items }) => (
  <ul>
    {items.map((item: Stripe.Sku) => (
      <li key={item.id}>{item.product}</li>
    ))}
  </ul>
);

export default List;
