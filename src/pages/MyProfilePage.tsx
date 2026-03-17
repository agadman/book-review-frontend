import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getMyReviews, updateReview, deleteReview } from "../services/reviewService";
import type { Review } from "../types/review";
import "./MyProfilePage.css";

const MyProfilePage = () => {
  const token = useAuthStore((state) => state.token);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(1);

  // Hämtar mina recensioner
  useEffect(() => {
    if (!token) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getMyReviews(token);
        setReviews(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Kunde inte hämta recensioner");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  const handleSave = async (id: number) => {
    if (!token) return;
    try {
      await updateReview(id, editText, editRating, token);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, text: editText, rating: editRating } : r))
      );
      setEditingId(null);
    } catch {
      alert("Kunde inte uppdatera recensionen");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteReview(id, token);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Kunde inte ta bort recensionen");
    }
  };

  if (!token) return <p>Du måste vara inloggad för att se dina recensioner.</p>;
  if (loading) return <p>Laddar dina recensioner...</p>;
  if (error) return <p>{error}</p>;
  if (reviews.length === 0) return <p>Du har inte lämnat några recensioner ännu.</p>;

  return (
    <div className="profile-wrapper">
      <h1>Min profil</h1>
      <h2>Mina recensioner</h2>

      <ul className="review-list">
        {reviews.map((review) => (
          <li key={review.id} className="review-item">
             {review.bookThumbnail && (
                    <img
                      src={review.bookThumbnail}
                      alt={review.bookTitle || "Okänd bok"}
                      className="review-book-thumbnail"
                    />
                  )}
                  <p className="review-book-title">{review.bookTitle || "Okänd bok"}</p>
            {editingId === review.id ? (
              <div className="review-edit">
                <label>
                  Recension:
                  <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                </label>
                <label>
                  Betyg:
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="review-edit-buttons">
                  <button onClick={() => handleSave(review.id)}>Spara</button>
                  <button onClick={() => setEditingId(null)}>Avbryt</button>
                </div>
              </div>
            ) : (
              <div className="review-row">
                <div className="review-content">
          


                  <p className="review-meta">
                    <strong>{review.username}</strong> - {review.rating}/5
                  </p>
                  <p className="review-text">{review.text}</p>
                  <p className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="review-actions">
                  <button onClick={() => handleEdit(review)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProfilePage;