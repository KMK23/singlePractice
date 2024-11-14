import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { addDoc, collection, updateDoc } from "firebase/firestore";

// 비동기 로그인 함수
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firestore의 users 컬렉션에 사용자 정보 저장
      const docRef = await addDoc(collection(db, "users"), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // 문서 ID를 필드로 저장
      await updateDoc(docRef, {
        docId: docRef.id,
      });

      return {
        docId: docRef.id, // 문서 ID를 반환
        email: user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (_, { rejectWithValue }) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestore의 users 컬렉션에 구글 로그인 사용자 정보 저장
      const docRef = await addDoc(collection(db, "users"), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // 문서 ID를 필드로 저장
      await updateDoc(docRef, {
        docId: docRef.id, // 문서 ID를 docId 필드로 업데이트
      });

      // localStorage에 로그인 정보를 저장
      localStorage.setItem(
        "user",
        JSON.stringify({
          docId: docRef.id,
          email: user.email,
        })
      );

      return {
        docId: docRef.id, // 문서 ID를 반환
        email: user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 비동기 로그아웃 함수
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  await signOut(auth);

  // localStorage에서 사용자 정보 제거
  localStorage.removeItem("user");
});
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const selectUser = (state) => state.user;
export default userSlice.reducer;
