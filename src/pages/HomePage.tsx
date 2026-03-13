import { useState } from "react";
import { Link } from "react-router-dom";
import { searchBooks } from "../services/googleBooksService";
import { useBookStore } from "../store/bookStore";

const HomePage = () => {
  // Hämtar böcker och query från store
  const books = useBookStore((state) => state.books);
  const setBooks = useBookStore((state) => state.setBooks);
  const query = useBookStore((state) => state.query);
  const setQuery = useBookStore((state) => state.setQuery);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
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
      </div>
    );
}

export default HomePage