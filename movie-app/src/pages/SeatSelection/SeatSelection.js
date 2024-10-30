import React, { useState } from "react";
import styles from "./SeatSelection.module.scss";

const rows = 11; // A부터 K까지 총 11개
const seatsPerRow = 15; // 15개 열

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 좌석 클릭 핸들러
  const handleSeatClick = (row, seat) => {
    const seatId = `${String.fromCharCode(65 + row)}-${seat + 1}`; // A=65, B=66...
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <div className={styles.seatSelectionContainer}>
      <h2>좌석 선택</h2>
      <div className={styles.seatLayout}>{[...Array(rows)]}</div>
    </div>
  );
};

export default SeatSelection;
