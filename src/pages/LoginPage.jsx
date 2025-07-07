import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { LucideKeyRound, LucideMail } from "lucide-react";
import styles from "./LoginRegisterPage.module.css";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [uiError, setUiError] = useState("");
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      // setUiError(message);
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setUiError("");
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className={styles.conatiner}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>התחברות לחשבון</h1>
        <form onSubmit={onSubmit}>
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
              placeholder="סיסמא"
              required
            />
          </div>
          <button className={styles.submitButton}>
            {isLoading ? "...מתחבר" : "התחברות"}
          </button>
        </form>
        {uiError && <p className={styles.errorMessage}>{uiError}</p>}
        <p className={styles.loginLink}>
          אין לך חשבון? <Link to="/register">הירשם/י כאן</Link>
        </p>
        <p className={styles.loginLink}>
          <Link to="/forgot-password">שכחת סיסמה?</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
