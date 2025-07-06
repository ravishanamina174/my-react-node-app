import { createSlice } from '@reduxjs/toolkit';
// import { log } from 'console';

const initialState = {
  cartItems: [],
  duplicate:0
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state,action) => {
      const newItem = action.payload ;
      const foundItem = state.cartItems.find((el) => el.product._id === newItem._id );
      if (!foundItem) {
        state.cartItems.push({ product:action.payload , quantity:1  }) 
        return ;       
      } 
      foundItem.quantity += 1;
    
    },
    clearCart: () => {
       state = [];
    },
   },
  },
);

// Action creators are generated for each case reducer function
export const { addToCart , clearCart } = cartSlice.actions

export default cartSlice.reducer;


