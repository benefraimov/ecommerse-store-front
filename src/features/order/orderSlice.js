import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// === THUNKS ===

// Thunk ליצירת הזמנה חדשה
export const createOrder = createAsyncThunk('order/create', async (order, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.post('/api/orders', order, config);
        return data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk לשליפת פרטי הזמנה ספציפית
export const getOrderDetails = createAsyncThunk('order/getDetails', async (id, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        return data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk לעדכון הזמנה כשולמה
export const payOrder = createAsyncThunk('order/pay', async ({ orderId, paymentResult }, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);
        return data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk לשליפת ההזמנות של המשתמש המחובר
export const listMyOrders = createAsyncThunk('orders/listMy', async (_, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders/myorders', config);
        return data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const markAsReceived = createAsyncThunk('order/receive', async (orderId, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.put(`/api/orders/${orderId}/receive`, {}, config);
        return data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// === SLICE DEFINITION ===

const initialState = {
    order: null,      // להזמנה ספציפית
    myOrders: [],     // לרשימת ההזמנות של המשתמש
    isLoading: false,
    isError: false,
    isSuccess: false, // דגל הצלחה כללי לפעולות
    message: '',
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => { state.isLoading = true; })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Order Details
            .addCase(getOrderDetails.pending, (state) => { state.isLoading = true; })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = action.payload;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Pay Order
            .addCase(payOrder.pending, (state) => { state.isLoading = true; })
            .addCase(payOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload;
            })
            .addCase(payOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // List My Orders
            .addCase(listMyOrders.pending, (state) => { state.isLoading = true; })
            .addCase(listMyOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myOrders = action.payload;
            })
            .addCase(listMyOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(markAsReceived.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(markAsReceived.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload;
            })
            .addCase(markAsReceived.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;