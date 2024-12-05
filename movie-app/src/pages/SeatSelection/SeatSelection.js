import React, { useEffect, useState } from "react";
import styles from "./SeatSelection.module.scss";
import Button from "../../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import * as PortOne from "https://cdn.portone.io/v2/browser-sdk.esm.js";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReservedSeats,
  addSeats,
} from "../../store/reservationSlice/reservationSlice"; // Redux 액션
import { addDatas, addPaymentHistory } from "../../firebase"; // Firestore 추가 함수
import { TextField } from "@mui/material";
import kroDate from "../../components/korDate/KorDate";
import { updateDoc } from "firebase/firestore";

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
  const { reservedSeats } = useSelector((state) => state.reservation); // Redux에서 예약된 좌석 가져오기

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // 전화번호 상태

  // 예약된 좌석 불러오기
  useEffect(() => {
    const { selectedMovie, selectedDate, selectedTime } = state;
    dispatch(
      fetchReservedSeats({
        collectionName: "reservations",
        queryOptions: {
          conditions: [
            { field: "movieId", operator: "==", value: selectedMovie.id },
            { field: "date", operator: "==", value: selectedDate },
            { field: "time", operator: "==", value: selectedTime },
          ],
        },
      })
    );
  }, [dispatch, state]);

  const handleSeatClick = (seat) => {
    if (reservedSeats.includes(seat)) {
      alert("이 좌석은 이미 예약되었습니다.");
      return; // 이미 예약된 좌석은 선택 불가
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

      console.log("예약 정보:", reservationData);

      const paymentInfo = await requestPayment(userId, reservationData);

      if (paymentInfo) {
        alert("예약이 완료되었습니다.");

        // 예약 정보(reservationInfo)는 'reservations' 컬렉션에 추가
        const reservationDocRef = await addDatas("reservations", {
          reservationInfo: {
            ...reservationData, // reservationData 추가
          },
        });

        const reservationDocId = reservationDocRef.id; // Firestore 문서 ID 가져오기
        console.log("예약 문서 ID:", reservationDocId); // ID가 제대로 출력되는지 확인

        if (reservationDocId) {
          // reservationData에 reservationDocId를 추가
          const updatedReservationData = {
            ...reservationData,
            reservationDocId: reservationDocId, // reservationDocId를 추가
          };

          console.log("업데이트된 예약 데이터:", updatedReservationData); // updatedReservationData 확인

          // 결제 내역(paymentHistory)은 'users' 컬렉션에 추가
          await addPaymentHistory(
            "users",
            userId,
            paymentInfo,
            updatedReservationData
          );

          // 예약된 좌석 업데이트
          await dispatch(
            addSeats({
              collectionName: "reservations",
              docId: reservationDocId,
              newSeats: [...reservedSeats, ...selectedSeats], // 선택된 좌석만 추가
            })
          );

          navigate("/"); // 예약 성공 페이지로 이동
        }
      }
    } else {
      console.error("사용자 정보가 없습니다.");
    }
  };

  const requestPayment = async (userId, reservationData) => {
    const response = await PortOne.requestPayment({
      storeId: process.env.REACT_APP_STOREID,
      paymentId: `movie-${Date.now()}`,
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
