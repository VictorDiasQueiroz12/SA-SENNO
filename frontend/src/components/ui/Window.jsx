// Componente de "janela" retro reutilizavel - usado para envolver
// formularios e paineis com a estetica de janela do Windows 95.
export default function Window({ title, icon = "🪟", children, actions }) {
  return (
    <div className="lv-window">
      <div className="lv-titlebar">
        <div className="lv-titlebar-title">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        {actions}
      </div>
      <div className="lv-window-body">{children}</div>
    </div>
  );
}
