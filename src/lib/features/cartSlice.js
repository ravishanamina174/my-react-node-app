import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => { // Immer
      const newItem = action.payload;
      const foundItem = state.cartItems.find(
        (el) => el.product._id === newItem._id
      );
      if (!foundItem) {
        state.cartItems.push({ product: newItem, quantity: 1 });
        return;
      }
      foundItem.quantity += 1;
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product._id !== productId
      );
    },
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(
        (item) => item.product._id === productId
      );
      if (item) {
        if (quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (item) => item.product._id !== productId
          );
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;