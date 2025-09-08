import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import PaymentForm from "@/components/PaymentForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useMemo, useState } from "react";

function PaymentPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  const orderId = useMemo(() => {
    const id = searchParams.get("orderId") || "";
    if (!id || id === "undefined") {
      return "";
    }
    return id;
  }, [searchParams]);

  if (cart.length === 0) {
    return <Navigate to="/" />;
  }

  if (!orderId) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Link
                to="/shop/checkout"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Checkout
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment</h1>
            <p className="text-lg text-gray-600">Complete your purchase securely with Stripe</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border text-center">
            <p className="text-red-600 font-medium">Missing orderId</p>
            <p className="text-gray-600 mt-2">We couldn't find your order. Please return to checkout and try again.</p>
            <div className="mt-6">
              <Link
                to="/shop/checkout"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Back to Checkout
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link 
              to="/shop/checkout" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Checkout
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment</h1>
          <p className="text-lg text-gray-600">Complete your purchase securely with Stripe</p>
        </div>

        {/* Payment Form */}
        <PaymentForm orderId={orderId} />
      </div>
    </main>
  );
}

export default PaymentPage;