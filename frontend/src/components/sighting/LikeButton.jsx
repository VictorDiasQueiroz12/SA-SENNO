import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as likesService from "../../services/likes.service";
import Button from "../ui/Button";

export default function LikeButton({ sightingId, initialCount = 0, initialLiked = false }) {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!isAuthenticated || loading) return;
    setLoading(true);
    try {
      const result = liked
        ? await likesService.unlikeSighting(sightingId)
        : await likesService.likeSighting(sightingId);
      setCount(result.likesCount);
      setLiked(result.likedByCurrentUser);
    } catch (err) {
      // silencioso: erro de curtida duplicada/nao encontrada nao precisa travar a UI
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={toggle} disabled={!isAuthenticated || loading} title={!isAuthenticated ? "Entre para curtir" : ""}>
      {liked ? "❤" : "🤍"} {count}
    </Button>
  );
}
