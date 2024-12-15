import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { updateDatas } from "../../firebase"; // Firestore 업데이트 함수
import styles from "./EditProfilePage.module.scss";
import { setUser, selectUser } from "../../store/userSlice/userSlice";
import { getAuth } from "firebase/auth";

function EditProfilePage() {
  const user = useSelector(selectUser); // Redux에서 사용자 정보 가져오기
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newEmail, setNewEmail] = useState(user?.user.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      currentUser.reload().then(() => {
        setIsEmailVerified(currentUser.emailVerified); // 이메일 인증 상태 확인
      });
    }
  }, [currentUser]);

  const handleEmailUpdate = async () => {
    if (!newEmail || newEmail === user.user.email) {
      setErrorMessage("새 이메일을 입력해주세요.");
      return;
    }

    try {
      await sendEmailVerification(currentUser);
      setSuccessMessage("새 이메일로 인증 링크가 전송되었습니다.");
      setErrorMessage("");
    } catch (error) {
      console.error("이메일 인증 전송 오류:", error);
      setErrorMessage("이메일 인증을 보내는 데 실패했습니다.");
    }
  };

  const handleEmailVerification = async () => {
    try {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        // 이메일 변경 처리
        await updateEmail(currentUser, newEmail);
        await updateDatas("users", user.user.docId, { email: newEmail }); // Firestore 업데이트
        dispatch(setUser({ ...user.user, email: newEmail }));

        setSuccessMessage("이메일이 성공적으로 변경되었습니다.");
        setErrorMessage("");
      } else {
        setErrorMessage(
          "이메일 인증이 완료되지 않았습니다. 인증 후 다시 시도해주세요."
        );
      }
    } catch (error) {
      console.error("이메일 변경 오류:", error);
      setErrorMessage("이메일 변경에 실패했습니다.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
      setErrorMessage("");
    } catch (error) {
      console.error("비밀번호 업데이트 오류:", error);
      if (error.code === "auth/wrong-password") {
        setErrorMessage("현재 비밀번호가 올바르지 않습니다.");
      } else {
        setErrorMessage("비밀번호 업데이트에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newEmail && newEmail !== user.user.email) {
      handleEmailUpdate();
    }

    if (newPassword || confirmPassword) {
      handlePasswordUpdate();
    }
  };

  return (
    <div className={styles.editProfileContainer}>
      <h1>정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>새 이메일</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="새 이메일을 입력하세요"
            className={styles.input}
          />
        </div>

        {/* 이메일 인증을 위한 버튼 추가 */}
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleEmailUpdate}
        >
          이메일 인증 보내기
        </button>

        {isEmailVerified && (
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleEmailVerification}
          >
            이메일 변경
          </button>
        )}

        <div className={styles.formGroup}>
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호를 입력하세요"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.saveButton}>
          수정 완료
        </button>
      </form>

      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      <button
        className={styles.cancelButton}
        onClick={() => navigate("/myPage")}
      >
        취소
      </button>
    </div>
  );
}

export default EditProfilePage;
