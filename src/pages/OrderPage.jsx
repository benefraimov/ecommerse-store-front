import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getOrderDetails,
  markAsReceived,
  payOrder,
  resetOrder,
} from "../features/order/orderSlice"; // נוסיף resetOrder
import { getImageUrl } from "../utils/imageUtils";
import styles from "./OrderPage.module.css"; // ניצור קובץ עיצוב חדש

const OrderPage = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const { order, isLoading, isError, message } = useSelector(
    (state) => state.order,
  );
  const { isSuccess } = useSelector((state) => state.order);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetOrder());
    }

    // טען מחדש את פרטי ההזמנה אם אין הזמנה, אם ה-ID השתנה, או אם פעולה הצליחה
    if (!order || order._id !== orderId || isSuccess) {
      dispatch(resetOrder());
      dispatch(getOrderDetails(orderId));
    }
  }, [orderId, dispatch, isSuccess, isError, message]);

  const paymentHandler = () => {
    // כאן אנחנו מדמים תשלום מוצלח
    const paymentResult = {
      id: `SIM-${Date.now()}`,
      status: "COMPLETED",
      update_time: new Date().toISOString(),
      email_address: "test@example.com",
    };
    dispatch(payOrder({ orderId, paymentResult }));
    toast.success("התשלום בוצע בהצלחה!");
  };

  const receiveHandler = () => {
    if (window.confirm("האם לאשר קבלת ההזמנה?")) {
      dispatch(markAsReceived(orderId));
      toast.success("נהדר! שמחים שההזמנה הגיעה.");
    }
  };

  if (isLoading && !order)
    return <h2 className={styles.centerText}>טוען פרטי הזמנה...</h2>;
  if (isError && !order)
    return (
      <h3
        className={styles.centerText}
        style={{ color: "red" }}
      >
        {message}
      </h3>
    );
  if (!order) return null; // אם אין הזמנה, אל תציג כלום

  return (
    <div className={styles.page}>
      <h1>הזמנה מספר: {order._id}</h1>
      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.section}>
            <h2>פרטי משלוח</h2>
            <p>
              <strong>שם:</strong> {order.user.username}
            </p>
            <p>
              <strong>אימייל:</strong>{" "}
              <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p>
              <strong>כתובת:</strong> {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <div
              className={
                order.isDelivered ? styles.alertSuccess : styles.alertDanger
              }
            >
              {order.isDelivered
                ? `ההזמנה נמסרה ב-${new Date(order.deliveredAt).toLocaleDateString("he-IL")}`
                : "טרם נמסר"}
            </div>
          </div>
          <div className={styles.section}>
            <h2>פריטים בהזמנה</h2>
            {order.orderItems.map((item, index) => (
              <div
                key={index}
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
          <h2>סיכום הזמנה</h2>
          <p>
            <span>מחיר פריטים:</span>{" "}
            <span>₪{order.totalPrice.toFixed(2)}</span>
          </p>
          <p>
            <strong>
              <span>סה"כ לתשלום:</span>{" "}
              <span>₪{order.totalPrice.toFixed(2)}</span>
            </strong>
          </p>
          <div
            className={order.isPaid ? styles.alertSuccess : styles.alertDanger}
          >
            {order.isPaid
              ? `שולם בתאריך ${new Date(order.paidAt).toLocaleDateString("he-IL")}`
              : "טרם שולם"}
          </div>

          {isLoading && <p>מעדכן...</p>}
          {/* כפתור התשלום המדומה */}
          {!order.isPaid && (
            <button
              onClick={paymentHandler}
              className={styles.payButton}
            >
              שלם עכשיו ₪{order.totalPrice.toFixed(2)}
            </button>
          )}
          {order.isPaid && !order.isDelivered && (
            <button
              onClick={receiveHandler}
              className={styles.receiveButton}
            >
              אישור קבלה - קיבלתי את ההזמנה
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
