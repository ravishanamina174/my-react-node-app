import { useGetProductsBySearchQuery, useGetFilteredProductsQuery } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "./ui/input";
import { Link } from "react-router";

function ProductSearchForm() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (search.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedSearch(search);
      }, 300); // 300ms delay
    } else {
      setDebouncedSearch("");
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search]);

  const { data: searchResponse, isLoading: isSearchLoading, isError: isSearchError } = useGetProductsBySearchQuery(debouncedSearch, {
    skip: !debouncedSearch || debouncedSearch.trim().length < 2, // Only search when there are at least 2 characters
  });

  // Fallback: Try filtered products if search fails
  const { data: filteredResponse, isLoading: isFilteredLoading } = useGetFilteredProductsQuery(
    { search: debouncedSearch.trim().length >= 2 ? debouncedSearch : '' },
    { skip: !debouncedSearch || debouncedSearch.trim().length < 2 || !isSearchError }
  );

  // Extract products from the responses
  const searchProducts = searchResponse?.data || [];
  const filteredProducts = filteredResponse?.data || [];
  
  // Use search results if available, otherwise use filtered results
  const apiProducts = searchProducts.length > 0 ? searchProducts : filteredProducts;
  const isLoading = isSearchLoading || isFilteredLoading;
  const isError = isSearchError && filteredProducts.length === 0;

  // Fallback: Search through local data if all API methods fail
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2 && isError) {
      console.log('Using local data fallback for:', debouncedSearch);
      // Import local data for fallback search
      import('@/data').then(({ products: localProducts }) => {
        const filtered = localProducts.filter(product =>
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        console.log('Local search results:', filtered);
        setLocalSearchResults(filtered);
      }).catch((error) => {
        console.error('Failed to import local data:', error);
        setLocalSearchResults([]);
      });
    } else {
      setLocalSearchResults([]);
    }
  }, [debouncedSearch, isError]);

  // Use API results if available, otherwise use local results
  const products = apiProducts.length > 0 ? apiProducts : localSearchResults;
  const isSearching = isLoading && debouncedSearch.trim().length >= 2;

  // Debug logging
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      console.log('Search state:', {
        search,
        debouncedSearch,
        searchProducts: searchProducts.length,
        filteredProducts: filteredProducts.length,
        localResults: localSearchResults.length,
        isLoading,
        isError,
        finalProducts: products.length
      });
    }
  }, [search, debouncedSearch, searchProducts, filteredProducts, localSearchResults, isLoading, isError, products]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Open dropdown when typing
  useEffect(() => {
    setIsDropdownOpen(search.trim().length >= 2);
  }, [search]);

  // Don't render search results if there's an error and no local results
  if (isError && localSearchResults.length === 0) {
    return (
      <div className="relative" ref={searchRef}>
        <Input
          type="text"
          placeholder="Search (temporarily unavailable)"
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled
        />
      </div>
    );
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleResultClick = () => {
    setSearch("");
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <Input
        type="text"
        placeholder="Search products..."
        className="w-64"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={() => search.trim().length >= 2 && setIsDropdownOpen(true)}
        aria-label="Search products"
        aria-expanded={isDropdownOpen}
        aria-haspopup="listbox"
        role="combobox"
      />
      
      {/* Search Results Dropdown */}
      {isDropdownOpen && search.trim().length >= 2 && (
        <div
          className={cn(
            "absolute top-12 left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto"
          )}
          role="listbox"
          aria-label="Search results"
        >
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                <span>Searching...</span>
              </div>
            </div>
          ) : products && products.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-500 border-b">
                Found {products.length} product{products.length !== 1 ? 's' : ''}
              </div>
              {products.map((product) => (
                <Link
                  to={`/shop/products/${product._id}`}
                  key={product._id}
                  className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                  onClick={handleResultClick}
                >
                  <div className="flex items-center space-x-3">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{product.name}</div>
                      <div className="text-sm text-gray-500">${product.price}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <div className="text-sm">
                <p>No products found for "{search}"</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSearchForm;