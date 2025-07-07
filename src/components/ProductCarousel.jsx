import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopProducts } from "../features/products/productSlice";
import { getImageUrl } from "../utils/imageUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ProductCarousel.module.css";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    topProducts: rawTopProducts,
    isLoading,
    isError,
  } = useSelector((state) => state.products);
  // --- התיקון כאן ---
  const topProducts = Array.isArray(rawTopProducts) ? rawTopProducts : [];

  useEffect(() => {
    // נביא את המוצרים רק אם הרשימה ריקה
    if (topProducts.length === 0) {
      dispatch(fetchTopProducts());
    }
  }, [dispatch, topProducts.length]);

  const goToNext = () => {
    const isLastSlide = currentIndex === topProducts.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (topProducts.length > 0) {
      const timer = setTimeout(goToNext, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, topProducts.length]);

  if (isLoading && topProducts.length === 0)
    return <div className={styles.loader}>טוען...</div>;
  if (isError || topProducts.length === 0) return null;

  const currentProduct = topProducts[currentIndex];

  return (
    <div
      className={styles.slider}
      onClick={() => navigate(`/product/${currentProduct._id}`)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
        className={`${styles.arrow} ${styles.leftArrow}`}
      >
        <ChevronLeft size={40} />
      </button>
      <div className={styles.slide}>
        <img
          src={getImageUrl(currentProduct.image)}
          alt={currentProduct.name}
          className={styles.slideImage}
        />
        <div className={styles.slideCaption}>
          {`${currentProduct.name} (₪${currentProduct.price})`}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className={`${styles.arrow} ${styles.rightArrow}`}
      >
        <ChevronRight size={40} />
      </button>
    </div>
  );
};

export default ProductCarousel;
