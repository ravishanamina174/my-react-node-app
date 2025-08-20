import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import PaymentForm from "@/components/PaymentForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

function PaymentPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (cart.length === 0) {
    return <Navigate to="/" />;
  }

  if (!orderId) {
    return <Navigate to="/shop/checkout" />;
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