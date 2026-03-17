import { useEffect } from "react";
import { Link } from "react-router-dom";
import { searchBooks } from "../services/googleBooksService";
import { useBookStore } from "../store/bookStore";
import { useReviewStore } from "../store/reviewStore";
import type { Review } from "../types/review";
import "./HomePage.css";

const HomePage = () => {
  const books = useBookStore((state) => state.books);
  const setBooks = useBookStore((state) => state.setBooks);
  const query = useBookStore((state) => state.query);
  const setQuery = useBookStore((state) => state.setQuery);

  const latestReviews = useReviewStore((state) => state.latestReviews);
  const fetchLatest = useReviewStore((state) => state.fetchLatest);

  const fetchBooks = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      const books = await searchBooks(searchQuery);
      setBooks(books);
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
              <div className="review-info">
                <h3>
                  <Link to={`/books/${review.bookId}`}>
                    {review.bookThumbnail && <img src={review.bookThumbnail} alt={review.bookTitle} />}
                    {review.bookTitle || "Okänd bok"}
                  </Link>
                </h3>
                <p>{review.text.substring(0, 40)}...</p>
                <p>{review.username} - {review.rating}/5</p>
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