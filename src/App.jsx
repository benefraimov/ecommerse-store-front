// Hooks
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// Tostify Library
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// slices
import { closeCartPopup } from "./features/ui/uiSlice";
import { fetchCart } from "./features/cart/cartSlice";

// components
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import CartPopup from "./components/CartPopup";

// pages
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ShippingPage from "./pages/ShippingPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyDetailsPage from "./pages/MyDetailsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AccessibilityPage from "./pages/AccessibilityPage";
import VerificationSuccessPage from "./pages/VerificationSuccessPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";

const App = () => {
  const dispatch = useDispatch();
  const { isCartPopupOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  return (
    <div className="app-container">
      {/* 3. הוספת ה-Container. הוא יהיה בלתי נראה עד שנקרא לו */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
      />
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/page/:pageNumber"
            element={<HomePage />}
          />
          <Route
            path="/cart"
            element={<CartPage />}
          />
          <Route
            path="/product/:id"
            element={<ProductPage />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicyPage />}
          />
          <Route
            path="/terms-of-service"
            element={<TermsOfServicePage />}
          />
          <Route
            path="/accessibility-statement"
            element={<AccessibilityPage />}
          />
          <Route
            path="/verification-success"
            element={<VerificationSuccessPage />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={<PrivateRoute />}
          >
            {/* Checkouts Routes */}
            <Route
              path="/shipping"
              element={<ShippingPage />}
            />
            <Route
              path="/payment"
              element={<PaymentPage />}
            />
            <Route
              path="/placeorder"
              element={<PlaceOrderPage />}
            />
            <Route
              path="/order/:id"
              element={<OrderPage />}
            />

            {/* Profile Wrapper Route */}
            <Route
              path="/profile"
              element={<ProfilePage />}
            >
              {/* Sub Profile Routes - index=true get's display */}
              <Route
                index
                element={<MyDetailsPage />}
              />
              <Route
                path="my-orders"
                element={<MyOrdersPage />}
              />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
      <Modal
        isOpen={isCartPopupOpen}
        onClose={() => dispatch(closeCartPopup())}
      >
        <CartPopup />
      </Modal>
    </div>
  );
};

export default App;
