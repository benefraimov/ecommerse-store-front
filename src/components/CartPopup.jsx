import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import styles from "./CartPopup.module.css";
import { closeCartPopup } from "../features/ui/uiSlice";

const CartPopup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  const handleViewCart = () => {
    dispatch(closeCartPopup());
    navigate("/cart");
  };

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <CheckCircle
          color="green"
          size={24}
        />
        <h3>המוצר נוסף לעגלה בהצלחה!</h3>
      </div>
      <div className={styles.summary}>
        <p>יש כעת {totalItems} פריטים בעגלה.</p>
        <p>
          <strong>סה"כ לתשלום: ₪{totalPrice}</strong>
        </p>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.secondaryButton}
          onClick={() => dispatch(closeCartPopup())}
        >
          המשך בקניות
        </button>
        <button
          className={styles.primaryButton}
          onClick={handleViewCart}
        >
          צפה בעגלה ועבור לתשלום
        </button>
      </div>
    </div>
  );
};
export default CartPopup;
