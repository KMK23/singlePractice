import React, { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage } from "../../firebase";
import styles from "./ChatRoom.module.scss";

function ChatRoom({ chatRoomId, currentUserEmail }) {
  const [messagesData, setMessagesData] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatRoomId) {
      const unsubscribe = getMessages(chatRoomId, setMessagesData); // 실시간 메시지 구독
      return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    }
  }, [chatRoomId]);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messagesData]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUserEmail) {
      await sendMessage(chatRoomId, currentUserEmail, newMessage, false);
      setNewMessage(""); // 입력 초기화
    }
  };

  // 엔터키를 누르면 메시지 보내기
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 방지
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox} ref={chatBoxRef}>
        {messagesData.map((item) => {
          // 관리자가 보낸 메시지인 경우 사용자에게만 표시
          if (item.isAdminMessage && item.sender === currentUserEmail) {
            return null; // 관리자의 메시지는 사용자에게는 표시하지 않음
          }

          return (
            <div
              key={item.id}
              className={
                item.sender === currentUserEmail
                  ? styles.userMessage
                  : styles.adminMessage
              }
            >
              <p>{item.message}</p>
              <small>{item.timestamp?.toDate().toLocaleString()}</small>
            </div>
          );
        })}
      </div>
      <div className={styles.inputContainer}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className={styles.textarea}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          보내기
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
