// client/src/components/ProductItem.jsx
import { Link } from "react-router-dom";
import styles from "./ProductItem.module.css";
import { getImageUrl } from "../utils/imageUtils";

const ProductItem = ({ product }) => {
  return (
    <div className={styles.card}>
      <Link to={`/product/${product._id}`}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className={styles.productImage}
        />
      </Link>
      <div className={styles.cardBody}>
        <Link to={`/product/${product._id}`}>
          <h2 className={styles.productName}>{product.name}</h2>
        </Link>
        <h3 className={styles.productPrice}>₪{product.price}</h3>
      </div>
    </div>
  );
};

export default ProductItem;
