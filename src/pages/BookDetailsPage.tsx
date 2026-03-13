import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Book } from "../types/book";

const GOOGLE_BOOKS_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

const BookDetailsPage = () => {
  const { id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_BOOKS_KEY}`
        );

        if (!response.ok) {
          throw new Error("Något gick fel när boken hämtades");
        }

        const data = await response.json();

        const mappedBook: Book = {
          id: data.id,
          title: data.volumeInfo.title,
          authors: data.volumeInfo.authors || ["Unknown"],
          thumbnail: data.volumeInfo.imageLinks?.thumbnail,
          description: data.volumeInfo.description,
          publishedDate: data.volumeInfo.publishedDate,
          averageRating: data.volumeInfo.averageRating,
          pageCount: data.volumeInfo.pageCount,
          categories: data.volumeInfo.categories
        };

        setBook(mappedBook);

      } catch (err: unknown) {
        setError((err as Error).message || "Ett oväntat fel inträffade");
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