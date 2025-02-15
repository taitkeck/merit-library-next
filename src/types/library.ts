// TODO: Add tsx types for the library django models
export type Author = {
  last_name: string;
  first_name: string;
  id: number;
};

export type Book = {
  title: string;
  pages: number;
  last_name: string;
  first_name: string;
  author: number;
  call_number: string;
  isbn: string;
  image?: string;
  copies?: number;
};

export type BookData = {
  call_number: string;
  isbn: string;
};

export type Checkout = {
  book: string;
  student: number;
  checkout_time: string;
  due_date: string;
  id: number;

  //...
};
