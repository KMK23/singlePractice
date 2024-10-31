import React from "react";
import Button from "./../../components/Button/Button";
import SeatSelection from "./../SeatSelection/SeatSelection";
import MovieSelection from "../../components/movieSelction/MovieSelection";

const BookingPage = () => {
  const handleBooking = () => {
    alert("!!");
  };

  return (
    <div>
      <h1>영화 예매하기</h1>
      <Button onClick={handleBooking}>예매하기</Button>
    </div>
  );
};

export default BookingPage;
