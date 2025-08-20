import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./lib/store";
import { Provider } from "react-redux";

import "./index.css";

import HomePage from "./pages/home.page.jsx";
import SignInPage from "./pages/sign-in.page.jsx";
import SignUpPage from "./pages/sign-up.page.jsx";
import ShopPage from "./pages/shop.page.jsx";
import RootLayout from "./layouts/root.layout.jsx";
import CartPage from "./pages/cart.page";
import CheckoutPage from "./pages/checkout.page";
import ProtectedLayout from "./layouts/protected.layout";
import CreateProductPage from "./pages/create-product-page";
import AdminProtectedLayout from "./layouts/admin-protected.layout";
import PaymentPage from "./pages/payment.page";
import CompletePage from "./pages/complete.page";
import ProductPage from "./pages/ProductPage.jsx";
import MyOrdersPage from "./pages/myorders.page.jsx";
import AllOrdersPage from "./pages/allorders.page.jsx";

import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_fallback_key';

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_fallback_key') {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY - using fallback key');
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop">
                <Route index element={<ShopPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="products/:productId" element={<ProductPage />} />
                <Route path=":category" element={<ShopPage />} />
                <Route element={<ProtectedLayout />}>
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="payment" element={<PaymentPage />} />
                  <Route path="complete" element={<CompletePage />} />
                </Route>
              </Route>
              <Route element={<ProtectedLayout />}>
                <Route path="/myorders" element={<MyOrdersPage />} />
                <Route element={<AdminProtectedLayout />}>
                  <Route
                    path="/admin/products/create"
                    element={<CreateProductPage />}
                  />
                  <Route path="/allorders" element={<AllOrdersPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);