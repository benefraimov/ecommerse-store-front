import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { login, logout } from '../auth/authSlice';
import { createOrder } from '../order/orderSlice';

// === פונקציות עזר פנימיות ===
const saveGuestCartToStorage = (cartItems) => {
  localStorage.setItem('guestCart', JSON.stringify(cartItems));
};

const getAuthConfig = (thunkAPI) => {
  const { auth: { user } } = thunkAPI.getState();
  return { headers: { Authorization: `Bearer ${user.token}` } };
};

// === THUNKS (הפעולות הא-סינכרוניות) ===

// פעולה שמופעלת מהוספה לעגלה (מעמוד המוצר)
export const addToCart = createAsyncThunk('cart/add', async ({ product, qty }, thunkAPI) => {
  const { auth: { user }, cart: { cartItems } } = thunkAPI.getState();
  const existItem = cartItems.find(x => String(x.product) === String(product._id));
  let newCartItems;

  if (existItem) {
    newCartItems = cartItems.map(x => String(x.product) === String(product._id) ? { ...x, qty: x.qty + qty } : x);
  } else {
    const newItem = {
      name: product.name,
      qty,
      image: product.image,
      price: product.price,
      stock: product.stock,
      product: product._id
    };
    newCartItems = [...cartItems, newItem];
  }

  if (user) {
    const { data } = await axios.post('/api/users/cart', { cartItems: newCartItems }, getAuthConfig(thunkAPI));
    return data;
  } else {
    saveGuestCartToStorage(newCartItems);
    return newCartItems;
  }
});

// פעולה שמופעלת מכפתורי הפלוס/מינוס בעגלה
export const setCartItemQty = createAsyncThunk('cart/setQty', async ({ productId, qty }, thunkAPI) => {
  const { auth: { user }, cart: { cartItems } } = thunkAPI.getState();

  let newCartItems = cartItems.map(x => String(x.product) === String(productId) ? { ...x, qty } : x);
  newCartItems = newCartItems.filter(item => item.qty > 0);

  if (user) {
    const { data } = await axios.post('/api/users/cart', { cartItems: newCartItems }, getAuthConfig(thunkAPI));
    return data;
  } else {
    saveGuestCartToStorage(newCartItems);
    return newCartItems;
  }
});

// פעולה להסרת פריט
export const removeItemFromCart = createAsyncThunk('cart/remove', async (productId, thunkAPI) => {
  const { auth: { user }, cart: { cartItems } } = thunkAPI.getState();
  const newCartItems = cartItems.filter(x => String(x.product) !== String(productId));

  if (user) {
    const { data } = await axios.post('/api/users/cart', { cartItems: newCartItems }, getAuthConfig(thunkAPI));
    return data;
  } else {
    saveGuestCartToStorage(newCartItems);
    return newCartItems;
  }
});

// פעולה לטעינת עגלה ראשונית של משתמש מחובר
export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  const { data } = await axios.get('/api/users/cart', getAuthConfig(thunkAPI));
  return data;
});

// === SLICE DEFINITION ===
const initialState = {
  cartItems: localStorage.getItem('guestCart') ? JSON.parse(localStorage.getItem('guestCart')) : [],
  shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
  paymentMethod: 'Credit Card', // נוסיף ערך ברירת מחדל
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },  // נוסיף reducer חדש
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    // Reducer זה שימושי אם נרצה לרוקן את העגלה ידנית
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.removeItem('guestCart');
    }
  },
  extraReducers: (builder) => {
    builder
      // טיפול בהתחברות ובהתנתקות
      .addCase(login.fulfilled, (state, action) => {
        state.cartItems = action.payload.cart || [];
        localStorage.removeItem('guestCart');
      })
      .addCase(logout.fulfilled, (state) => {
        state.cartItems = [];
        state.shippingAddress = {};
        localStorage.removeItem('guestCart');
        localStorage.removeItem('shippingAddress');
      })
      // טיפול כללי בפעולות העגלה
      .addCase(fetchCart.fulfilled, (state, action) => { state.cartItems = action.payload; })
      .addCase(addToCart.fulfilled, (state, action) => { state.cartItems = action.payload; })
      .addCase(setCartItemQty.fulfilled, (state, action) => { state.cartItems = action.payload; })
      .addCase(removeItemFromCart.fulfilled, (state, action) => { state.cartItems = action.payload; })
      .addCase(createOrder.fulfilled, (state) => {
        state.cartItems = []; // מאפסים את מערך הפריטים
        localStorage.removeItem('guestCart'); // מנקים גם את האחסון המקומי
      });
  },
});

export const { saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;