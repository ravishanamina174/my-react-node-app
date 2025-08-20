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
    <div key={props.product._id}>
      <div className="h-64 sm:h-72 md:h-80 lg:h-96">
        <Link to={`/shop/products/${props.product._id}`}>
          <img
            src={props.product.image}
            alt={props.product.name}
            className="rounded-2xl w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
      </div>
      <div className="mt-2">
        <span className="text-lg sm:text-xl md:text-2xl block">
          {props.product.name}
        </span>
        <span className="text-base sm:text-lg md:text-xl block">
          ${props.product.price}
        </span>
      </div>
      <div>
        <Button
          className={"w-full mt-2"}
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
}

export default SimpleProductCard;