import { useEffect, useState } from "react";

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
}

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
    useEffect(() => {
      fetchBooks();
    }, []);
  
    const fetchBooks = async () => {
        try {
          setLoading(true);
          const resp = await fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter");
  
          if(!resp.ok){
            throw Error;
          } else {
            const data = await resp.json();
  
            const mappedBooks: Book[] = data.items.map((item: any) => ({
              id: item.id,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors || ["Unknown"],
              thumbnail: item.volumeInfo.imageLinks?.thumbnail
            }));
  
            setBooks(mappedBooks);
            setError(null);
  
          }
        } catch (error) {
          console.log(error);
          setError("Något gick fel när böckerna skulle hämtas.");
        } finally {
          setLoading(false);
        }
      };
  
    return (
      <div>
        <h1>Book Review App</h1>
        {
          error && <p>{error}</p>
        }
  
        {
          loading && <p>Laddar böcker...</p>
        }
        
        <div>
          {books.map((book) => (
            <section key={book.id}>
              <h2>{book.title}</h2> — <p>{book.authors.join(", ")}</p>
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