import React, { useState, ChangeEvent, FormEvent } from 'react';

import CustomDonationInput from '../components/CustomDonationInput';

import { fetchPostJSON } from '../utils/api-helpers';
import { formatAmountForDisplay } from '../utils/stripe-helpers';
import * as config from '../config';

// Import Stripe types of apiVersion: '2019-12-03'.
import Stripe from 'stripe';
import { useStripe } from '@stripe/react-stripe-js';

const CheckoutForm: React.FunctionComponent = () => {
  const [input, setInput] = useState({ customDonation: config.MIN_AMOUNT });
  const stripe = useStripe();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Create a Checkout Session.
    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      `${config.SERVER_URL}/api/checkout_sessions`,
      { amount: input.customDonation }
    );

    if ((checkoutSession as any).statusCode === 500) {
      console.error((checkoutSession as any).message);
      return;
    }

    // Redirect to Checkout.
    const { error } = await stripe.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: checkoutSession.id
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CustomDonationInput
        name={'customDonation'}
        value={input.customDonation}
        min={config.MIN_AMOUNT}
        max={config.MAX_AMOUNT}
        step={config.AMOUNT_STEP}
        currency={config.CURRENCY}
        onChange={handleInputChange}
      />
      <button type="submit">
        Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
      </button>
    </form>
  );
};

export default CheckoutForm;
