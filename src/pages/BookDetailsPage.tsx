import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Book } from "../types/book";
import { getBookById } from "../services/googleBooksService";
import { useBookStore } from "../store/bookStore";
import ReviewForm from "../components/ReviewForm";
import { useAuthStore } from "../store/authStore";

const BookDetailsPage = () => {
  const { id } = useParams();

  const booksInStore = useBookStore((state) => state.books);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

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

  if (loading) return <p>Laddar bok...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Ingen bok vald</p>;

  return (
    <div>
      <Link to="/">← Tillbaka</Link>

      <h1>{book.title}</h1>

      <p><strong>Författare:</strong> {book.authors.join(", ")}</p>

      {book.thumbnail && (
        <img src={book.thumbnail} alt={book.title} />
      )}

      {book.averageRating && (
        <p><strong>Betyg:</strong> {book.averageRating}</p>
      )}

      {book.description && (
        <div>
          <h3>Beskrivning</h3>
          <p>{book.description}</p>
        </div>
      )}
      {user && id && <ReviewForm bookId={id} />} 
    </div>
  );
};

export default BookDetailsPage;