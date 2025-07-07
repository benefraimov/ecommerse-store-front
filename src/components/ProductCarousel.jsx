import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopProducts } from "../features/products/productSlice";
import { getImageUrl } from "../utils/imageUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ProductCarousel.module.css";

const ProductCarousel = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { topProducts, isLoading, isError } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(fetchTopProducts());
  }, [dispatch]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? topProducts.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === topProducts.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // אפקט להחלפה אוטומטית של תמונות
  useEffect(() => {
    if (topProducts.length > 0) {
      const timer = setTimeout(goToNext, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, topProducts.length]);

  if (isLoading || topProducts.length === 0) {
    return <div className={styles.loader}>טוען מוצרים מובילים...</div>;
  }
  if (isError) return null;

  const currentProduct = topProducts[currentIndex];

  return (
    <div className={styles.slider}>
      <button
        onClick={goToPrevious}
        className={`${styles.arrow} ${styles.leftArrow}`}
      >
        <ChevronLeft size={40} />
      </button>
      <Link
        to={`/product/${currentProduct._id}`}
        className={styles.slide}
      >
        <img
          src={getImageUrl(currentProduct.image)}
          alt={currentProduct.name}
          className={styles.slideImage}
        />
        <div className={styles.slideCaption}>
          {`${currentProduct.name} (₪${currentProduct.price})`}
        </div>
      </Link>
      <button
        onClick={goToNext}
        className={`${styles.arrow} ${styles.rightArrow}`}
      >
        <ChevronRight size={40} />
      </button>
    </div>
  );
};

export default ProductCarousel;
