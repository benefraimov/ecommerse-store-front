import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { removeItemFromCart, setCartItemQty } from "../features/cart/cartSlice";
import QuantitySelector from "../components/QuantitySelector";
import styles from "./CartPage.module.css";
import { getImageUrl } from "../utils/imageUtils";
import useDocumentHead from "../hooks/useDocumentHead";

const CartPage = () => {
  useDocumentHead('עגלת הקניות שלך | E-Shop');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // --- התיקון המרכזי כאן ---
  // נוודא ש-cartItems הוא תמיד מערך. אם הוא לא, נשתמש במערך ריק כברירת מחדל.
  const cartItems = Array.isArray(cart.cartItems) ? cart.cartItems : [];

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) {
      // אם הכמות יורדת ל-0, נסיר את הפריט
      dispatch(removeItemFromCart(item.product));
    } else {
      // אחרת, נקבע את הכמות החדשה
      dispatch(setCartItemQty({ productId: item.product, qty: newQty }));
    }
  };

  const checkoutHandler = () => {
    if (user) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  // עכשיו החישובים האלה בטוחים, כי cartItems הוא תמיד מערך
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <div className={styles.page}>
      <h1>עגלת קניות</h1>
      <div className={styles.cartLayout}>
        <div className={styles.cartItems}>
          {cartItems.length === 0 ? (
            <h2>
              העגלה שלך ריקה. <Link to="/">חזרה לחנות</Link>
            </h2>
          ) : (
            // עכשיו גם ה-map הזה בטוח
            cartItems.map((item) => (
              <div
                key={item.product || item._id}
                className={styles.cartItem}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <Link
                  to={`/product/${item.product || item._id}`}
                  className={styles.itemName}
                >
                  {item.name}
                </Link>
                <div className={styles.itemPrice}>₪{item.price.toFixed(2)}</div>

                <QuantitySelector
                  quantity={item.qty}
                  stock={item.stock}
                  onDecrease={() => handleQuantityChange(item, item.qty - 1)}
                  onIncrease={() => handleQuantityChange(item, item.qty + 1)}
                />

                <button
                  onClick={() => dispatch(removeItemFromCart(item.product))}
                  className={styles.removeButton}
                >
                  <Trash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.cartSummary}>
            <h2>סיכום הזמנה</h2>
            <p>
              סה"כ פריטים: <span>{totalItems}</span>
            </p>
            <p>
              מחיר כולל: <span>₪{totalPrice}</span>
            </p>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
            >
              המשך לתשלום
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
