import React, { useEffect, useState } from "react";
import { getDatas } from "../../firebase";

function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchReservations() {
      const data = await getDatas("reservations");
      setReservations(data);
    }
    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.title.includes(filter) ||
      reservation.selectedRegion.includes(filter)
  );

  return (
    <div>
      <h2>예매 내역 관리</h2>
      <input
        type="text"
        placeholder="영화 제목 또는 지역 검색"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>영화 제목</th>
            <th>사용자</th>
            <th>예매 좌석</th>
            <th>지역</th>
            <th>날짜</th>
            <th>상영 시간</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((res) => (
            <tr key={res.docId}>
              <td>{res.title}</td>
              <td>{res.email}</td>
              <td>{res.selectedSeats.join(", ")}</td>
              <td>{res.selectedRegion}</td>
              <td>{res.selectedDate}</td>
              <td>{res.selectedTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationList;
