/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
   import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

   const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
   
   // Define a service using a base URL and expected endpoints
   export const Api = createApi({
     reducerPath: "Api",
     baseQuery: fetchBaseQuery({
       baseUrl: `${BASE_URL}/api`,
       timeout: 10000, // 10 second timeout
       prepareHeaders: async (headers) => {
         return new Promise((resolve) => {
           async function checkToken() {
             try {
               const clerk = window.Clerk;
               if (clerk && clerk.session) {
                 const token = await clerk.session.getToken();
                 if (token) {
                   headers.set("Authorization", `Bearer ${token}`);
                 }
               }
             } catch (error) {
               console.log('Clerk not available or user not authenticated, proceeding without token');
             }
             resolve(headers);
           }
           checkToken();
         });
       },
     }),
     endpoints: (build) => ({
       getAllProducts: build.query({
         query: () => `/products`,
         // Transform the response to match expected structure
         transformResponse: (response) => {
           // Products API returns array directly, wrap it in data property
           return { data: response };
         },
       }),
       getProductById: build.query({
         query: (productId) => `/products/${productId}`,
         // Transform the response to match expected structure
         transformResponse: (response) => {
           // Single product API returns object directly, wrap it in data property
           return { data: response };
         },
       }),
       getFilteredProducts: build.query({
         query: (params) => {
           const searchParams = new URLSearchParams();
           if (params.categoryId) searchParams.append('categoryId', params.categoryId);
           if (params.category && params.category !== 'all') searchParams.append('category', params.category);
           if (params.color && params.color !== 'all') searchParams.append('color', params.color);
           if (params.sort && params.sort !== 'none') searchParams.append('sort', params.sort);
           if (params.page) searchParams.append('page', params.page);
           if (params.limit) searchParams.append('limit', params.limit);
           if (params.search && params.search.trim()) searchParams.append('search', params.search.trim());
           
           const queryString = searchParams.toString();
           return `/products${queryString ? `?${queryString}` : ''}`;
         },
         // Transform the response to match expected structure
         transformResponse: (response) => {
           // Handle different response structures
           if (Array.isArray(response)) {
             return { data: response };
           } else if (response && response.data) {
             return { data: response.data };
           } else if (response && response.products) {
             return { data: response.products };
           }
           // Fallback to empty array if response structure is unexpected
           return { data: [] };
         },
       }),
       getProductsBySearch: build.query({
         query: (query) => {
           // Ensure query is properly encoded and not empty
           if (!query || query.trim().length === 0) {
             return '/products'; // Return all products if no search query
           }
           const encodedQuery = encodeURIComponent(query.trim());
           // Try multiple search endpoints in case one doesn't exist
           return `/products/search?search=${encodedQuery}`;
         },
         // Transform the response to match expected structure
         transformResponse: (response) => {
           // Handle different response structures
           if (Array.isArray(response)) {
             return { data: response };
           } else if (response && response.data) {
             return { data: response.data };
           } else if (response && response.products) {
             return { data: response.products };
           }
           // Fallback to empty array if response structure is unexpected
           return { data: [] };
         },
         // Add proper error handling
         async onQueryStarted(arg, { queryFulfilled }) {
           try {
             await queryFulfilled;
           } catch (error) {
             console.error('Search query failed:', error);
           }
         },
       }),
       getAllCategories: build.query({
         query: () => `/categories`,
         // Categories API returns {success, data}, keep as is
         transformResponse: (response) => response,
       }),
       createProduct: build.mutation({
         query: (product) => ({
           url: "/products",
           method: "POST",
           body: product,
         }),
       }),
       createOrder: build.mutation({
         query: (order) => ({
           url: "/orders",
           method: "POST",
           body: order,
         }),
       }),
       getMyOrders: build.query({
         query: () => `/orders/myorders`,
         transformResponse: (response) => response,
       }),
       getAllOrders: build.query({
         query: () => `/orders/allorders`,
         transformResponse: (response) => response,
       }),
       getCheckoutSessionStatus: build.query({
         query: (sessionId) => `/payments/session-status?session_id=${sessionId}`,
       }),
     }),
   });
   
   // Export hooks for usage in functional components, which are
   // auto-generated based on the defined endpoints
   export const {
     useGetAllProductsQuery,
     useGetProductByIdQuery,
     useGetFilteredProductsQuery,
     useGetProductsBySearchQuery,
     useCreateOrderMutation,
     useGetCheckoutSessionStatusQuery,
     useCreateProductMutation,
     useGetAllCategoriesQuery,
     useGetMyOrdersQuery,
     useGetAllOrdersQuery,
   } = Api;