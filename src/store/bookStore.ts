import { create } from "zustand";
import type { Book } from "../types/book";

interface BookStore {
  books: Book[];
  query: string;
  setBooks: (books: Book[]) => void;
  setQuery: (query: string) => void;
}

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  query: "",
  setBooks: (books) => set({ books }),
  setQuery: (query) => set({ query }),
}));