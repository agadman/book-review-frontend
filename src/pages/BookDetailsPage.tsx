import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Book } from "../types/book";
import { getBookById } from "../services/googleBooksService";

const BookDetailsPage = () => {
  const { id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setBook(null);

        const book = await getBookById(id);
        setBook(book);
        
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
  }, [id]);

  if (loading) return <p>Laddar bok...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Ingen bok vald</p>;

  return (
    <div>
      <h1>{book.title}</h1>

      <p><strong>Författare:</strong> {book.authors.join(", ")}</p>

      {book.thumbnail && (
        <img src={book.thumbnail} alt={book.title} />
      )}

      {book.publishedDate && (
        <p><strong>Publicerad:</strong> {book.publishedDate}</p>
      )}

      {book.pageCount && (
        <p><strong>Antal sidor:</strong> {book.pageCount}</p>
      )}

      {book.averageRating && (
        <p><strong>Betyg:</strong> {book.averageRating}</p>
      )}

      {book.categories && (
        <p><strong>Kategori:</strong> {book.categories.join(", ")}</p>
      )}

      {book.description && (
        <div>
          <h3>Beskrivning</h3>
          <p>{book.description}</p>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;