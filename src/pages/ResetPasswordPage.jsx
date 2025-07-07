import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./admin/AdminPages.module.css";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("הסיסמאות אינן תואמות");
    }
    setIsLoading(true);
    try {
      const { data } = await axios.put(`/api/users/resetpassword/${token}`, {
        password,
      });
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "אירעה שגיאה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2>קביעת סיסמה חדשה</h2>
      <form
        onSubmit={submitHandler}
        className={styles.form}
      >
        <div className={styles.formGroup}>
          <label>סיסמה חדשה</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>אשר סיסמה חדשה</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading}
        >
          {isLoading ? "מאפס סיסמה..." : "קבע סיסמה חדשה"}
        </button>
      </form>
    </div>
  );
};
export default ResetPasswordPage;
