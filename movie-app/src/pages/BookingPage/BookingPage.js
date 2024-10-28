import React from "react";
import Button from "./../../components/Button/Button";
import SeatSelection from "./../SeatSelection/SeatSelection";

const BookingPage = () => {
  const handleBooking = () => {
    // 예매 처리 로직 추가
    alert("예매가 완료되었습니다!");
  };

  return (
    <div>
      <h1>영화 예매하기</h1>
      <SeatSelection />
      <Button onClick={handleBooking}>예매하기</Button>
    </div>
  );
};

export default BookingPage;
