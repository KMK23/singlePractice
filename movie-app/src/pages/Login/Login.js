import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../../store/userSlice/userSlice";

function Login() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.userSlice);

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  return (
    <div>
      <h2>로그인</h2>
      <button onClick={handleGoogleLogin} disabled={isLoading}>
        {isLoading ? "로그인 중..." : "Google로 로그인"}
      </button>
      {error && <p style={{ color: "red" }}>로그인 에러: {error}</p>}
    </div>
  );
}

export default Login;
