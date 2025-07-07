import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import styles from "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContent} main-content`}>
        <div className={styles.footerColumn}>
          <h4>E-Shop</h4>
          <p>
            החנות הדיגיטלית המובילה למוצרים שאתם אוהבים. איכות, שירות ואמינות
            במקום אחד.
          </p>
          <div className={styles.socialIcons}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin />
            </a>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <h4>מפת אתר</h4>
          <ul>
            <li>
              <Link to="/">דף הבית</Link>
            </li>
            <li>
              <Link to="/cart">עגלת קניות</Link>
            </li>
            <li>
              <Link to="/profile">הפרופיל שלי</Link>
            </li>
            {/* נוסיף כאן בעתיד קישורים לקטגוריות ראשיות */}
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>מידע ושירות</h4>
          <ul>
            <li>
              <Link to="/privacy-policy">מדיניות הפרטיות</Link>
            </li>
            <li>
              <Link to="/terms-of-service">תקנון האתר</Link>
            </li>
            <li>
              <Link to="/accessibility-statement">הצהרת נגישות</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>הישארו מעודכנים</h4>
          <p>הירשמו לניוזלטר שלנו לקבלת עדכונים ומבצעים.</p>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="האימייל שלכם"
            />
            <button type="submit">הירשם</button>
          </form>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>כל הזכויות שמורות ל-E-Shop © {year}</p>
        <p>
          נבנה באהבה על ידי{" "}
          <a
            href="https://zoomtech.co.il"
            target="_blank"
            rel="noopener noreferrer"
          >
            Saas Systems Creator
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
