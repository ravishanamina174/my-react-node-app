import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCreateOrderMutation } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { z } from "zod";

const shippingAddressFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required").max(15),
  line_1: z.string().min(1, "Address is required").max(100),
  line_2: z.string().max(100).optional(),
  city: z.string().min(1, "City is required").max(50),
  state: z.string().min(1, "State/Province is required").max(50),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().min(1, "Country is required").max(50),
});

function ShippingAddressForm() {
  const form = useForm({
    resolver: zodResolver(shippingAddressFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      line_1: "",
      line_2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cartItems);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  async function onSubmit(values) {
    try {
      console.log("Submitting order with values:", values);
      console.log("Cart items:", cart);
      
      const orderData = {
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          line_1: values.line_1,
          line_2: values.line_2,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
        },
        orderItems: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
        })),
        totalAmount: totalPrice,
      };
      
      console.log("Order data being sent:", orderData);
      
      const createdOrder = await createOrder(orderData).unwrap();
      console.log("Order created successfully:", createdOrder);
      
      const orderId = createdOrder?._id || createdOrder?.order?._id || createdOrder?.data?._id || createdOrder?.id;
      if (!orderId) {
        console.error("Order id missing in response:", createdOrder);
        alert("Order created but id is missing. Please try again.");
        return;
      }
      
      // Store order details in localStorage for the complete page
      localStorage.setItem('currentOrder', JSON.stringify({
        orderId: orderId,
        shippingAddress: values,
        orderItems: cart,
        totalAmount: totalPrice,
      }));
      
      console.log("Redirecting to payment page with orderId:", orderId);
      navigate(`/shop/payment?orderId=${orderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      
      // Show user-friendly error message
      let errorMessage = "Failed to create order. Please try again.";
      
      if (error.data && error.data.message) {
        errorMessage = error.data.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      // You can add a toast notification here or show error in UI
      alert(`Error: ${errorMessage}`);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="line_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1 *</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="line_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Apt 4B, Suite 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province *</FormLabel>
                  <FormControl>
                    <Input placeholder="NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="10001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input placeholder="United States" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Order Total:</span>
              <span className="text-2xl font-bold text-green-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            
            {/* Show loading state */}
            {isLoading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800">Creating order...</span>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ShippingAddressForm;