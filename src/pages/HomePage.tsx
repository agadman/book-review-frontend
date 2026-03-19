import { useEffect } from "react";
import { Link } from "react-router-dom";
import { searchBooks } from "../services/googleBooksService";
import { useBookStore } from "../store/bookStore";
import { useReviewStore } from "../store/reviewStore";
import type { Review } from "../types/review";
import "./HomePage.css";
import { Star } from "lucide-react";

const HomePage = () => {
  // Böcker och query från zustand store
  const books = useBookStore((state) => state.books);
  const setBooks = useBookStore((state) => state.setBooks);
  const query = useBookStore((state) => state.query);
  const setQuery = useBookStore((state) => state.setQuery);

  // Senaste recensioner från zustand store
  const latestReviews = useReviewStore((state) => state.latestReviews);
  const fetchLatest = useReviewStore((state) => state.fetchLatest);

  // Hämtar böcker från API baserat på sökquery
  const fetchBooks = async (searchQuery: string) => {
    if (!searchQuery.trim()) return; // Ignorera tomma sökningar

    try {
      const books = await searchBooks(searchQuery);
      setBooks(books); // Uppdaterar store med resultat
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchBooks(query);
  };

  // Hämtar senaste recensioner när komponenten mountas
  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

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

      <h1>Böcker och Recensioner</h1>
      {books.length === 0 ? (
        <p className="placeholder-text">Sök efter en bok för att se resultaten här...</p>
      ) : (
        <div className="grid">
          {books.map((book) => (
            <section key={book.id} className="book-card">
              <h2>
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </h2>
              <p>{book.authors.join(", ")}</p>
              {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
            </section>
          ))}
        </div>
      )}

      <h2>Senaste recensionerna</h2>
      {latestReviews.length === 0 ? (
        <p>Inga recensioner ännu.</p>
      ) : (
        <div className="grid">
          {latestReviews.map((review: Review) => (
            <div key={review.id} className="review-card">
              <div className="review-content">
                {review.bookThumbnail && (
                  <img src={review.bookThumbnail} alt={review.bookTitle} />
                )}

                <h3>
                  <Link to={`/books/${review.bookId}`} className="review-book-title">
                    {review.bookTitle || "Okänd bok"}
                  </Link>
                </h3>

                <p>{review.text.substring(0, 40)}...</p>
              </div>

              <div className="review-footer">
                <div className="review-meta">
                  <span>{review.username}</span>
                  <div className="stars">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;