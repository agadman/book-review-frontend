import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Book } from "../types/book";
import { getBookById } from "../services/googleBooksService";
import { useBookStore } from "../store/bookStore";
import ReviewForm from "../components/ReviewForm";
import { useAuthStore } from "../store/authStore";
import type { Review } from "../types/review";
import { getReviewsByBook } from "../services/reviewService";
import "./BookDetailsPage.css";
import { ArrowLeft } from "lucide-react";

const BookDetailsPage = () => {
  const { id } = useParams();

  const booksInStore = useBookStore((state) => state.books);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const existingBook = booksInStore.find((b) => b.id === id);
    if (existingBook) {
      setBook(existingBook);
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setBook(null);

        const fetchedBook = await getBookById(id);
        setBook(fetchedBook);
        
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

    fetchBookDetails();
  }, [id, booksInStore]);

  useEffect(() => {
  if (!id) return;

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await getReviewsByBook(id);
      setReviews(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setReviewsError(err.message);
      } else {
        setReviewsError("Ett oväntat fel inträffade");
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  fetchReviews();
}, [id]);

  if (loading) return <p>Laddar bok...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Ingen bok vald</p>;

  return (
  <div className="book-details-wrapper">

    <Link to="/" className="back-link">
      <ArrowLeft size={18} />
        Tillbaka
    </Link>

    <div className="book-details">

      {book.thumbnail && (
        <img
          src={book.thumbnail}
          alt={book.title}
          className="book-image"
        />
      )}

      <div className="book-info">
        <h1>{book.title}</h1>

        <p className="author">
          <strong>Författare:</strong> {book.authors.join(", ")}
        </p>

        {book.averageRating && (
          <p><strong>Betyg:</strong> {book.averageRating}</p>
        )}

        {book.description && (
          <>
            <h3>Beskrivning</h3>
            <p className="description">{book.description}</p>
          </>
        )}
      </div>

    </div>

    <div className="reviews-section">
      <h2>Recensioner</h2>

      {reviewsLoading && <p>Laddar recensioner...</p>}
      {reviewsError && <p>{reviewsError}</p>}
      {!reviewsLoading && reviews.length === 0 && (
        <p>Inga recensioner ännu.</p>
      )}

      <ul className="review-list">
        {reviews.map((review) => (
          <li key={review.id} className="review-item">
            <p className="review-text">{review.text}</p>

            <p className="review-meta">
              <strong>{review.username}</strong> • {review.rating}/5
            </p>

            <small>
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </div>

    {user && id && (
      <ReviewForm
        bookId={id}
        onReviewCreated={(newReview) =>
          setReviews((prev) => [newReview, ...prev])
        }
      />
    )}

  </div>
);
};

export default BookDetailsPage;