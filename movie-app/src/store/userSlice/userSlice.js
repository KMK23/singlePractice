import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getDatas, addDatas, updateDatas } from "../../firebase";
import kroDate from "../../components/korDate/KorDate";

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
      const user = userCredential.user;

      // Firestore에서 해당 사용자의 docId를 가져오기
      const users = await getDatas("users", {
        conditions: [{ field: "email", operator: "==", value: user.email }],
      });

      if (users.length > 0) {
        const docId = users[0].docId;

        // localStorage에 docId와 email을 저장
        localStorage.setItem(
          "user",
          JSON.stringify({
            docId: docId,
            email: user.email,
          })
        );

        return {
          docId: docId, // Firestore 문서 ID 반환
          email: user.email,
        };
      } else {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
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

      // Firestore의 users 컬렉션에 사용자 정보 저장 (docId 필드를 포함)
      const docId = await addDatas("users", {
        email: user.email,
        createdAt: kroDate(),
        docId: "", // 문서 ID를 필드로 추가
      });

      // Firestore에서 해당 사용자의 docId를 업데이트
      await updateDatas("users", docId, {
        docId: docId, // 문서 ID를 필드에 추가
      });

      // 문서 ID를 반환
      return {
        docId: docId, // 문서 ID를 반환
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

      // Firestore의 users 컬렉션에 구글 로그인 사용자 정보 저장 (docId 필드를 포함)
      const docId = await addDatas("users", {
        email: user.email,
        createdAt: kroDate(),
        docId: "", // 문서 ID를 필드로 추가
      });

      // Firestore에서 해당 사용자의 docId를 업데이트
      await updateDatas("users", docId, {
        docId: docId, // 문서 ID를 필드에 추가
      });

      // localStorage에 로그인 정보를 저장
      localStorage.setItem(
        "user",
        JSON.stringify({
          docId: docId,
          email: user.email,
        })
      );

      return {
        docId: docId, // 문서 ID를 반환
        email: user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 비동기 로그아웃 함수
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  await signOut(auth)
    .then(() => console.log("Firebase 로그아웃 성공"))
    .catch((error) => console.error("Firebase 로그아웃 실패:", error));

  // localStorage에서 사용자 정보 제거
  localStorage.removeItem("user");
});

const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser, // 사용자 정보가 있으면 true
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

        localStorage.setItem("user", JSON.stringify(action.payload));
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

        localStorage.setItem("user", JSON.stringify(action.payload));
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

        // localStorage에 사용자 정보 저장
        localStorage.setItem("user", JSON.stringify(action.payload));
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

        // localStorage에서 사용자 정보 제거
        localStorage.removeItem("user");
      });
  },
});

export const selectUser = (state) => state.user;
export default userSlice.reducer;
