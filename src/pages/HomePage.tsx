import { useState } from "react";
import type { Book, GoogleBookItem } from "../types/book";
import { Link } from "react-router-dom";

const GOOGLE_BOOKS_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
    const fetchBooks = async (searchQuery: string) => {
      if (!searchQuery) return;
        try {
          setLoading(true);
          const resp = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle${encodeURIComponent(searchQuery)}&maxResults=10&key=${GOOGLE_BOOKS_KEY}`);
  
          if(!resp.ok){
            throw new Error("API error");
          } 

          const data = await resp.json();

          const mappedBooks: Book[] = data.items.map((item: GoogleBookItem) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || ["Unknown"],
            thumbnail: item.volumeInfo.imageLinks?.thumbnail
          }));

          setBooks(mappedBooks);
          setError(null);
  
        
        } catch (error) {
          console.log(error);
          setError("Något gick fel när böckerna skulle hämtas.");
        } finally {
          setLoading(false);
        }
      };

      const handleSearch = (error: React.FormEvent) => {
        error.preventDefault();
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