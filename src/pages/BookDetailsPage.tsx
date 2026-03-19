import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Book } from "../types/book";
import { getBookById } from "../services/googleBooksService";
import { useBookStore } from "../store/bookStore";
import { getReviewsByBook } from "../services/reviewService";
import ReviewForm from "../components/ReviewForm";
import { useAuthStore } from "../store/authStore";
import "./BookDetailsPage.css";
import { ArrowLeft } from "lucide-react";
import type { Review } from "../types/review";
import { Star } from "lucide-react";

const BookDetailsPage = () => {
  const { id } = useParams(); // Bok-ID från URL
  const booksInStore = useBookStore((state) => state.books); // Hämtar böcker från zustand store
  const [book, setBook] = useState<Book | null>(null); // State för bokdetaljer
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);  // kollar inloggad användare

  // Recensioner 
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Hämta bokdetaljer från store eller API
  useEffect(() => {
    if (!id) return;

    const existingBook = booksInStore.find((b) => b.id === id);
    if (existingBook) {
      setBook(existingBook); // Om boken finns i store, använd den
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const fetchedBook = await getBookById(id); // API-anrop
        setBook(fetchedBook);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Ett oväntat fel inträffade");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, booksInStore]);

  // Hämtar recensioner för boken
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getReviewsByBook(id); // API-anrop
        setReviews(data);
      } catch (err: unknown) {
        if (err instanceof Error) setReviewsError(err.message);
        else setReviewsError("Kunde inte hämta recensioner");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Tar bort HTML-taggar från beskrivning
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, "");
  };

  if (loading) return <p>Laddar bok...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Ingen bok vald</p>;

  const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={16}
      fill={i < rating ? "gold" : "none"}
      stroke={i < rating ? "gold" : "#ccc"}
    />
  ));
};

  return (
    <div className="book-details-wrapper">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Tillbaka
      </Link>

      <div className="book-details">
        {book.thumbnail && (
          <img src={book.thumbnail} alt={book.title} className="book-image" />
        )}

        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="author">
            <strong>Författare:</strong> {book.authors.join(", ")}
          </p>
          {book.averageRating && <p><strong>Betyg:</strong> {book.averageRating}</p>}
          {book.description && (
            <>
              <h3>Beskrivning</h3>
              <p className="description">{stripHtml(book.description)}</p>
            </>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Recensioner</h2>

        {reviewsLoading && <p>Laddar recensioner...</p>}
        {reviewsError && <p>{reviewsError}</p>}
        {!reviewsLoading && reviews.length === 0 && <p>Inga recensioner ännu.</p>}

        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <p className="review-text">{review.text}</p>
              <div className="review-meta">
                <strong>{review.username}</strong>
                <div className="stars">
                  {renderStars(review.rating)}
                </div>
              </div>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      </div>

      {user && id && (
        <ReviewForm
          bookId={id}
          bookTitle={book.title}
          bookThumbnail={book.thumbnail}
          onReviewCreated={(newReview) =>
            setReviews((prev) => [newReview, ...prev])
          }
        />
      )}
    </div>
  );
};

export default BookDetailsPage;