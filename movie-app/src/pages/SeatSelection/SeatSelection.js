import React, { useEffect, useState } from "react";
import styles from "./SeatSelection.module.scss";
import Button from "../../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import * as PortOne from "https://cdn.portone.io/v2/browser-sdk.esm.js";
import {
  addDatas,
  addPaymentHistory,
  getDatas,
  updateDatas,
} from "../../firebase"; // Firestore 추가 함수
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
  const navigate = useNavigate();
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // 전화번호 상태

  // 예약된 좌석 불러오기
  useEffect(() => {
    const fetchSeats = async () => {
      const { selectedMovie, selectedDate, selectedTime } = state;

      const conditions = [
        { field: "id", operator: "==", value: selectedMovie.id },
        { field: "selectedDate", operator: "==", value: selectedDate },
        { field: "selectedTime", operator: "==", value: selectedTime },
      ];

      try {
        const data = await getDatas("reservations", { conditions });
        // 모든 예약된 좌석 데이터 합치기
        const allReservedSeats = data.flatMap((doc) => doc.selectedSeats || []);
        setReservedSeats(allReservedSeats); // 상태 업데이트
      } catch (error) {
        console.error("예약된 좌석 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchSeats();
  }, [state]);

  const handleSeatClick = (seat) => {
    if (reservedSeats.includes(seat)) {
      alert("이미 예약된 좌석입니다.");
      return; // 예약된 좌석 클릭 방지
    }
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, ""); // 숫자만 남기기

    if (!value.startsWith("010")) {
      value = "010" + value;
    }

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
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.docId : null;

    if (!name || !phone || selectedSeats.length === 0) {
      alert("이름, 전화번호, 그리고 좌석을 모두 선택해주세요.");
      return;
    }

    if (userId) {
      const seatPrice = 1000; // 예시로 1석당 1000원
      const totalAmount = selectedSeats.length * seatPrice;

      const email = user ? user.email : "";
      const reservationData = {
        selectedSeats,
        name,
        phone,
        price: totalAmount,
        selectedDate: state.selectedDate,
        id: state.selectedMovie.id,
        title: state.selectedMovie.title,
        selectedRegion: state.selectedRegion,
        selectedTheater: state.selectedTheater,
        selectedTime: state.selectedTime,
        email: email,
      };

      const paymentInfo = await requestPayment(userId, reservationData);

      if (!paymentInfo) {
        // 결제 실패 또는 취소 시 예약 진행하지 않음
        alert("결제에 실패하였습니다. 다시 시도해주세요.");
        return;
      }

      alert("예약이 완료되었습니다.");

      // Firestore 문서 생성 및 ID 가져오기
      const reservationDocRef = await addDatas("reservations", reservationData); // 문서 생성
      const docId = reservationDocRef.id; // Firestore 문서 ID 가져오기

      // 문서 ID를 포함한 데이터 생성
      const updatedReservationData = {
        ...reservationData,
        docId, // 문서 ID 추가
      };

      // Firestore 문서를 업데이트하여 문서 ID 저장
      await updateDatas("reservations", docId, updatedReservationData);

      // 결제 내역 저장
      await addPaymentHistory(
        "users",
        userId,
        paymentInfo,
        updatedReservationData
      );

      navigate("/"); // 예약 성공 페이지로 이동
    } else {
      console.error("사용자 정보가 없습니다.");
    }
  };

  const cancelReservation = (reservationId) => {
    // 예매 상태를 취소하는 로직
    console.log(`예매 ${reservationId} 취소`);
    // 실제로 상태 변경하는 로직을 여기에 추가
  };

  const requestPayment = async (userId, reservationData) => {
    console.log("결제 요청 시작", reservationData);

    try {
      const response = await PortOne.requestPayment({
        storeId: process.env.REACT_APP_STOREID,
        paymentId: JSON.parse(localStorage.getItem("user")).email,
        orderName: `영화 ${reservationData.title} 예약`,
        totalAmount: reservationData.price,
        currency: "KRW",
        payMethod: "CARD",
        channelKey: process.env.REACT_APP_CHANNELKEY,
        customer: {
          phoneNumber: reservationData.phone,
          fullName: reservationData.name,
          email: JSON.parse(localStorage.getItem("user")).email,
        },
        redirectUrl: "localhost:3000",
      });

      console.log("결제 응답:", response);

      // 결제 실패인 경우 처리
      if (response.code === "FAILURE_TYPE_PG") {
        console.error("결제 실패:", response.message);
        alert("결제에 실패했습니다. 다시 시도해주세요.");
        cancelReservation(reservationData.reservationId); // 결제 실패 시 예매 취소
        return null; // 결제 실패시 더 이상 진행하지 않음
      }

      if (response && response.txId) {
        return {
          paymentDate: kroDate(),
          amount: reservationData.price,
          paymentId: response.paymentId,
        };
      } else {
        console.error("결제 취소 또는 오류 발생");
        return null;
      }
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
      cancelReservation(reservationData.reservationId); // 결제 중 오류 발생 시 예매 취소
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
          onChange={handlePhoneChange}
          fullWidth
          margin="normal"
          placeholder="숫자만 입력 (예: 010-1234-5678)"
          className={styles.muiInput}
        />
      </div>

      {/* 좌석 선택 UI */}
      <div className={styles.Screen}>스크린</div>
      <div className={styles.SeatGrid}>
        {rows.map((row) => (
          <div key={row} className={styles.Row}>
            {[...Array(leftCoupleSeats)].map((_, i) => {
              const seat = `${row}${i + 1}`;
              const isReserved = reservedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);
              return (
                <div
                  key={seat}
                  className={`${styles.Seat} ${
                    isReserved
                      ? styles.reserved
                      : isSelected
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => !isReserved && handleSeatClick(seat)}
                >
                  {seat}
                </div>
              );
            })}
            <div className={styles.VerticalAisle} />
            {[...Array(centerSeats)].map((_, i) => {
              const seat = `${row}${i + leftCoupleSeats + 1}`;
              const isReserved = reservedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);
              return (
                <div
                  key={seat}
                  className={`${styles.Seat} ${
                    isReserved
                      ? styles.reserved
                      : isSelected
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => !isReserved && handleSeatClick(seat)}
                >
                  {seat}
                </div>
              );
            })}
            <div className={styles.VerticalAisle} />
            {[...Array(rightCoupleSeats)].map((_, i) => {
              const seat = `${row}${i + leftCoupleSeats + centerSeats + 1}`;
              const isReserved = reservedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);
              return (
                <div
                  key={seat}
                  className={`${styles.Seat} ${
                    isReserved
                      ? styles.reserved
                      : isSelected
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => !isReserved && handleSeatClick(seat)}
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

      <Button
        onClick={handleSubmit}
        disabled={!name || !phone || selectedSeats.length === 0}
        className={styles.reservBtn}
      >
        결제하기
      </Button>
    </div>
  );
}

export default SeatSelection;
