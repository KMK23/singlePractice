import React, { useState } from "react";
import styles from "./SeatSelection.module.scss";
import Button from "../../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import * as PortOne from "https://cdn.portone.io/v2/browser-sdk.esm.js";
import { useDispatch } from "react-redux";
import { addReservation } from "../../store/reservationSlice/reservationSlice"; // Redux 액션
import { addPaymentHistory } from "../../firebase"; // Firestore 추가 함수
import { TextField } from "@mui/material";
import kroDate from "../../components/korDate/KorDate";

function SeatSelection() {
  const rows = Array.from({ length: 10 }, (_, i) =>
    String.fromCharCode(65 + i)
  ); // A to J
  const leftCoupleSeats = 4;
  const centerSeats = 8;
  const rightCoupleSeats = 4;

  const { state } = useLocation(); // 예약 정보 (영화, 장소, 시간 등)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // 전화번호 상태

  const handleSeatClick = (seat) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, ""); // 숫자만 남기기

    // '010'이 없으면 010을 자동으로 추가
    if (!value.startsWith("010")) {
      value = "010" + value;
    }

    // 010 뒤에 -을 추가하고, 그 후 4자리마다 -을 추가
    if (value.length > 3 && value.length <= 7) {
      value = value.substring(0, 3) + "-" + value.substring(3, 7);
    } else if (value.length > 7) {
      value =
        value.substring(0, 3) +
        "-" +
        value.substring(3, 7) +
        "-" +
        value.substring(7, 11);
    }

    setPhone(value); // 상태 업데이트
  };
  const handleSubmit = async () => {
    // 사용자 정보 가져오기
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.docId : null;

    // 이름, 전화번호, 좌석 선택 확인
    if (!name || !phone || selectedSeats.length === 0) {
      alert("이름, 전화번호, 그리고 좌석을 모두 선택해주세요.");
      return; // 처리 종료
    }

    // 유효한 사용자 ID가 있을 경우 진행
    if (userId) {
      const seatPrice = 1000; // 예시로 1석당 1000원
      const totalAmount = selectedSeats.length * seatPrice; // 총 금액 계산

      const reservationData = {
        ...state,
        selectedSeats,
        name,
        phone,
        price: totalAmount,
        selectedDate: state.selectedDate, // 날짜 추가
        selectedMovie: state.selectedMovie, // 영화 이름 추가
        selectedRegion: state.selectedRegion, // 지역 추가
        selectedTheater: state.selectedTheater, // 극장 추가
        selectedTime: state.selectedTime, // 시간 추가
      };

      // 결제 요청
      const paymentInfo = await requestPayment(userId, reservationData);

      if (paymentInfo) {
        // 결제 완료 후 처리
        alert("예약이 완료되었습니다.");

        // 예약 정보 저장 (Firestore)
        dispatch(addReservation(reservationData)); // Redux에 예약 정보 추가
        await addPaymentHistory("users", userId, paymentInfo, reservationData); // 결제 내역과 예약 정보 Firestore에 저장

        navigate("/"); // 예약 성공 페이지로 이동
      }
    } else {
      console.error("사용자 정보가 없습니다.");
    }
  };

  const requestPayment = async (userId, reservationData) => {
    const response = await PortOne.requestPayment({
      storeId: process.env.REACT_APP_STOREID,
      paymentId: `movie-${Date.now()}`,
      orderName: `영화 ${reservationData.selectedMovie} 예약`,
      totalAmount: reservationData.price,
      currency: "KRW",
      payMethod: "CARD",
      channelKey: process.env.REACT_APP_CHANNELKEY,
      customer: {
        phoneNumber: reservationData.phone,
        fullName: reservationData.name,
        email: JSON.parse(localStorage.getItem("user")).email,
      },
      redirectUrl: "localhost:3000", // 결제 후 리디렉션 URL
    });

    if (response && response.txId) {
      return {
        paymentDate: kroDate(),
        amount: reservationData.price,
        paymentId: response.paymentId,
      };
    } else {
      console.error("결제 실패");
      return null;
    }
  };

  return (
    <div className={styles.SeatSelectionContainer}>
      <h1>좌석 선택</h1>

      <div className={styles.InputSection}>
        <TextField
          required
          label="이름"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          className={styles.muiInput}
        />
        <TextField
          required
          label="전화번호"
          variant="outlined"
          value={phone}
          onChange={handlePhoneChange} // 전화번호 입력 변화 처리
          fullWidth
          margin="normal"
          placeholder="숫자만 입력 (예: 010-1234-5678)"
          className={styles.muiInput}
        />
      </div>

      {/* 좌석 선택 UI */}
      <div className={styles.Screen}>스크린</div>
      <div className={styles.EntryExit}>
        <span className={styles.Entry}>입구</span>
        <span className={styles.Exit}>출구</span>
      </div>
      <div className={styles.AisleSpace} />
      <div className={styles.SeatGrid}>
        {rows.map((row) => (
          <div key={row} className={styles.Row}>
            {[...Array(leftCoupleSeats)].map((_, i) => {
              const seat = `${row}${i + 1}`;
              const isSelected = selectedSeats.includes(seat);
              return (
                <div
                  key={seat}
                  className={`${styles.Seat} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat}
                </div>
              );
            })}
            <div className={styles.VerticalAisle} />
            {[...Array(centerSeats)].map((_, i) => {
              const seat = `${row}${i + leftCoupleSeats + 1}`;
              const isSelected = selectedSeats.includes(seat);
              return (
                <div
                  key={seat}
                  className={`${styles.Seat} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat}
                </div>
              );
            })}
            <div className={styles.VerticalAisle} />
            {[...Array(rightCoupleSeats)].map((_, i) => {
              const seat = `${row}${i + leftCoupleSeats + centerSeats + 1}`;
              const isSelected = selectedSeats.includes(seat);
              return (
                <div
                  key={seat}
                  className={`${styles.Seat} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.SelectedSeats}>
        <h2>선택된 좌석: {selectedSeats.join(", ") || "없음"}</h2>
      </div>

      {/* 결제하기 버튼 */}
      <Button
        onClick={handleSubmit}
        disabled={!name || !phone || selectedSeats.length === 0}
      >
        결제하기
      </Button>
    </div>
  );
}

export default SeatSelection;
