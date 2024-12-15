import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDatas, deleteDatas, updateDatas } from "../../firebase";
import styles from "./MyPage.module.scss";
import { setUser } from "../../store/userSlice/userSlice";
import EditPopup from "../EditPopup/EditPopup";

function MyPage() {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 모달 상태 관리
  const [paymentHistory, setPaymentHistory] = useState([]); // 결제 내역 상태 추가

  useEffect(() => {
    if (!isLoggedIn || !user) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    const fetchReservations = async () => {
      try {
        if (user?.email) {
          // user가 존재하는 경우에만 이메일을 사용
          const data = await getDatas("reservations", {
            conditions: [{ field: "email", operator: "==", value: user.email }],
          });
          setReservations(data);
          console.log(reservations);
        }
      } catch (error) {
        console.error("예약 내역 가져오기 오류:", error);
      }
    };

    const fetchPaymentHistory = async () => {
      try {
        if (user?.email) {
          // user가 존재하는 경우에만 이메일을 사용
          const data = await getDatas("users", {
            conditions: [{ field: "email", operator: "==", value: user.email }],
          });
          const targetData = data[0].paymentHistory;
          setPaymentHistory(targetData);
        }
      } catch (error) {
        console.error("결제 내역 가져오기 오류:", error);
      }
    };

    // 예약 및 결제 내역 로딩
    fetchReservations();
    fetchPaymentHistory();
    setLoading(false);
  }, [isLoggedIn, user, navigate]); // user 상태가 변경될 때마다 실행

  const handleLogout = () => {
    dispatch(setUser(null));
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const reservationDocId = reservations.find(
        (reservation) => reservation.id === reservationId
      )?.docId;
      if (!reservationDocId) {
        throw new Error("유효하지 않은 docId입니다.");
      }

      await deleteDatas("reservations", reservationDocId);
      setReservations((prev) =>
        prev.filter((res) => res.docId !== reservationDocId)
      );
      alert("예매가 취소되었습니다.");
    } catch (error) {
      console.error("예매 취소 오류:", error);
      alert("예매 취소 중 오류가 발생했습니다.");
    }
  };

  const handleTransferTicket = async (reservationId, newEmail) => {
    try {
      const reservationDocId = reservations.find(
        (reservation) => reservation.id === reservationId
      )?.docId;
      if (!reservationDocId) {
        throw new Error("유효하지 않은 docId입니다.");
      }

      await updateDatas("reservations", reservationDocId, { email: newEmail });
      setReservations((prev) =>
        prev.map((res) =>
          res.docId === reservationDocId ? { ...res, email: newEmail } : res
        )
      );
      alert(`티켓이 ${newEmail} 님에게 양도되었습니다.`);
    } catch (error) {
      console.error("티켓 양도 오류:", error);
      alert("티켓 양도 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.myPageContainer}>
      <h1>마이페이지</h1>

      {user ? (
        <>
          <div className={styles.profileSection}>
            <h2>내 정보</h2>
            <p>이메일: {user.email}</p>
            <p>가입일: {user.createdAt.slice(0, 10)}</p>
          </div>

          <div className={styles.reservationSection}>
            <h2>예약 내역</h2>
            {loading ? (
              <p>로딩 중...</p>
            ) : reservations.length > 0 ? (
              <ul className={styles.reservationList}>
                {reservations.map((reservation, index) => (
                  <li key={index} className={styles.reservationItem}>
                    <strong>영화:</strong> {reservation.title} <br />
                    <div className={styles.reservationDetails}>
                      <p>
                        <strong>날짜:</strong> {reservation.selectedDate}
                      </p>
                      <p>
                        <strong>시간:</strong> {reservation.selectedTime}
                      </p>
                      <p>
                        <strong>좌석:</strong>{" "}
                        {reservation.selectedSeats.join(", ")}
                      </p>
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        예매 취소
                      </button>
                      <button
                        className={styles.transferButton}
                        onClick={() => {
                          const newEmail = prompt(
                            "양도할 이메일을 입력하세요:",
                            ""
                          );
                          if (newEmail) {
                            handleTransferTicket(reservation.id, newEmail);
                          }
                        }}
                      >
                        티켓 양도
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>예약 내역이 없습니다.</p>
            )}
          </div>

          {/* 결제 내역 추가 */}
          <div className={styles.paymentSection}>
            <h2>결제 내역</h2>
            {paymentHistory.length > 0 ? (
              <ul className={styles.paymentList}>
                {paymentHistory.map((payment, index) => (
                  <li key={index} className={styles.paymentItem}>
                    <p>
                      <strong>결제 금액:</strong> {payment.amount}원
                    </p>
                    <p>
                      <strong>결제 일시:</strong> {payment.paymentDate}
                    </p>
                    <p>
                      <strong>결제 E-mail:</strong> {payment.paymentId}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>결제 내역이 없습니다.</p>
            )}
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.editButton}
              onClick={() => setIsPopupOpen(true)}
            >
              비밀번호 변경
            </button>
            <button className={styles.logOutButton} onClick={handleLogout}>
              로그 아웃
            </button>
          </div>

          {isPopupOpen && (
            <EditPopup onClose={() => setIsPopupOpen(false)} user={user} />
          )}
        </>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
}

export default MyPage;
