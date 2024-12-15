import React, { useEffect, useState } from "react";
import { getDatas, updateDatas } from "../../firebase";

function InquiryManagement() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    async function fetchInquiries() {
      const data = await getDatas("inquiries");
      setInquiries(data);
    }
    fetchInquiries();
  }, []);

  const handleAnswerSubmit = async (id, answer) => {
    await updateDatas("inquiries", id, { answer, status: "completed" });
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.docId === id ? { ...inq, answer, status: "completed" } : inq
      )
    );
  };

  return (
    <div>
      <h2>1:1 문의 관리</h2>
      <ul>
        {inquiries.map((inq) => (
          <li key={inq.docId}>
            <p>문의 내용: {inq.message}</p>
            <p>상태: {inq.status}</p>
            {inq.status === "pending" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAnswerSubmit(inq.docId, e.target.answer.value);
                }}
              >
                <textarea name="answer" placeholder="답변 입력" />
                <button type="submit">답변하기</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InquiryManagement;
