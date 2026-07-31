// Firebase configuration for real-time alerts
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB_YjGFJaR-J6Q5A2sYbN7wL9Hkd7GKKV0",
  authDomain: "predictive-maintenance-8c9b1.firebaseapp.com",
  projectId: "predictive-maintenance-8c9b1",
  storageBucket: "predictive-maintenance-8c9b1.firebasestorage.app",
  messagingSenderId: "275892451261",
  appId: "1:275892451261:web:e01d4d8799afd1042704d4",
  databaseURL:
    "https://predictive-maintenance-8c9b1-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, query, orderByChild, equalTo };
export default app;
