import React from "react";
import styles from "./TimeSelection.module.scss";

function TimeSelection({ selectedTime, setSelectedTime }) {
  const times = ["10:00", "12:30", "15:00", "17:30", "20:00"];

  return (
    <div className={styles.TimeSelectionContainer}>
      <h2 className={styles.Title}>시간 선택</h2>
      <div className={styles.TimeButtonGroup}>
        {times.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`${styles.TimeButton} ${
              selectedTime === time ? styles.selected : ""
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TimeSelection;
