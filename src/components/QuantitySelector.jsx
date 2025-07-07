import { Plus, Minus } from "lucide-react";
import styles from "./QuantitySelector.module.css";

const QuantitySelector = ({ quantity, onDecrease, onIncrease, stock }) => {
  return (
    <div className={styles.quantitySelector}>
      <button
        className={styles.button}
        onClick={onDecrease}
      >
        <Minus size={16} />
      </button>
      <span className={styles.quantity}>{quantity}</span>
      <button
        className={styles.button}
        onClick={onIncrease}
        disabled={quantity >= stock} // חוסם את הכפתור אם הכמות שווה למלאי
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;
