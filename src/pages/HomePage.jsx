import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductItem from "../components/ProductItem";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import useDocumentHead from "../hooks/useDocumentHead";
import styles from "./HomePage.module.css";

const HomePage = () => {
  useDocumentHead("ברוכים הבאים ל-E-Shop | קניות ברשת");

  const { pageNumber } = useParams() || 1;
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.products);
  // --- התיקון כאן ---
  const products = Array.isArray(productState.products)
    ? productState.products
    : [];
  const { page, pages, isLoading, isError, message } = productState;

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
