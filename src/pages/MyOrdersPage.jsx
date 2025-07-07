import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listMyOrders } from "../features/order/orderSlice";
import { Check, X } from "lucide-react";
import adminStyles from "./admin/AdminPages.module.css"; // שימוש חוזר בעיצוב הטבלה

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const { myOrders, isLoading, isError, message } = useSelector(
    (state) => state.order,
  );

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);

  return (
    <div>
      <h2>ההזמנות שלי</h2>
      {isLoading ? (
        <h2>טוען הזמנות...</h2>
      ) : isError ? (
        <h3 style={{ color: "red" }}>{message}</h3>
      ) : (
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>ID הזמנה</th>
                <th>תאריך</th>
                <th>סכום כולל</th>
                <th>שולם</th>
                <th>נשלח</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("he-IL")}
                  </td>
                  <td>₪{order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? <Check color="green" /> : <X color="red" />}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <Check color="green" />
                    ) : (
                      <X color="red" />
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>פרטים</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
