import { createSlice } from "@reduxjs/toolkit";
import { auth, googleProvider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUser, setIsLoading, setError } = userSlice.actions;

// 이메일 로그인
export const loginUser = (email, password) => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    dispatch(setUser(userCredential.user));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIsLoading(false));
  }
};

// Google 로그인
export const loginWithGoogle = () => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    dispatch(setUser(userCredential.user));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIsLoading(false));
  }
};

// 로그아웃
export const logOutUser = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(setUser(null));
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export default userSlice.reducer;
