import React, { useState, ChangeEvent, FormEvent } from 'react';

import CustomDonationInput from '../components/CustomDonationInput';
import PrintObject from '../components/PrintObject';

import { fetchPostJSON } from '../utils/api-helpers';
import { formatAmountForDisplay } from '../utils/stripe-helpers';
import * as config from '../config';

// Import Stripe types of apiVersion: '2019-12-03'.
import Stripe from 'stripe';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const ElementsForm: React.FunctionComponent = () => {
  const [input, setInput] = useState({
    customDonation: config.MIN_AMOUNT,
    cardholderName: ''
  });
  const [paymentIntent, setPaymentIntent] = useState({ status: 'initial' });
  const [errorMessage, setErrorMessage] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'processing':
      case 'requires_confirmation':
        return <h2>Processing...</h2>;

      case 'requires_action':
        return <h2>Authenticating...</h2>;

      case 'succeeded':
        return <h2>Payment Succeeded 🥳</h2>;

      case 'error':
        return (
          <>
            <h2>Error 😭</h2>
            <p>{errorMessage}</p>
          </>
        );

      default:
        return null;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPaymentIntent({ status: 'processing' });
    // Create a PaymentIntent.
    let paymentIntent: Stripe.PaymentIntent;

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { name: input.cardholderName }
    });

    if (error) {
      setPaymentIntent({ status: 'error' });
      setErrorMessage(error.message);
    } else {
      // Send paymentMethod.id to your server.
      paymentIntent = await fetchPostJSON('/api/payment_intents', {
        amount: input.customDonation,
        paymentMethodId: paymentMethod.id
      });
      setPaymentIntent(paymentIntent);
      if (paymentIntent.status === 'requires_action') {
        const result = await stripe.handleCardAction(
          paymentIntent.client_secret
        );
        if (result.error) {
          setPaymentIntent({ status: 'error' });
          setErrorMessage(result.error.message);
        } else {
          paymentIntent = result.paymentIntent;
          setPaymentIntent(paymentIntent);
        }
        if (paymentIntent.status === 'requires_confirmation') {
          // Confirm the PaymentIntent to finalise the payment.
          paymentIntent = await fetchPostJSON(
            `/api/payment_intents/${paymentIntent.id}/confirm`
          );
          setPaymentIntent(paymentIntent);
        }
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomDonationInput
          name="customDonation"
          value={input.customDonation}
          min={config.MIN_AMOUNT}
          max={config.MAX_AMOUNT}
          step={config.AMOUNT_STEP}
          currency={config.CURRENCY}
          onChange={handleInputChange}
        />
        <fieldset>
          <legend>Your payment details:</legend>
          <label>
            Cardholder name:
            <input
              type="Text"
              name="cardholderName"
              onChange={handleInputChange}
              required={true}
            />
          </label>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#9e2146'
                }
              }
            }}
          />
        </fieldset>
        <button
          type="submit"
          disabled={
            !['initial', 'succeeded', 'error'].includes(paymentIntent.status)
          }
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </button>
      </form>
      <PaymentStatus status={paymentIntent.status} />
      <PrintObject content={paymentIntent} />
    </>
  );
};

export default ElementsForm;
