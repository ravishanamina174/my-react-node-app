import { Button } from "@/components/ui/button";
import { useGetCheckoutSessionStatusQuery } from "@/lib/api";
import { Link, useSearchParams, Navigate, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cartSlice";

function CompletePage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data, isLoading, isError } = useGetCheckoutSessionStatusQuery(sessionId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (data?.status === "complete" && !clearedRef.current) {
      clearedRef.current = true;
      dispatch(clearCart());
      const timer = setTimeout(() => navigate("/myorders"), 2000);
      return () => clearTimeout(timer);
    }
  }, [data, dispatch, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error</div>;

  if (data.status === "open") return <Navigate to="/shop/checkout" />;

  if (data.status === "complete") {
    return (
      <section className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Order Completed Successfully!</h2>
        <p className="mb-4">
          We appreciate your business! A confirmation email will be sent to{" "}
          <span className="font-semibold">{data.customer_email}</span>.
        </p>
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Order Details:</h3>
          <p className="mb-2">Order ID: <span className="font-medium">{data.orderId}</span></p>
          <p className="mb-2">Order Status: <span className="font-medium">{data.orderStatus}</span></p>
          <p className="mb-2">Payment Status: <span className="font-medium">{data.paymentStatus}</span></p>
        </div>
        <Button asChild className="mt-6">
          <Link to="/myorders">Go to My Orders</Link>
        </Button>
        <p className="text-sm text-gray-500 mt-2">Redirecting to My Orders...</p>
      </section>
    );
  }
  return null;
}
export default CompletePage;