import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import type { Review } from "../types/review";
import { getMyReviews } from "../services/reviewService";

const MyProfilePage = () => {
  const token = useAuthStore((state) => state.token);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <strong>{review.username}</strong> ({review.rating}/5): {review.text}
            <br />
            <small>{new Date(review.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProfilePage;