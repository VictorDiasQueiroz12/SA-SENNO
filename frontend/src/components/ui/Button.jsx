export default function Button({ variant, className = "", ...props }) {
  const variantClass = variant === "primary" ? "lv-btn-primary" : variant === "danger" ? "lv-btn-danger" : "";
  return <button className={`lv-btn ${variantClass} ${className}`} {...props} />;
}
