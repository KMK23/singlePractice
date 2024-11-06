import React, { useState } from "react";
import styles from "./SeatSelection.module.scss";
import Button from "./../../components/Button/Button";

function SeatSelection() {
  const rows = Array.from({ length: 10 }, (_, i) =>
    String.fromCharCode(65 + i)
  ); // A to J
  const leftCoupleSeats = 4; // 양쪽 끝 커플석
  const centerSeats = 8; // 가운데 일반 좌석
  const rightCoupleSeats = 4; // 오른쪽 커플석

  const [selectedSeats, setSelectedSeats] = useState([]);

  // 좌석 선택/해제 핸들러
  const handleSeatClick = (seat) => {
    setSelectedSeats(
      (prevSelectedSeats) =>
        prevSelectedSeats.includes(seat)
          ? prevSelectedSeats.filter((s) => s !== seat) // 선택 해제
          : [...prevSelectedSeats, seat] // 선택 추가
    );
  };

  return (
    <div className={styles.SeatSelectionContainer}>
      <h1>좌석 선택</h1>
      <div className={styles.Screen}>스크린</div> {/* 스크린 표시 */}
      <div className={styles.EntryExit}>
        <span className={styles.Entry}>입구</span>
        <span className={styles.Exit}>출구</span>
      </div>
      <div className={styles.AisleSpace} />{" "}
      {/* 스크린과 A열 사이의 여유 공간 */}
      <div className={styles.SeatGrid}>
        {rows.map((row) => (
          <div key={row} className={styles.Row}>
            {/* 왼쪽 커플석 */}
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
            <div className={styles.VerticalAisle} /> {/* 가운데 통로 */}
            {/* 가운데 일반 좌석 */}
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
            <div className={styles.VerticalAisle} /> {/* 오른쪽 통로 */}
            {/* 오른쪽 커플석 */}
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
      <Button>결제하기</Button>
    </div>
  );
}

export default SeatSelection;
