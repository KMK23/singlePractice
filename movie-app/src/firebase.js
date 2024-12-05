import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDTQVLijdvhh_eSHnpGG2uryPF6idt1fk4",
  authDomain: "movieapp-8ac95.firebaseapp.com",
  projectId: "movieapp-8ac95",
  storageBucket: "movieapp-8ac95.firebasestorage.app",
  messagingSenderId: "1083364395725",
  appId: "1:1083364395725:web:cf402da4f795fea8f47784",
  measurementId: "G-HFF2RVD6K0",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

function getCollection(collectionName) {
  return collection(db, collectionName);
}
async function getQuery(collectionName, queryOptions) {
  const { conditions = [], orderBys = [], limits } = queryOptions;
  const collect = getCollection(collectionName);
  let q = query(collect);

  //where 조건
  conditions.forEach((condition) => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });

  //orderBy 조건
  orderBys.forEach((order) => {
    q = query(q, orderBy(order.field, order.direction || "asc"));
  });

  //limit 조건
  q = query(q, limit(limits));
  return q;
}

async function getDatas(collectionName, queryOptions) {
  const q = await getQuery(collectionName, queryOptions);
  const snapshot = await getDocs(q);
  const resultData = snapshot.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }));
  return resultData;
}

async function addDatas(collectionName, dataObj) {
  try {
    const docRef = await addDoc(getCollection(collectionName), dataObj);
    return docRef;
  } catch (error) {
    console.error("Error adding document : ", error);
    throw new Error(error.message);
  }
}

async function updateDatas(collectionName, docId, updateObj) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateObj);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("문서가 존재하지 않습니다.");
    }
    const resultData = { ...snapshot.data(), docId: snapshot.id };
    return resultData;
  } catch (error) {
    console.log("Error Update", error);
    throw error;
  }
}

async function deleteDatas(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.log("Error deleting document:", error);
    return false; // 삭제 실패 시 false 반환
  }
}

async function addPaymentHistory(
  collectionName,
  docId,
  paymentInfo,
  reservationData
) {
  try {
    // Firestore에서 해당 문서를 참조
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);

    // 문서가 존재할 경우
    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      // 기존 결제 내역이 있으면 배열로 가져오고, 없으면 빈 배열로 초기화
      const paymentHistory = docData.paymentHistory || [];

      // 새로운 결제 정보를 배열에 추가
      paymentHistory.push(paymentInfo);

      // 결제 내역과 예약 정보 업데이트
      await updateDoc(docRef, {
        paymentHistory: paymentHistory, // 결제 내역 업데이트
      });
      console.log("결제 내역과 예약 정보가 성공적으로 추가되었습니다.");
    } else {
      console.error("문서가 존재하지 않습니다");
    }
  } catch (error) {
    console.error("결제 내역 추가 중 오류 발생: ", error);
  }
}

export {
  auth,
  db,
  analytics,
  getDatas,
  addDatas,
  updateDatas,
  deleteDatas,
  addPaymentHistory,
};
