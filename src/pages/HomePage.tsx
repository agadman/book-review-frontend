import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchBooks } from "../services/googleBooksService";
import { useBookStore } from "../store/bookStore";
import type { Review } from "../types/review";
import { getLatestReviews } from "../services/reviewService";

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
      <div>
        <h1>Book Review App</h1>
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Sök efter böcker..." 
          />
          <button type="submit">Sök</button>
        </form>
        {
          error && <p>{error}</p>
        }
  
        {
          loading && <p>Laddar böcker...</p>
        }
        
        <div>
          {books.map((book) => (
            <section key={book.id}>
              <h2><Link to={`/books/${book.id}`}>{book.title}</Link></h2>
              <p>{book.authors.join(", ")}</p>
              {book.thumbnail && <br />}
              {book.thumbnail && (
                <img src={book.thumbnail} alt={book.title} />
              )}
            </section>
          ))}
        </div>
        <div>
        <h2>Senaste recensioner</h2>
        {reviewsLoading && <p>Laddar recensioner...</p>}
        {reviewsError && <p>{reviewsError}</p>}
        {!reviewsLoading && latestReviews.length === 0 && <p>Inga recensioner ännu.</p>}
        <ul>
          {latestReviews.map((review) => (
            <li key={review.id}>
              <Link to={`/books/${review.bookId}`}>
                <strong>{review.username}</strong> recenserade "{review.text.substring(0, 40)}..."
              </Link>
              <br />
              <small>{new Date(review.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
      </div>
    );
}

export default HomePage