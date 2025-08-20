import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";

function CompletePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentIntentId = searchParams.get("paymentIntentId");
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Get order details from localStorage
    const storedOrder = localStorage.getItem('currentOrder');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    }

    // Get payment details from localStorage
    const storedPayment = localStorage.getItem('paymentSuccess');
    if (storedPayment) {
      setPaymentDetails(JSON.parse(storedPayment));
    }

    // Cleanup function to clear localStorage when component unmounts
    return () => {
      localStorage.removeItem('currentOrder');
      localStorage.removeItem('paymentSuccess');
    };
  }, []);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your order has been placed and payment has been processed.
          </p>
        </div>

        {/* Order Confirmation Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="text-lg font-semibold">{orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Order Date</p>
                <p className="text-lg font-semibold">{formatDate(new Date())}</p>
              </div>
              {paymentIntentId && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment ID</p>
                  <p className="text-lg font-semibold font-mono text-sm">{paymentIntentId}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ${orderDetails.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderDetails.orderItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.product.images && item.product.images[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-gray-600">${item.product.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-3">Shipping Address</h4>
                <div className="space-y-1 text-gray-700">
                  <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                  <p>{orderDetails.shippingAddress.line_1}</p>
                  {orderDetails.shippingAddress.line_2 && (
                    <p>{orderDetails.shippingAddress.line_2}</p>
                  )}
                  <p>
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}
                  </p>
                  <p>{orderDetails.shippingAddress.country}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3">Contact Information</h4>
                <div className="space-y-1 text-gray-700">
                  <p><span className="font-medium">Email:</span> {orderDetails.shippingAddress.email}</p>
                  <p><span className="font-medium">Phone:</span> {orderDetails.shippingAddress.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {paymentDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-lg font-semibold">Credit Card</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Date</p>
                  <p className="text-lg font-semibold">{formatDate(paymentDetails.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount Paid</p>
                  <p className="text-lg font-semibold text-green-600">${paymentDetails.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-green-600">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-700">
              <p>✅ <strong>Order Confirmed:</strong> Your order has been received and confirmed.</p>
              <p>📧 <strong>Confirmation Email:</strong> You'll receive a confirmation email shortly.</p>
              <p>📦 <strong>Order Processing:</strong> We'll begin processing your order within 24 hours.</p>
              <p>🚚 <strong>Shipping Updates:</strong> You'll receive tracking information once your order ships.</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/myorders">View My Orders</Link>
          </Button>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8 text-gray-600">
          <p>Have questions about your order?</p>
          <p className="mt-1">
            Contact us at{" "}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline font-medium">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompletePage;