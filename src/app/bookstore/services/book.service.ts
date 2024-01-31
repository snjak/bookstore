import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../interfaces/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/books';

  private selectedBookSubject = new BehaviorSubject<Book | null>(null);
  private booksSubject = new BehaviorSubject<Book[]>([]);
  books$ = this.booksSubject.asObservable();
  currentSelectedBook$ = this.selectedBookSubject.asObservable();

  constructor() {}

  getBooks(): void {
    this.http.get<Book[]>(this.apiUrl).subscribe(res => {
      this.booksSubject.next(res);
    });
  }

  selectBook(book: Book): void {
    this.selectedBookSubject.next(book);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  editBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book);
  }

  deleteBook(book: Book): Observable<Book> {
    return this.http.delete<Book>(`${this.apiUrl}/${book.id}`);
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }
}
