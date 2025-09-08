import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useGetAllProductsQuery, useGetAllCategoriesQuery } from '../lib/api';
import SimpleProductCard from '@/components/SimpleProductCard';

const ShopPage = () => {
  const { category: categoryParam } = useParams();
  
  const [filters, setFilters] = useState({
    category: categoryParam || 'all',
    color: 'all',
    sort: 'newest',
    page: 1,
    limit: 20
  });

  // Get categories from API
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  const categories = categoriesResponse?.data || [];

  // Get all products and filter locally like TrendingSection
  const { data: productsResponse, isLoading, isError, error } = useGetAllProductsQuery();
  
  // Extract data from API response
  let allProducts = productsResponse?.data || [];
  
  // Get category ID for filtering
  function getCategoryId() {
    if (filters.category === 'all') return null;
    const category = categories.find(cat => cat.slug === filters.category);
    return category ? category._id : null;
  }

  // Filter products locally like TrendingSection does
  let products = allProducts;
  if (filters.category !== 'all') {
    const categoryId = getCategoryId();
    if (categoryId) {
      products = allProducts.filter(product => product.categoryId === categoryId);
    }
  }

  // Apply color filter if needed
  if (filters.color !== 'all') {
    products = products.filter(product => product.color === filters.color);
  }

  // Apply sorting
  if (filters.sort === 'price-asc') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    products = [...products].sort((a, b) => b.price - a.price);
  } else {
    // newest first (default)
    products = [...products].sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
  }

  // Apply pagination
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / filters.limit);
  const startIndex = (filters.page - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;
  products = products.slice(startIndex, endIndex);

  // Get category name for display
  const getCategoryDisplayName = () => {
    if (filters.category === 'all') return 'All Products';
    const category = categories.find(cat => cat.slug === filters.category);
    return category ? category.name : 'All Products';
  };

  // Update category when URL param changes
  useEffect(() => {
    if (categoryParam && categoryParam !== filters.category) {
      setFilters(prev => ({ ...prev, category: categoryParam, page: 1 }));
    }
  }, [categoryParam]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: categoryParam || 'all',
      color: 'all',
      sort: 'newest',
      page: 1,
      limit: 20
    });
  };

  if (isError) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Shop</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'Failed to load products'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{getCategoryDisplayName()}</h1>
        <p className="text-gray-600 mt-2">
          {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative">
          <select 
            value={filters.category} 
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
            disabled={isCategoriesLoading}
          >
            <option value="all">All Categories</option>
            {categories.filter(cat => cat.slug !== 'all').map(cat => (
              <option key={cat._id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select 
            value={filters.color} 
            onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value, page: 1 }))}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
          >
            <option value="all">Select Color</option>
            {/* Add colors here if you have them */}
          </select>
        </div>

        <div className="relative">
          <select 
            value={filters.sort} 
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        {(filters.category !== (categoryParam || 'all') || filters.color !== 'all' || filters.sort !== 'newest') && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {products.map(product => (
              <SimpleProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center space-x-2">
              <button 
                disabled={filters.page <= 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {filters.page} of {totalPages}
              </span>
              
              <button 
                disabled={filters.page >= totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or browse all products
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Products
          </button>
        </div>
      )}
    </main>
  );
};

export default ShopPage;