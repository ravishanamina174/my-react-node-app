import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { Link } from "react-router";

function SimpleProductCard(props) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: props.product._id,
        name: props.product.name,
        price: props.product.price,
        image: props.product.image,
      })
    );
    // Don't navigate - just add to cart and stay on the same page
    // User can click the shopping bag icon in navigation to go to cart
  };

  return (
    <div key={props.product._id} className="rounded-2xl overflow-hidden bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <div className="h-52 sm:h-56 md:h-60 lg:h-64">
        <Link to={`/shop/products/${props.product._id}`}>
          <img
            src={props.product.image}
            alt={props.product.name}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
      </div>
      <div className="px-3 pt-2">
        <span className="text-base sm:text-lg md:text-xl block">
          {props.product.name}
        </span>
        <span className="text-sm sm:text-base md:text-lg block text-gray-700">
          ${props.product.price}
        </span>
      </div>
      <div className="px-3 pb-3">
        <Button
          size="sm"
          className={"w-full mt-2 rounded-full"}
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
}

export default SimpleProductCard;