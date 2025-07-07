import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const VerificationSuccessPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <CheckCircle
        color="green"
        size={80}
      />
      <h1>החשבון אומת בהצלחה!</h1>
      <p>כעת ניתן להתחבר למערכת.</p>
      <Link to="/login">עבור לדף ההתחברות</Link>
    </div>
  );
};
export default VerificationSuccessPage;
