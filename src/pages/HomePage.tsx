import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchBooks } from "../services/googleBooksService";
import { useBookStore } from "../store/bookStore";
import type { Review } from "../types/review";
import { getLatestReviews } from "../services/reviewService";
import "./HomePage.css";

const HomePage = () => {
  const books = useBookStore((state) => state.books);
  const setBooks = useBookStore((state) => state.setBooks);
  const query = useBookStore((state) => state.query);
  const setQuery = useBookStore((state) => state.setQuery);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getLatestReviews();
        setLatestReviews(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setReviewsError(err.message);
        } else {
          setReviewsError("Kunde inte hämta senaste recensionerna");
        }
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchLatestReviews();
  }, []);
  
  const fetchBooks = async (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      try {
        setLoading(true);

        const books = await searchBooks(searchQuery);
        setBooks(books);

        if (books.length === 0) {
          setError("Inga böcker hittades.");
        } else {
          setError(null);
        }

      } catch (err: unknown) {
        console.error(err);
        setError("Något gick fel när böckerna skulle hämtas.");
      } finally {
        setLoading(false);
      }
    };

    const handleSearch = (event: React.FormEvent) => {
      event.preventDefault();
      fetchBooks(query);
    }
  
    return (
      <div className="wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Sök efter böcker..." 
            className="search-input"
          />
          <button type="submit">Sök</button>
        </form>
        <h1>Böcker</h1>

        {
          error && <p>{error}</p>
        }
  
        {
          loading && <p>Laddar böcker...</p>
        }

        {books.length === 0 && !error && !loading ? (
          <p className="placeholder-text">Sök efter en bok för att se resultaten här...</p>
        ) : (
          <div className="grid">
            {books.map((book) => (
              <section key={book.id} className="book-card">
                <h2><Link to={`/books/${book.id}`}>{book.title}</Link></h2>
                <p>{book.authors.join(", ")}</p>
                {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
              </section>
            ))}
          </div>
        )}

        <h2>Senaste recensionerna</h2>
        {reviewsLoading && <p>Laddar recensioner...</p>}
        {reviewsError && <p>{reviewsError}</p>}
        {!reviewsLoading && latestReviews.length === 0 && <p>Inga recensioner ännu.</p>}
        <div className="grid">
        {latestReviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-info">
              <h3><Link to={`/books/${review.bookId}`}>{review.text.substring(0, 40)}...</Link></h3>
              <p><strong>{review.username}</strong> - {review.rating}/5</p>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
      </div>
    );
}

export default HomePage