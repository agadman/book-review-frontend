import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import type { Review } from "../types/review";
import { getMyReviews, deleteReview, updateReview } from "../services/reviewService";

const MyProfilePage = () => {
  const token = useAuthStore((state) => state.token);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(1);

  useEffect(() => {
    if (!token) return;

    const fetchMyReviews = async () => {
      try {
        setLoading(true);
        const data = await getMyReviews(token);
        setReviews(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ett oväntat fel inträffade");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      await deleteReview(id, token);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch {
      alert("Kunde inte ta bort recensionen");
    }
  };

  const handleEditTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(event.target.value);
  };

  const handleEditRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEditRating(Number(event.target.value));
  };

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
        prev.map((r) =>
          r.id === id ? { ...r, text: editText, rating: editRating } : r
        )
      );

      setEditingId(null);
    } catch {
      alert("Kunde inte uppdatera recensionen");
    }
  };

  if (!token) return <p>Du måste vara inloggad för att se dina recensioner.</p>;
  if (loading) return <p>Laddar dina recensioner...</p>;
  if (error) return <p>{error}</p>;
  if (reviews.length === 0) return <p>Du har inte lämnat några recensioner ännu.</p>;

  return (
    <div>
      <h1>Min profil</h1>
      <h2>Mina recensioner</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            {editingId === review.id ? (
              <>
                <label>
                    recension:
                    <textarea value={editText} onChange={handleEditTextChange} />
                </label>
                <label>
                    Betyg:
                    <select value={editRating} onChange={handleEditRatingChange}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                </label>

                <button onClick={() => handleSave(review.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{review.username}</strong> ({review.rating}/5): {review.text}
                <br />
                <p>{new Date(review.createdAt).toLocaleString()}</p>
                <br />

                <button onClick={() => handleEdit(review)}>Edit</button>
                <button onClick={() => handleDelete(review.id)}>Delete</button>
              </>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProfilePage;