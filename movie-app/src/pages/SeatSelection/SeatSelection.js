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
      <div className={styles.seatLayout}>
        {/* 좌석 레이아웃 생성 */}
        {[...Array(rows)].map((_, row) => (
          <div key={row} className={styles.row}>
            <span className={styles.rowLabel}>
              {String.fromCharCode(65 + row)}
            </span>
            {[...Array(seatsPerRow)].map((_, seat) => {
              const seatId = `${String.fromCharCode(65 + row)}-${seat + 1}`;
              const isSelected = selectedSeats.includes(seatId);
              return (
                <div
                  key={seat}
                  className={`${styles.seat} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => handleSeatClick(row, seat)}
                >
                  {seat + 1}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.selectedSeats}>
        <h3>선택한 좌석:</h3>
        {selectedSeats.length > 0 ? (
          selectedSeats.map((seat) => <span key={seat}>{seat}, </span>)
        ) : (
          <span>좌석을 선택하세요</span>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
