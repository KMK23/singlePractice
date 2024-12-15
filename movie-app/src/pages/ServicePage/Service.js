import React, { useState, useEffect } from "react";
import { getFaqs, getTerms, getNotices, createChatRoom } from "../../firebase";
import styles from "./Service.module.scss";
import ChatRoom from "../../components/ChatRoom/ChatRoom";

function Service() {
  const [faqData, setFaqData] = useState([]);
  const [filteredFaqData, setFilteredFaqData] = useState([]);
  const [termsData, setTermsData] = useState([]);
  const [noticesData, setNoticesData] = useState([]);
  const [filteredNoticesData, setFilteredNoticesData] = useState([]);
  const [currentSection, setCurrentSection] = useState("faq");
  const [chatRoomId, setChatRoomId] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isChatRoomCreated, setIsChatRoomCreated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setCurrentUserEmail(user.email);
      const userChatRoomId = user.email.replace(/[@.]/g, "-");
      setChatRoomId(userChatRoomId);
    }

    async function fetchData() {
      const faqs = await getFaqs();
      const notices = await getNotices();
      const termsArr = await getTerms(); // 이용약관 데이터 불러오기
      const terms = termsArr[0].terms;
      console.log(terms);
      console.log(terms);
      setFaqData(faqs);
      setFilteredFaqData(faqs);
      setNoticesData(
        notices.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setFilteredNoticesData(notices);
      setTermsData(terms); // 이용약관 데이터 설정
    }

    fetchData();
  }, []);

  const handleCreateChatRoom = async () => {
    if (currentUserEmail) {
      const newChatRoomId = await createChatRoom(currentUserEmail);
      setChatRoomId(newChatRoomId);
      setIsChatRoomCreated(true);
      setCurrentSection("messages");
    }
  };

  const handleFaqSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = faqData.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term)
    );
    setFilteredFaqData(filtered);
  };

  const handleNoticeSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = noticesData.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term)
    );
    setFilteredNoticesData(filtered);
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case "faq":
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>자주 묻는 질문(FAQ)</h2>
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={handleFaqSearch}
              className={styles.searchInput}
            />
            <ul className={styles.faqList}>
              {filteredFaqData.map((item, index) => (
                <li key={index} className={styles.faqItem}>
                  <details>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        );
      case "terms":
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>서비스 이용약관</h2>
            {termsData.length > 0 ? (
              termsData.map((term, index) => (
                <div key={index} className={styles.termsContent}>
                  <h3>{term.title}</h3>
                  <p>{term.content}</p>
                </div>
              ))
            ) : (
              <p>이용약관 데이터를 불러오는 중입니다...</p>
            )}
          </div>
        );
      case "notices":
        return (
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>공지사항</h2>
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={handleNoticeSearch}
              className={styles.searchInput}
            />
            <ul className={styles.noticeList}>
              {filteredNoticesData.map((item, index) => (
                <li key={index} className={styles.noticeItem}>
                  <details>
                    <summary>{item.title}</summary>
                    <p>{item.content}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        );
      case "messages":
        return (
          <>
            {!isChatRoomCreated ? (
              <button
                onClick={handleCreateChatRoom}
                className={styles.createChatRoomButton}
              >
                새 채팅방 생성
              </button>
            ) : (
              <ChatRoom
                chatRoomId={chatRoomId}
                currentUserEmail={currentUserEmail}
              />
            )}
          </>
        );
      default:
        return <div>섹션을 선택해주세요.</div>;
    }
  };

  return (
    <div className={styles.serviceContainer}>
      <h1 className={styles.pageTitle}>고객센터</h1>
      <nav className={styles.navMenu}>
        <button
          onClick={() => setCurrentSection("faq")}
          className={styles.navButton}
        >
          FAQ
        </button>
        <button
          onClick={() => setCurrentSection("terms")}
          className={styles.navButton}
        >
          이용약관
        </button>
        <button
          onClick={() => setCurrentSection("notices")}
          className={styles.navButton}
        >
          공지사항
        </button>
        <button
          onClick={() => setCurrentSection("messages")}
          className={styles.navButton}
        >
          실시간 채팅
        </button>
      </nav>
      {renderSectionContent()}
    </div>
  );
}

export default Service;
