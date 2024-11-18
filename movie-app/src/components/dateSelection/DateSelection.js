import React from "react";
import styles from "./DateSelection.module.scss";

function DateSelection({ selectedDate, setSelectedDate }) {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  return (
    <div className={styles.DateSelectionContainer}>
      <h2 className={styles.Title}>날짜 선택</h2>
      <div className={styles.DateButtonGroup}>
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`${styles.DateButton} ${
              selectedDate === date ? styles.selected : ""
            }`}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DateSelection;
