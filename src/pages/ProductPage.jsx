import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProductById,
  resetSelectedProduct,
} from "../features/products/productSlice";
import styles from "./ProductPage.module.css";
import { getImageUrl } from "../utils/imageUtils";
import { useWindowSize } from "../hooks/useWindowSize";
import { openCartPopup } from "../features/ui/uiSlice";
import { addToCart } from "../features/cart/cartSlice";
import useDocumentHead from "../hooks/useDocumentHead";

const ProductPage = () => {
  const [qty, setQty] = useState(1); // 2. State לניהול הכמות
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  // const { width } = useWindowSize();

  const {
    selectedProduct: product,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.products);

  const imageUrl = getImageUrl(product?.image);

  useDocumentHead({
    title: product ? product.name : "טוען מוצר...",
    description: product ? product.description.substring(0, 155) : "",
    ogTitle: product ? product.name : "",
    ogDescription: product ? product.description.substring(0, 155) : "",
    ogImage: imageUrl,
  });

  useEffect(() => {
    dispatch(fetchProductById(productId));

    // פונקציית ניקוי: תופעל כשהקומפוננטה יורדת מהמסך
    return () => {
      dispatch(resetSelectedProduct());
    };
  }, [productId, dispatch]);

  const addToCartHandler = () => {
    const existItem = cartItems.find((x) => x.product === product._id);
    const currentQtyInCart = existItem ? existItem.qty : 0;

    if (currentQtyInCart + qty > product.stock) {
      toast.error("לא ניתן להוסיף כמות זו, המלאי אינו מספיק");
      return;
    }

    dispatch(addToCart({ product, qty }));
    dispatch(openCartPopup());
  };

  if (isLoading || !product) {
    return <h2 className={styles.centerText}>טוען...</h2>;
  }

  if (isError) {
    return <h2 className={styles.centerText}>שגיאה: {message}</h2>;
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className={styles.page}>
      <Link
        to="/"
        className={styles.backLink}
      >
        חזרה לחנות
      </Link>
      <div className={styles.productContainer}>
        <div className={styles.imageContainer}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
          />
        </div>
        <div className={styles.detailsContainer}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productDescription}>{product.description}</p>
          <hr className={styles.divider} />
          <div className={styles.price}>מחיר: ₪{product.price}</div>
          <div className={styles.stock}>
            {!isOutOfStock && (
              <div className={styles.qty}>
                כמות:
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.stock).keys()].map((x) => (
                    <option
                      key={x + 1}
                      value={x + 1}
                    >
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={addToCartHandler} // 5. חיבור הפונקציה לכפתור
              className={`${styles.addToCartButton} ${isOutOfStock ? styles.disabledButton : ""}`}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "אזל מהמלאי" : "הוספה לסל"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
