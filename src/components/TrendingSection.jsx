import SimpleProductCard from "./SimpleProductCard";
import CategoryButton from "./CategoryButton";
import { useState, useEffect } from "react";
import { useGetAllCategoriesQuery, useGetAllProductsQuery } from "@/lib/api";

function TrendingSection() {
  const { data: productsResponse, isLoading: isProductsLoading, error: productsError, refetch: refetchProducts } = useGetAllProductsQuery();
  const { data: categoriesResponse, isLoading: isCategoriesLoading, error: categoriesError, refetch: refetchCategories } = useGetAllCategoriesQuery();

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  
  // Extract data from API response
  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  
  // Debug logging (only in console, not in UI)
  useEffect(() => {
    console.log('TrendingSection Debug:', {
      productsResponse,
      categoriesResponse,
      products,
      categories,
      productsError,
      categoriesError,
      isProductsLoading,
      isCategoriesLoading
    });
  }, [productsResponse, categoriesResponse, products, categories, productsError, categoriesError, isProductsLoading, isCategoriesLoading]);
  
  const filteredProducts =
    selectedCategoryId === "all"
      ? products
      : products?.filter((product) => product.categoryId === selectedCategoryId);

  // Show loading state while fetching data
  if (isProductsLoading || isCategoriesLoading) {
    return (
      <section className="px-4 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl">Trending</h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-x-4 max-w-full overflow-x-auto pb-2">
            {/* Loading skeleton for categories */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Loading skeleton for products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4 md:gap-x-4 md:gap-y-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  // Show error state if API calls failed
  if (productsError || categoriesError) {
    return (
      <section className="px-4 lg:px-16 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl">Trending</h2>
        </div>
        <div className="mt-8 text-center">
          <p className="text-red-600 mb-4">
            {productsError ? `Products Error: ${productsError.message}` : ''}
            {categoriesError ? `Categories Error: ${categoriesError.message}` : ''}
          </p>
          <p className="text-gray-600 mb-4">Failed to load trending products. Please try again later.</p>
          <div className="space-x-4">
            <button
              onClick={() => refetchProducts()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Products
            </button>
            <button
              onClick={() => refetchCategories()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Categories
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 lg:px-16 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl">Trending</h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-x-4 max-w-full overflow-x-auto pb-2">
          {/* Category buttons - handle "All" category specially */}
          {categories?.map((category) => {
            // For "All" category, use "all" as the value, for others use their _id
            const categoryValue = category.name === "All" ? "all" : category._id;
            
            return (
              <button
                key={category.slug || category._id}
                onClick={() => setSelectedCategoryId(categoryValue)}
                className={`border rounded-full px-4 py-2 transition-colors ${
                  selectedCategoryId === categoryValue
                    ? "bg-black text-white"
                    : "bg-white border-black text-black"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-3 md:gap-4 lg:gap-5">
        {filteredProducts?.length > 0 ? (
          filteredProducts.map((product) => {
            return <SimpleProductCard key={product._id} product={product} />;
          })
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-600">No products found</p>
            {products.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No products loaded from API</p>
            )}
            {products.length > 0 && filteredProducts.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No products match the selected category</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default TrendingSection;











