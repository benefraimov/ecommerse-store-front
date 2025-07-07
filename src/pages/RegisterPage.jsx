import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// נייבא את קובץ ה-CSS שיצרנו
import styles from "./LoginRegisterPage.module.css";
import { LucideKeyRound, LucideUser, LucideMail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [registeringMessage, setRegisteringMessage] = useState(""); // State להודעת ההצלחה
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // נוסיף state לוקלי רק לצורך הצגת השגיאה בממשק
  const [uiError, setUiError] = useState("");

  const { username, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // מושך את המידע הרלוונטי לרכיב הזה מהחנות שלנו
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      // setUiError(message);
      toast.error(message);
    }

    if (isSuccess || user) {
      setRegisteringMessage(
        "נשלח מייל אימות לכתובת שהזנת. אנא בדוק את תיבת הדואר שלך (וגם את תיקיית הספאם).",
      );
    }

    // ברגע שהרכיב יורד מהמסך/מתחלף, אנחנו מאפסים את כל הסטייט
    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // נאפס את השגיאה המוצגת לפני שליחה חדשה
    setUiError("");
    const userData = { username, password, email };
    dispatch(register(userData)); // redux שולח את הפעולה ל
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {message ? (
          <div className={styles.successMessage}>{message}</div>
        ) : (
          <>
            <h1 className={styles.title}>יצירת חשבון חדש</h1>
            <form onSubmit={onSubmit}>
              <div className={styles.inputGroup}>
                <LucideUser className={styles.icon} />
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChange}
                  placeholder="שם משתמש"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <LucideMail className={styles.icon} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="כתובת אימייל"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <LucideKeyRound className={styles.icon} />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="סיסמה"
                  required
                  minLength="6"
                />
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "...נרשם" : "הרשמה"}
              </button>
            </form>
            {uiError && <p className={styles.errorMessage}>{uiError}</p>}
            <p className={styles.loginLink}>
              כבר יש לך חשבון? <Link to="/login">התחבר/י כאן</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
