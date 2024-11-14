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
    return docRef.id;
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
export { auth, db, analytics, getDatas, addDatas, updateDatas, deleteDatas };
