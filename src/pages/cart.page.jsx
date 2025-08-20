import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { ClipboardList, Users } from "lucide-react";
import CartItem from "@/components/CartItem";

function CartPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const { isSignedIn, user } = useUser();
  console.log(cart);

  return (
    <main className="px-16 min-h-screen py-8">
      <h2 className="text-4xl font-bold">My Cart</h2>
      <div className="mt-4 grid grid-cols-2 w-1/2 gap-x-4">
        {cart.map((item, index) => (
          <CartItem key={index} item={item} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {cart.length > 0 ? (
          <Button asChild>
            <Link to="/shop/checkout">Proceed to Checkout</Link>
          </Button>
        ) : (
          <p>No items in cart</p>
        )}
        {isSignedIn && (
          <>
            <Button variant="outline" asChild>
              <Link to="/myorders" aria-label="My Orders">
                <ClipboardList className="w-4 h-4 mr-2" /> My Orders
              </Link>
            </Button>
            {user?.publicMetadata?.role === "admin" && (
              <Button variant="outline" asChild>
                <Link to="/allorders" aria-label="All Orders">
                  <Users className="w-4 h-4 mr-2" /> Admin Orders
                </Link>
              </Button>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default CartPage;
