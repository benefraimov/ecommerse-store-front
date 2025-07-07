import { NavLink, Outlet } from "react-router-dom";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  return (
    <div className={styles.profileLayout}>
      <aside className={styles.sidebar}>
        <nav>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            הפרטים שלי
          </NavLink>
          <NavLink
            to="/profile/my-orders"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            ההזמנות שלי
          </NavLink>
        </nav>
      </aside>
      <main className={styles.content}>
        <Outlet /> {/* כאן יוצגו תתי-העמודים */}
      </main>
    </div>
  );
};

export default ProfilePage;
