// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQXHujHyFTZZtgAdp8UQfYRohPR64Be0A",
  authDomain: "workout-generator3.firebaseapp.com",
  projectId: "workout-generator3",
  storageBucket: "workout-generator3.firebasestorage.app",
  messagingSenderId: "1070668117966",
  appId: "1:1070668117966:web:b09123e9fe0004253add9f",
  measurementId: "G-9K07KJJ8LW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firebase CRUD functions

// 1. Create data in Firebase
export async function createData(collectionName, data) {
  const ref = collection(db, collectionName);
  await addDoc(ref, data);
}

// 2. Read data from Firebase
export async function readData(collectionName) {
  const ref = collection(db, collectionName);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Return data with unique IDs
}

// 3. Update data in Firebase
export async function updateData(collectionName, id, data) {
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, data);
}

// 4. Delete data from Firebase
export async function deleteData(collectionName, id) {
  const ref = doc(db, collectionName, id);
  await deleteDoc(ref);
}
