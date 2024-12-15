import React, { useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  getAuth,
} from "firebase/auth";
import styles from "./EditPopup.module.scss";

function EditPopup({ onClose, user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential); // 현재 비밀번호 인증
      await updatePassword(currentUser, newPassword); // 비밀번호 변경
      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setError("");

      // 1초 후 모달 자동 닫기
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError("비밀번호 변경 중 오류가 발생했습니다.");
      setSuccess("");
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>비밀번호 변경</h2>
        <div className={styles.inputGroup}>
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호 입력"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 입력"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 재입력"
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}
        <div className={styles.buttonGroup}>
          <button onClick={handlePasswordChange} className={styles.saveButton}>
            저장
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPopup;
