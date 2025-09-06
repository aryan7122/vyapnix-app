import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Aapke backend ka URL
const API_URL = 'http://10.237.148.74:5001/api/auth';

// User data ka type
interface UserData {
    uid: string;
    fullName: string;
    mobileNumber: string;
    role: 'User' | 'Business';
    businessType?: string;
    avatarUrl?: string;
}

// Slice ki state ka structure
interface AuthState {
    user: UserData | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
    verificationId: string | null; // OTP verification ke liye
    isNewUser: boolean; // Backend se pata chalega
}

const initialState: AuthState = {
    user: null,
    loading: 'idle',
    error: null,
    verificationId: null,
    isNewUser: false,
};

// Async Thunk: Phone number par OTP bhejne ke liye
export const sendOtp = createAsyncThunk('auth/sendOtp', async (phoneNumber: string, { rejectWithValue }) => {
    try {
        const confirmation = await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
        return confirmation.verificationId;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

// Async Thunk: OTP verify karke backend se user data lene ke liye
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ verificationId, otpCode }: { verificationId: string, otpCode: string }, { rejectWithValue }) => {
    try {
        const credential = auth.PhoneAuthProvider.credential(verificationId, otpCode);
        const userCredential = await auth().signInWithCredential(credential);
        const idToken = await userCredential.user.getIdToken();
        
        // Backend ko token bhejkar check karein ki user naya hai ya purana
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return rejectWithValue(data.message);
        }
        
        return { userData: data.userData, isNewUser: data.isNewUser, idToken };
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

// Async Thunk: Naye user ko register karne ke liye
export const registerUser = createAsyncThunk('auth/registerUser', async (formData: FormData, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            body: formData,
            // Headers ko FormData ke liye set na karein, browser/client khud karta hai
        });

        const data = await response.json();
        if (!response.ok) {
            return rejectWithValue(data.message);
        }
        return data.userData;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        signOut: (state) => {
            state.user = null;
            auth().signOut();
            AsyncStorage.removeItem('userData');
        }
    },
    extraReducers: (builder) => {
        builder
            // Send OTP
            .addCase(sendOtp.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = 'succeeded';
                state.verificationId = action.payload;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.isNewUser = action.payload.isNewUser;
                // Agar user purana hai to state update karo
                if (!action.payload.isNewUser) {
                    state.user = action.payload.userData;
                    AsyncStorage.setItem('userData', JSON.stringify(action.payload.userData));
                }
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserData>) => {
                state.loading = 'succeeded';
                state.user = action.payload;
                state.isNewUser = false; // Registration poora ho gaya
                AsyncStorage.setItem('userData', JSON.stringify(action.payload));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { clearError, signOut } = authSlice.actions;
export default authSlice.reducer;
