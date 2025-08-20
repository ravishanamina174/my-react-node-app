import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cartSlice";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_fallback_stripe_key';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function CheckoutForm({ orderId, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/payments/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            orderId,
            amount: Math.round(totalAmount * 100) // Convert to cents
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        setError("Failed to initialize payment. Please try again.");
      }
    };

    if (orderId && totalAmount) {
      createPaymentIntent();
    }
  }, [orderId, totalAmount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      // Payment successful - clear cart and redirect to complete page
      dispatch(clearCart());
      
      // Store payment success info
      localStorage.setItem('paymentSuccess', JSON.stringify({
        paymentIntentId: paymentIntent.id,
        amount: totalAmount,
        timestamp: new Date().toISOString()
      }));
      
      navigate(`/shop/complete?orderId=${orderId}&paymentIntentId=${paymentIntent.id}`);
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Initializing payment...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Processing Payment..." : `Pay $${totalAmount.toFixed(2)}`}
      </Button>
      
      <div className="text-center text-sm text-gray-500">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>💳 Test with card: 4242 4242 4242 4242</p>
      </div>
    </form>
  );
}

const PaymentForm = ({ orderId }) => {
  const cart = useSelector((state) => state.cart.cartItems);
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (!orderId) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">No order ID provided. Please return to checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-lg text-green-600">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm orderId={orderId} totalAmount={totalAmount} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentForm;