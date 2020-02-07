import React, { useState } from 'react';

import CustomDonationInput from '../components/CustomDonationInput';
import PrintObject from '../components/PrintObject';

import { fetchPostJSON } from '../utils/api-helpers';
import { formatAmountForDisplay } from '../utils/stripe-helpers';
import * as config from '../config';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const ElementsForm: React.FunctionComponent = () => {
  const [input, setInput] = useState({
    customDonation: config.MIN_AMOUNT,
    cardholderName: ''
  });
  const [payment, setPayment] = useState({ status: 'initial' });
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

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setPayment({ status: 'processing' });

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements!.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe!.createPaymentMethod({
      type: 'card',
      card: cardElement!,
      billing_details: { name: input.cardholderName }
    });

    if (error) {
      setPayment({ status: 'error' });
      setErrorMessage(error.message as string); // TODO check if resolved
    } else if (paymentMethod) {
      // Send paymentMethod.id to your server.
      const response = await fetchPostJSON('/api/payment_intents', {
        amount: input.customDonation,
        paymentMethodId: paymentMethod.id
      });
      setPayment(response);
      if (response.status === 'requires_action') {
        const result = await stripe!.handleCardAction(response.client_secret!);
        if (result.error) {
          setPayment({ status: 'error' });
          setErrorMessage(result.error.message as string); // TODO check if resolved
        } else if (result.paymentIntent) {
          setPayment(result.paymentIntent);
          if (result.paymentIntent.status === 'requires_confirmation') {
            // Confirm the PaymentIntent to finalise the payment.
            const response = await fetchPostJSON(
              `/api/payment_intents/${result.paymentIntent.id}/confirm`
            );
            setPayment(response);
          }
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
            !['initial', 'succeeded', 'error'].includes(payment.status) ||
            !stripe
          }
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </button>
      </form>
      <PaymentStatus status={payment.status} />
      <PrintObject content={payment} />
    </>
  );
};

export default ElementsForm;
