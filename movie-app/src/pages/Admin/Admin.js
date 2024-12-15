import React, { useState, useEffect } from "react";
import { getDatas, sendMessage, updateChatRoom } from "../../firebase";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import styles from "./Admin.module.scss"; // CSS 파일을 import합니다.
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMovies,
  selectMovies,
  selectLoading,
} from "../../store/movieSlice/MovieSlice";

function Admin() {
  const currentUserEmail = "admin@naver.com"; // 관리자 계정 이메일 고정

  const movieList = useSelector(selectMovies);
  const dispatch = useDispatch();

  // 시간대 목록
  const times = ["10:00", "12:30", "15:00", "17:30", "20:00"];

  const [chatRooms, setChatRooms] = useState([]); // 모든 채팅방 목록
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(""); // 선택된 채팅방 ID
  const [isChatStarted, setIsChatStarted] = useState(false); // 채팅 시작 여부
  const [userReservations, setUserReservations] = useState([]); // 예매된 영화 목록
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 관리
  const [selectedMovieTitle, setSelectedMovieTitle] = useState(""); // 선택된 영화 제목
  const [selectedRegion, setSelectedRegion] = useState(""); // 선택된 장소
  const [selectedTheater, setSelectedTheater] = useState(""); // 선택된 영화관
  const [selectedDate, setSelectedDate] = useState(""); // 선택된 날짜
  const [selectedTime, setSelectedTime] = useState(""); // 선택된 시간

  useEffect(() => {
    dispatch(fetchMovies()); // 영화 데이터를 가져옵니다.

    // 채팅방 목록 가져오기
    const fetchChatRooms = async () => {
      try {
        const rooms = await getDatas("chats", {}); // 데이터 가져오기
        setChatRooms(rooms);
      } catch (error) {
        console.error("채팅방 목록을 가져오는 데 실패했습니다:", error);
      }
    };

    // 예매된 영화 목록 가져오기
    const fetchReservations = async () => {
      try {
        const reservations = await getDatas("reservations", {}); // 예매된 영화 데이터 가져오기
        setUserReservations(reservations);
        console.log(reservations);
      } catch (error) {
        console.error("예매 정보를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchChatRooms();
    fetchReservations();
  }, [dispatch]);

  const handleStartChat = async () => {
    if (selectedChatRoomId) {
      // 채팅방 상태 변경: isChatStarted = true
      await updateChatRoom(selectedChatRoomId, { isChatStarted: true });
      setIsChatStarted(true);

      // 관리자가 채팅을 시작했다는 메시지를 사용자에게 보냄
      await sendMessage(
        selectedChatRoomId,
        currentUserEmail,
        "관리자가 채팅을 시작했습니다.",
        true
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false); // 로그아웃 상태로 업데이트하여 즉시 반영
  };

  // 예매 정보를 필터링하여 표시
  const filteredReservations = userReservations
    .filter((reservation) => {
      return (
        (selectedMovieTitle
          ? reservation.title === selectedMovieTitle
          : true) &&
        (selectedRegion
          ? reservation.selectedRegion === selectedRegion
          : true) &&
        (selectedTheater
          ? reservation.selectedTheater === selectedTheater
          : true) &&
        (selectedDate ? reservation.selectedDate === selectedDate : true) &&
        (selectedTime ? reservation.selectedTime === selectedTime : true)
      );
    })
    .filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) => t.email === value.email && t.title === value.title
        )
    );

  const getNextFiveDays = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 6; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      dates.push(nextDay.toISOString().split("T")[0]); // 날짜 형식 (YYYY-MM-DD)
    }
    return dates;
  };

  return (
    <div className={styles.adminContainer}>
      <h1>관리자 페이지</h1>

      {/* 필터링 섹션 */}
      <div className={styles.filterSection}>
        <h2>필터</h2>

        <div>
          <label>영화:</label>
          <select
            value={selectedMovieTitle}
            onChange={(e) => setSelectedMovieTitle(e.target.value)}
          >
            <option value="">모든 영화</option>
            {movieList.map((movie) => (
              <option key={movie.id} value={movie.title}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>장소:</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">모든 장소</option>
            {/* 예약된 장소 목록을 자동으로 표시 */}
            {Array.from(
              new Set(userReservations.map((r) => r.selectedRegion))
            ).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>영화관:</label>
          <select
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
          >
            <option value="">모든 영화관</option>
            {/* 예약된 영화관 목록을 자동으로 표시 */}
            {Array.from(
              new Set(userReservations.map((r) => r.selectedTheater))
            ).map((theater) => (
              <option key={theater} value={theater}>
                {theater}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>날짜:</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">날짜 선택</option>
            {getNextFiveDays().map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>시간:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">시간 선택</option>
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 예매된 영화 목록 표시 */}
      <div className={styles.reservationsContainer}>
        <h2>예매된 영화 목록</h2>
        <div className={styles.reservationList}>
          {filteredReservations.length === 0 ? (
            <p>선택된 조건에 맞는 예매가 없습니다.</p>
          ) : (
            filteredReservations.map((reservation) => (
              <div key={reservation.docId} className={styles.reservationItem}>
                <strong>영화명:</strong> {reservation.title} <br />
                <strong>장소:</strong> {reservation.selectedRegion} <br />
                <strong>영화관:</strong> {reservation.selectedTheater} <br />
                <strong>예매일:</strong>{" "}
                {new Date(reservation.selectedDate).toLocaleDateString()} <br />
                <strong>상영시간:</strong> {reservation.selectedTime} <br />
                <strong>예매좌석:</strong>{" "}
                {reservation.selectedSeats.join(", ")} <br />
                <strong>이메일:</strong> {reservation.email} <br />
                <strong>전화번호:</strong> {reservation.phone} <br />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div>
        <h2>채팅방 목록</h2>
        <ul className={styles.chatList}>
          {chatRooms.map((room) => (
            <li key={room.docId} className={styles.chatRoomItem}>
              <button
                className={styles.chatRoomButton}
                onClick={() => setSelectedChatRoomId(room.docId)}
              >
                {room.createdBy}의 채팅방
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedChatRoomId && !isChatStarted && (
        <div>
          <button className={styles.startChatButton} onClick={handleStartChat}>
            채팅 시작
          </button>
        </div>
      )}

      {selectedChatRoomId && isChatStarted && (
        <div>
          <ChatRoom
            chatRoomId={selectedChatRoomId}
            currentUserEmail={currentUserEmail}
          />
        </div>
      )}

      {/* 로그아웃 버튼 */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default Admin;
