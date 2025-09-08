import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback } from "react";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PaymentForm = ({ orderId }) => {
  const fetchClientSecret = useCallback(() => {
    if (!orderId || orderId === "undefined") {
      return Promise.reject(new Error("Missing orderId"));
    }
    return fetch(`${BASE_URL}/api/payments/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = (await res.text().catch(() => null)) || res.statusText;
        
          throw new Error(text || "Failed to start checkout");
        }
        return res.json();
      })
      .then((data) => data.clientSecret);
  }, [orderId]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default PaymentForm;