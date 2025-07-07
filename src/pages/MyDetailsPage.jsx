import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit"; // 1. נייבא את unwrapResult
import {
  updateUserProfile,
  deleteUserAccount,
  reset,
} from "../features/auth/authSlice";
import styles from "./admin/AdminPages.module.css";

const MyDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // useEffect זה נשאר, תפקידו רק למלא את הטופס
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  // 2. הפכנו את הפונקציה ל-async
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("הסיסמאות אינן תואמות");
      return;
    }

    try {
      const resultAction = await dispatch(
        updateUserProfile({ username, email, password }),
      );
      unwrapResult(resultAction); // יזרוק שגיאה במקרה של כישלון

      toast.success("הפרופיל עודכן בהצלחה!");
      dispatch(reset()); // נאפס את ה-state לאחר הצלחה
    } catch (error) {
      toast.error(error.message || "עדכון הפרופיל נכשל");
    }
  };

  const deleteHandler = async () => {
    if (window.confirm("האם את/ה בטוח/ה? פעולה זו הינה סופית!")) {
      try {
        const resultAction = await dispatch(deleteUserAccount());
        // console.log(resultAction)
        unwrapResult(resultAction);

        toast.success("החשבון נמחק בהצלחה");
        // ה-logout המובנה ב-Thunk כבר ינווט החוצה
      } catch (error) {
        // console.log(error)
        toast.error(error || error.message || "מחיקת החשבון נכשלה");
      }
    }
  };

  return (
    <div>
      <h2>הפרטים שלי</h2>
      <form
        onSubmit={submitHandler}
        className={styles.form}
      >
        <div className={styles.formGroup}>
          <label>שם משתמש</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>כתובת אימייל</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>סיסמה חדשה (השאר ריק כדי לא לשנות)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
          />
        </div>
        <div className={styles.formGroup}>
          <label>אשר סיסמה חדשה</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="******"
          />
        </div>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading}
        >
          {isLoading ? "מעדכן..." : "עדכן פרטים"}
        </button>
      </form>

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #ccc",
          paddingTop: "20px",
        }}
      >
        <h3>מחיקת חשבון</h3>
        <p>
          מחיקת החשבון הינה פעולה סופית. לא ניתן למחוק חשבון אם קיימות עבורו
          הזמנות שטרם נשלחו.
        </p>
        <button
          onClick={deleteHandler}
          style={{ backgroundColor: "#dc3545", color: "white" }}
          className={styles.primaryButton}
          disabled={isLoading}
        >
          {isLoading ? "מוחק..." : "מחק את החשבון שלי"}
        </button>
      </div>
    </div>
  );
};

export default MyDetailsPage;
