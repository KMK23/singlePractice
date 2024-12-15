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

      const users = await getDatas("users", {
        conditions: [{ field: "email", operator: "==", value: user.email }],
      });

      if (!Array.isArray(users) || users.length === 0) {
        throw {
          code: "auth/user-not-found",
          message: "사용자를 찾을 수 없습니다.",
        };
      }

      const userData = users[0];
      if (userData.active !== "Y") {
        throw {
          code: "auth/user-disabled",
          message: "사용자가 비활성화 상태입니다.",
        };
      }

      const createdAt =
        typeof userData.createdAt === "string"
          ? userData.createdAt
          : String(userData.createdAt);

      localStorage.setItem(
        "user",
        JSON.stringify({
          docId: userData.docId,
          email: user.email,
          createdAt: createdAt,
        })
      );

      return {
        docId: userData.docId,
        email: user.email,
        createdAt: createdAt,
      };
    } catch (error) {
      return rejectWithValue({ code: error.code, message: error.message });
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

      const docRef = await addDatas("users", {
        email: user.email,
        createdAt: kroDate(),
        docId: "",
        active: "Y",
      });

      const docId = docRef.id;

      await updateDatas("users", docId, { docId });

      return {
        docId: docId,
        email: user.email,
      };
    } catch (error) {
      return rejectWithValue({ code: error.code, message: error.message });
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

      const users = await getDatas("users", {
        conditions: [{ field: "email", operator: "==", value: user.email }],
      });

      if (users.length > 0) {
        const userData = users[0];
        const docId = userData.docId;

        if (userData.active !== "Y") {
          throw new Error("사용자가 비활성화 상태입니다.");
        }

        localStorage.setItem(
          "user",
          JSON.stringify({
            docId: docId,
            email: user.email,
            createdAt: userData.createdAt,
          })
        );

        return {
          docId: docId,
          email: user.email,
          createdAt: userData.createdAt,
        };
      } else {
        const docRef = await addDatas("users", {
          email: user.email,
          createdAt: kroDate(),
          docId: "",
          active: "Y",
        });

        const docId = docRef.id;

        await updateDatas("users", docId, { docId });

        localStorage.setItem(
          "user",
          JSON.stringify({
            docId: docId,
            email: user.email,
            createdAt: kroDate(),
          })
        );

        return {
          docId: docId,
          email: user.email,
          createdAt: kroDate(),
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  await signOut(auth);
  localStorage.removeItem("user");
});

const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser,
    status: "idle",
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message; // 명확한 오류 메시지 저장
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
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
      });
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;
