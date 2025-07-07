import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductItem from "../components/ProductItem";
import Paginate from "../components/Paginate";
import styles from "./HomePage.module.css";
import ProductCarousel from "../components/ProductCarousel";
import useDocumentHead from "../hooks/useDocumentHead";

const HomePage = () => {
  useDocumentHead("ברוכים הבאים ל-E-Shop | קניות ברשת");
  const { pageNumber } = useParams() || 1;
  const dispatch = useDispatch();

  const { products, page, pages, isLoading, isError, message } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(fetchProducts(pageNumber));
  }, [dispatch, pageNumber]);

  const renderContent = () => {
    if (isLoading && products.length === 0) {
      return <h2>טוען מוצרים...</h2>;
    }

    if (isError) {
      return <h2>שגיאה: {message}</h2>;
    }

    if (!isLoading && products.length === 0) {
      return <h2>לא נמצאו מוצרים.</h2>;
    }

    // החזרנו את התצוגה הרגילה, ללא תלות ב-isLoading וללא שינוי opacity
    return (
      <>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
            />
          ))}
        </div>
        <Paginate
          pages={pages}
          page={page}
        />
      </>
    );
  };

  return (
    <div className={styles.page}>
      <ProductCarousel />
      <h1>מוצרים אחרונים</h1>
      {renderContent()}
    </div>
  );
};

export default HomePage;
