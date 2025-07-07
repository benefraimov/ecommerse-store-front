import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import styles from "./Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) =>
    Array.isArray(state.cart.cartItems) ? state.cart.cartItems : [],
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const closeAllMenus = () => {
    setIsMenuOpen(false);
  };

  const onLogout = () => {
    dispatch(logout());
    closeAllMenus();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">E-Shop</Link>
      </div>

      <nav className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
        <ul>
          {/* === תפריט למשתמש מחובר === */}
          {user ? (
            <>
              {/* קישור לפרופיל - עם טקסט שונה למובייל/דסקטופ */}
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ""
                  }
                  onClick={closeAllMenus}
                >
                  <User />
                  <span className={styles.desktopOnly}>{user.username}</span>
                  <span className={styles.mobileOnly}>הפרופיל שלי</span>
                </NavLink>
              </li>

              {/* כפתור התנתקות */}
              <li>
                <button
                  className={styles.navButton}
                  onClick={onLogout}
                  style={{ padding: 0 }}
                >
                  <LogOut />
                  <span>התנתקות</span>
                </button>
              </li>
            </>
          ) : (
            // === תפריט לאורח ===
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ""
                  }
                  onClick={closeAllMenus}
                >
                  <LogIn />
                  <span>התחברות</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ""
                  }
                  onClick={closeAllMenus}
                >
                  <UserPlus />
                  <span>הרשמה</span>
                </NavLink>
              </li>
            </>
          )}

          {/* קישור לעגלה - תמיד מוצג */}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? `${styles.cartLink} ${styles.activeLink}`
                  : styles.cartLink
              }
              onClick={closeAllMenus}
            >
              <ShoppingCart />
              <span>עגלה</span>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      <button
        className={styles.hamburger}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
};

export default Header;
