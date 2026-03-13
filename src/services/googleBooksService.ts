import type { Book, GoogleBookItem } from "../types/book";

const GOOGLE_BOOKS_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

export const searchBooks = async (query: string): Promise<Book[]> => {
  if (!query.trim()) return [];
  
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=10&key=${GOOGLE_BOOKS_KEY}`
  );

  if (!resp.ok) {
    throw new Error("API error");
  }

  const data = await resp.json();

  if (!data.items) {
    return [];
  }

  return data.items.map((item: GoogleBookItem) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || ["Unknown"],
    thumbnail: item.volumeInfo.imageLinks?.thumbnail,
    description: item.volumeInfo.description,
    publishedDate: item.volumeInfo.publishedDate,
    averageRating: item.volumeInfo.averageRating,
    pageCount: item.volumeInfo.pageCount,
    categories: item.volumeInfo.categories,
  }));
};

export const getBookById = async (id: string): Promise<Book> => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_BOOKS_KEY}`
  );

  if (!resp.ok) {
    throw new Error("Något gick fel när boken hämtades");
  }

  const data: GoogleBookItem = await resp.json();

  return {
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
};