import type { Book, GoogleBookItem } from "../types/book";

const GOOGLE_BOOKS_URL = import.meta.env.VITE_GOOGLE_BOOKS_URL;
const GOOGLE_BOOKS_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

// Söker efter böcker via Google Books API
export const searchBooks = async (query: string): Promise<Book[]> => {
  if (!query.trim()) return []; // Returnerar tom lista om ingen sökning
  
  // Söker endast på boktitlar (intitle) för mer relevanta resultat
  const resp = await fetch(
    `${GOOGLE_BOOKS_URL}?q=intitle:${encodeURIComponent(query)}&maxResults=10&key=${GOOGLE_BOOKS_KEY}`
  );

  // Felhantering om API-anrop misslyckas
  if (!resp.ok) {
    throw new Error("API error");
  }

  const data = await resp.json();

  // Om inga resultat finns
  if (!data.items) {
    return [];
  }

   // Mappar från GoogleBookItem → Book (egen struktur)
  return data.items.map((item: GoogleBookItem) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || ["Unknown"],
    thumbnail: item.volumeInfo.imageLinks?.thumbnail,
    description: item.volumeInfo.description,
    publishedDate: item.volumeInfo.publishedDate,
    averageRating: item.volumeInfo.averageRating,
    categories: item.volumeInfo.categories,
  }));
};

// Hämtar en specifik bok baserat på ID
export const getBookById = async (id: string): Promise<Book> => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_BOOKS_KEY}`
  );

    // Felhantering om något går fel
  if (!resp.ok) {
    throw new Error("Något gick fel när boken hämtades");
  }

  const data: GoogleBookItem = await resp.json();

   // Mappar API-svar till Book-interface
  return {
    id: data.id,
    title: data.volumeInfo.title,
    authors: data.volumeInfo.authors || ["Unknown"],
    thumbnail: data.volumeInfo.imageLinks?.thumbnail,
    description: data.volumeInfo.description,
    publishedDate: data.volumeInfo.publishedDate,
    averageRating: data.volumeInfo.averageRating,
    categories: data.volumeInfo.categories
  };
};