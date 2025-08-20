import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/features/cartSlice';
import { Button } from '@/components/ui/button';
import { useGetAllProductsQuery } from '@/lib/api';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { data: productsResponse, isLoading, isError, error } = useGetAllProductsQuery();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    console.log('ProductPage Debug:', {
      productId,
      productsResponse,
      products: productsResponse?.data,
      foundProduct: productsResponse?.data?.find(p => p._id === productId)
    });
    
    if (productsResponse?.data) {
      const foundProduct = productsResponse.data.find(p => p._id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        console.log('Product not found in products array');
        // If products are loaded but this specific product is not found
        if (productsResponse.data.length > 0) {
          console.log('Available product IDs:', productsResponse.data.map(p => p._id));
        }
      }
    }
  }, [productsResponse, productId]);

  // Check if products are loaded but this specific product is not found
  const productsLoaded = productsResponse?.data && productsResponse.data.length > 0;
  const productNotFound = productsLoaded && !product && !isLoading;

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      );
      // Navigate to cart page after adding to cart
      navigate('/shop/cart');
    }
  };

  if (isLoading) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading product details...</p>
          <p className="text-sm text-gray-500">Fetching from {import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}/api/products</p>
        </div>
      </main>
    );
  }

  if (isError || productNotFound) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {isError ? 'Error Loading Product' : 'Product Not Found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {isError 
              ? (error?.message || 'Failed to load product from API') 
              : 'The product you are looking for does not exist in our database.'
            }
          </p>
          {isError && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Debug Info:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Product ID: {productId}
              </p>
              <p className="text-sm text-gray-600">
                API URL: {import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}/api/products
              </p>
              <p className="text-sm text-gray-600">
                Error: {error?.status || 'Unknown'} - {error?.data?.message || error?.message || 'Unknown error'}
              </p>
            </div>
          )}
          {productNotFound && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Debug Info:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Product ID: {productId}
              </p>
              <p className="text-sm text-gray-600">
                Total Products Loaded: {productsResponse?.data?.length || 0}
              </p>
              <p className="text-sm text-gray-600">
                Available IDs: {productsResponse?.data?.slice(0, 5).map(p => p._id).join(', ')}
                {productsResponse?.data?.length > 5 && '...'}
              </p>
            </div>
          )}
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => navigate('/shop')}
                className="hover:text-gray-900 transition-colors"
              >
                Shop
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl lg:text-3xl font-semibold text-blue-600">
                ${product.price}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                className="w-full lg:w-auto px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add To Cart
              </Button>
              
              <p className="text-sm text-gray-600">
                Free shipping on orders over $50
              </p>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Fast delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">30-day return policy</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
