import { Component, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../authentication/services/auth.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Observable, startWith, map, switchMap, debounceTime } from 'rxjs';
import { Book } from '../../interfaces/book';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    CardModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
  templateUrl: './bookstore.component.html',
  styleUrl: './bookstore.component.scss',
})
export class BookStoreComponent implements OnInit {
  private bookService = inject(BookService);
  private authService = inject(AuthService);
  private router = inject(Router);

  books$ = this.bookService.books$;
  selectedBook$ = this.bookService.currentSelectedBook$;
  authenticatedUser$ = this.authService.getAuthenticatedUser();

  searchControl = new FormControl('');
  filteredBooks$!: Observable<Book[]>;

  ngOnInit(): void {
    this.bookService.getBooks();
    this.filteredBooks$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(searchText => this.filterBooks(searchText!))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowSelect(event: any) {
    this.bookService.selectBook(event.data);
  }

  private filterBooks(searchText: string): Observable<Book[]> {
    return this.books$.pipe(
      map(books =>
        books.filter(
          book =>
            book.title.toLowerCase().includes(searchText.toLowerCase()) ||
            book.author.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
  }

  goAdmin() {
    this.router.navigate(['admin']);
  }
}
