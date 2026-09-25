// Campo de formulario generico: label + input/select/textarea + erro.
export default function Field({ label, error, children }) {
  return (
    <div className="lv-field">
      {label && <label className="lv-label">{label}</label>}
      {children}
      {error && <span className="lv-error-text">{error}</span>}
    </div>
  );
}
