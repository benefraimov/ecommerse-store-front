import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk לדפדוף ציבורי
export const fetchProducts = createAsyncThunk('products/fetchAll', async (pageNumber = '', thunkAPI) => {
  try {
    const { data } = await axios.get(`/api/products?pageNumber=${pageNumber}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch products');
  }
});

// Thunk למוצר בודד ציבורי
export const fetchProductById = createAsyncThunk('products/fetchById', async (productId, thunkAPI) => {
  try {
    const { data } = await axios.get(`/api/products/${productId}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch product');
  }
});

export const fetchTopProducts = createAsyncThunk('products/fetchTop', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/api/products/top');
    return data;
  } catch (error) { return thunkAPI.rejectWithValue('Failed to fetch top products'); }
});

const initialState = {
  products: [],
  topProducts: [],
  selectedProduct: null,
  page: 1,
  pages: 1,
  isLoading: false,
  isError: false,
  message: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetSelectedProduct: (state) => {
      state.selectedProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topProducts = action.payload;
      })
  },
});

export const { resetSelectedProduct } = productSlice.actions;
export default productSlice.reducer;