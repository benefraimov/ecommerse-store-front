import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { savePaymentMethod } from "../features/cart/cartSlice";
import { createOrder, resetOrder } from "../features/order/orderSlice";
import styles from "./admin/AdminPages.module.css"; // שימוש חוזר בעיצוב
import useDocumentHead from "../hooks/useDocumentHead";

const PaymentPage = () => {
  useDocumentHead("תשלום | E-Shop");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;
  const { order, isSuccess, isError, message } = useSelector(
    (state) => state.order,
  );

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
    if (isSuccess && order?._id) {
      toast.success("ההזמנה בוצעה בהצלחה!");
      navigate(`/order/${order._id}`);
      dispatch(resetOrder());
    }
    if (isError) {
      toast.error(message);
      dispatch(resetOrder());
    }
  }, [shippingAddress, navigate, isSuccess, isError, message, order, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));

    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    );
    const totalPrice = Number(itemsPrice);

    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
      }),
    );
  };

  return (
    <div className={styles.page}>
      <h2>שיטת תשלום</h2>
      <form
        onSubmit={submitHandler}
        className={styles.form}
      >
        <div className={styles.formGroup}>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="Credit Card"
                name="paymentMethod"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              כרטיס אשראי (מדומה)
            </label>
          </div>
        </div>
        <button
          type="submit"
          className={styles.primaryButton}
        >
          שלם ואשר הזמנה
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
