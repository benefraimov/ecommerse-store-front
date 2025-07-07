import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./admin/AdminPages.module.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/users/forgotpassword", { email });
      setMessage(data.message);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "אירעה שגיאה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2>איפוס סיסמה</h2>
      <p>הזן את כתובת המייל שלך ונשלח אליך קישור לאיפוס הסיסמה.</p>
      <form
        onSubmit={submitHandler}
        className={styles.form}
      >
        <div className={styles.formGroup}>
          <label>אימייל</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isLoading}
        >
          {isLoading ? "שולח..." : "שלח קישור לאיפוס"}
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "20px", color: "green" }}>{message}</p>
      )}
    </div>
  );
};
export default ForgotPasswordPage;
