import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/users/';
const user = JSON.parse(localStorage.getItem('user'));

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'register', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        // 1. קח את עגלת האורח מה-state הנוכחי
        const { cart: { cartItems: guestCart } } = thunkAPI.getState();

        // 2. שלח את פרטי ההתחברות וגם את עגלת האורח לשרת
        const response = await axios.post(API_URL + 'login', { ...userData, guestCart });

        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            // 3. ננקה את עגלת האורח מהאחסון המקומי
            localStorage.removeItem('guestCart');
        }
        return response.data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    localStorage.removeItem('user');
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.put('/api/users/profile', userData, config);
        // חשוב: נעדכן את ה-localStorage עם המידע והטוקן החדשים
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteUserAccount = createAsyncThunk('auth/deleteAccount', async (_, thunkAPI) => {
    try {
        const { auth: { user } } = thunkAPI.getState();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete('/api/users/profile', config);
        // הצלחה במחיקה תפעיל את פעולת ה-logout
        thunkAPI.dispatch(logout());
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        console.log(message)
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => { state.isLoading = true; })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => { state.isLoading = true; })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; // עדכון המשתמש ב-state עם המידע החדש מהשרת
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteUserAccount.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteUserAccount.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true; // נסמן הצלחה, וה-logout כבר ניקה את המשתמש
            })
            .addCase(deleteUserAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // כאן תהיה ההודעה "לא ניתן למחוק..."
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;