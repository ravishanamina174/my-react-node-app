import { useMemo } from "react";
import { useGetMyOrdersQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MapPin, Calendar } from "lucide-react";

// Utility function to get proper image URL
function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /, it's relative to the domain
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // If it's a relative path without /, it's relative to the public folder
  return `/${imagePath}`;
}

function groupOrdersByDate(orders) {
  const map = new Map();
  for (const order of orders || []) {
    const date = new Date(order.createdAt);
    const key = date.toLocaleDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(order);
  }
  // sort each group by newest first
  for (const [, list] of map) {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  // return array sorted by date desc
  return Array.from(map.entries()).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );
}

export default function MyOrdersPage() {
  const { data, isLoading, isError } = useGetMyOrdersQuery();
  
  // Handle different response structures
  const orders = data?.orders || data?.data || data || [];
  
  // Debug logging to see the actual data structure
  console.log('MyOrders API Response:', data);
  console.log('Processed Orders:', orders);
  
  const grouped = useMemo(() => groupOrdersByDate(orders), [orders]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </main>
    );
  }
  
  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Failed to load orders</h2>
              <p className="text-red-600">Please try refreshing the page or contact support if the problem persists.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <a 
                href="/shop" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">My Orders</h1>

        <div className="flex flex-col gap-6">
          {grouped.map(([date, orders]) => (
            <Card key={date} className="w-full">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {date}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-6 bg-white"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b">
                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg">Order #{order._id.slice(-8)}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-600">
                            ${(order.totalAmount || order.totalPrice || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="space-y-4 mb-4">
                        <h4 className="font-semibold text-gray-700">Order Items:</h4>
                        {(order.orderItems || order.items || []).map((item, index) => {
                          // Debug logging for individual items
                          console.log(`Order Item ${index}:`, item);
                          console.log(`Item product:`, item.product);
                          console.log(`Item productId:`, item.productId);
                          
                          return (
                            <div key={item._id || index} className="flex items-center gap-4 p-3 border rounded-lg">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.product?.images && item.product.images[0] ? (
                                  (() => {
                                    const imageUrl = getImageUrl(item.product.images[0]);
                                    console.log('Using product.images[0]:', item.product.images[0], '->', imageUrl);
                                    return (
                                      <img 
                                        src={imageUrl} 
                                        alt={item.product.name || "Product"}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                          console.log('Image failed to load:', e.target.src);
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                                      />
                                    );
                                  })()
                                ) : item.product?.image ? (
                                  (() => {
                                    const imageUrl = getImageUrl(item.product.image);
                                    console.log('Using product.image:', item.product.image, '->', imageUrl);
                                    return (
                                      <img 
                                        src={imageUrl} 
                                        alt={item.product.name || "Product"}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                          console.log('Image failed to load:', e.target.src);
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                                      />
                                    );
                                  })()
                                ) : item.productId?.images && item.productId.images[0] ? (
                                  (() => {
                                    const imageUrl = getImageUrl(item.productId.images[0]);
                                    console.log('Using productId.images[0]:', item.productId.images[0], '->', imageUrl);
                                    return (
                                      <img 
                                        src={imageUrl} 
                                        alt={item.productId.name || "Product"}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                          console.log('Image failed to load:', e.target.src);
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                                      />
                                    );
                                  })()
                                ) : item.productId?.image ? (
                                  (() => {
                                    const imageUrl = getImageUrl(item.productId.image);
                                    console.log('Using productId.image:', item.productId.image, '->', imageUrl);
                                    return (
                                      <img 
                                        src={imageUrl} 
                                        alt={item.productId.name || "Product"}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                          console.log('Image failed to load:', e.target.src);
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                                      />
                                    );
                                  })()
                                ) : (
                                  <Package className="w-8 h-8 text-gray-400" />
                                )}
                                {/* Fallback icon that shows when image fails to load */}
                                <Package className="w-8 h-8 text-gray-400" style={{ display: 'none' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900">
                                  {item.product?.name || item.productId?.name || item.name || "Product"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Price: ${(item.price || item.product?.price || item.productId?.price || 0).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Quantity: {item.quantity}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  ${((item.price || item.product?.price || item.productId?.price || 0) * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address:
                          </h4>
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <div>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                            <div>{order.shippingAddress.line_1}</div>
                            {order.shippingAddress.line_2 && <div>{order.shippingAddress.line_2}</div>}
                            <div>
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </div>
                            <div>{order.shippingAddress.country}</div>
                            <div className="mt-1 text-gray-500">
                              Email: {order.shippingAddress.email} | Phone: {order.shippingAddress.phone}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Status */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Status:</span> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Payment:</span> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.paymentStatus || 'pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}


