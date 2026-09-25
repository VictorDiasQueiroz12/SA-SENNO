import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as commentsService from "../../services/comments.service";
import Button from "../ui/Button";

export default function CommentList({ sightingId, comments, onChange }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await commentsService.createComment(sightingId, content.trim());
      setContent("");
      onChange();
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel comentar.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id) {
    if (!editContent.trim()) return;
    try {
      await commentsService.updateComment(id, editContent.trim());
      setEditingId(null);
      onChange();
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel editar o comentario.");
    }
  }

  async function handleDelete(id) {
    try {
      await commentsService.deleteComment(id);
      onChange();
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel excluir o comentario.");
    }
  }

  return (
    <div>
      <h3>Comentarios ({comments.length})</h3>

      {comments.length === 0 && <p style={{ color: "var(--lv-text-muted)" }}>Seja o primeiro a comentar.</p>}

      {comments.map((c) => (
        <div key={c.id} className="lv-panel" style={{ marginBottom: 8 }}>
          <div className="lv-flex-between">
            <strong>{c.author?.name}</strong>
            <span style={{ fontSize: 11, color: "var(--lv-text-muted)" }}>
              {new Date(c.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>

          {editingId === c.id ? (
            <div style={{ marginTop: 6 }}>
              <textarea className="lv-textarea" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
              <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                <Button variant="primary" onClick={() => handleUpdate(c.id)}>Salvar</Button>
                <Button onClick={() => setEditingId(null)}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <p style={{ margin: "6px 0" }}>{c.content}</p>
          )}

          {isAuthenticated && (user?.id === c.author?.id || isAdmin) && editingId !== c.id && (
            <div style={{ display: "flex", gap: 6 }}>
              {user?.id === c.author?.id && (
                <Button onClick={() => { setEditingId(c.id); setEditContent(c.content); }}>Editar</Button>
              )}
              <Button variant="danger" onClick={() => handleDelete(c.id)}>Excluir</Button>
            </div>
          )}
        </div>
      ))}

      {isAuthenticated ? (
        <form onSubmit={handleCreate} style={{ marginTop: 12 }}>
          <textarea
            className="lv-textarea"
            placeholder="Escreva um comentario..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {error && <p className="lv-error-text">{error}</p>}
          <Button type="submit" variant="primary" disabled={submitting} style={{ marginTop: 6 }}>
            {submitting ? "Enviando..." : "Comentar"}
          </Button>
        </form>
      ) : (
        <p style={{ color: "var(--lv-text-muted)" }}>Entre para comentar.</p>
      )}
    </div>
  );
}
