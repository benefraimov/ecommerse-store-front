import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
      />
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </>,
    document.getElementById("portal"), // ניצור את האלמנט הזה בקובץ ה-HTML
  );
};

export default Modal;
