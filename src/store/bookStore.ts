import { create } from "zustand";
import type { Book } from "../types/book";

// Typdefinition för store:en
interface BookStore {
  books: Book[];
  query: string;
  setBooks: (books: Book[]) => void;
  setQuery: (query: string) => void;
}

// Skapar zustand store
export const useBookStore = create<BookStore>((set) => ({
  books: [],
  query: "",

  // Sparar böcker i state
  setBooks: (books) => set({ books }),

  // Sparar söksträng i state
  setQuery: (query) => set({ query }),
}));