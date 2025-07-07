import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils"; // נייבא את פונקציית העזר שלנו
import styles from "./PlaceOrderPage.module.css";
import useDocumentHead from "../hooks/useDocumentHead";

const PlaceOrderPage = () => {
  useDocumentHead("סיכום הזמנה | E-Shop");
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  // חישובים
  const itemsPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);
  const totalPrice = Number(itemsPrice).toFixed(2);

  const paymentHandler = () => {
    // הכפתור עכשיו רק מנווט לעמוד התשלום
    navigate("/payment");
  };

  return (
    <div className={styles.page}>
      <h1>סיכום הזמנה</h1>
      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.section}>
            <h2>כתובת למשלוח</h2>
            <p>
              {shippingAddress.address}, {shippingAddress.city},{" "}
              {shippingAddress.postalCode}
            </p>
          </div>
          <div className={styles.section}>
            <h2>פריטים בהזמנה</h2>
            {cartItems.map((item) => (
              <div
                key={item.product}
                className={styles.item}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                />
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <span>
                  {item.qty} x ₪{item.price.toFixed(2)} = ₪
                  {(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.summary}>
          <h2>סיכום לתשלום</h2>
          <p>
            <span>סה"כ פריטים:</span> <span>₪{itemsPrice}</span>
          </p>
          <p>
            <strong>
              <span>מחיר סופי:</span> <span>₪{totalPrice}</span>
            </strong>
          </p>
          <button
            onClick={paymentHandler}
            disabled={cartItems.length === 0}
          >
            המשך לתשלום
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
