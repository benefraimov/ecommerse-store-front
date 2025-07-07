import { Link } from "react-router-dom";
import styles from "./Paginate.module.css";

const Paginate = ({ pages, page, isAdmin = false }) => {
  if (pages <= 1) {
    return null; // אם יש רק עמוד אחד או פחות, אין צורך להציג דפדוף
  }

  return (
    <div className={styles.pagination}>
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={!isAdmin ? `/page/${x + 1}` : `/admin/productlist/${x + 1}`}
          className={x + 1 === page ? styles.active : ""}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
};

export default Paginate;
