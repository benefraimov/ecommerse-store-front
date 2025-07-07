import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../features/cart/cartSlice"; // 1. הסרנו את ההערה מהייבוא
import styles from "./LoginRegisterPage.module.css"; // שימוש חוזר בעיצוב

const ShippingPage = () => {
  // 2. שולפים את הנתונים הרלוונטיים מה-store
  const { user } = useSelector((state) => state.auth);
  const { shippingAddress: cartShippingAddress } = useSelector(
    (state) => state.cart,
  );

  // 3. מאתחלים את ה-state הלוקלי של הטופס
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 4. useEffect למילוי אוטומטי חכם
  useEffect(() => {
    // נשתמש בכתובת השמורה של המשתמש אם קיימת, אחרת בכתובת מהעגלה
    const finalAddress = user?.shippingAddress || cartShippingAddress;
    if (finalAddress) {
      setAddress(finalAddress.address || "");
      setCity(finalAddress.city || "");
      setPostalCode(finalAddress.postalCode || "");
    }
  }, [user, cartShippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    // 5. הסרנו את ההערה מה-dispatch
    dispatch(saveShippingAddress({ address, city, postalCode }));
    navigate("/placeorder"); // מעבר לסיכום ההזמנה
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>כתובת למשלוח</h1>
        <form onSubmit={submitHandler}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="כתובת מלאה"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="עיר"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="מיקוד"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
          >
            המשך
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
