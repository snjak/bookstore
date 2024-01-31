import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookService } from '../../services/book.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { Book } from '../../interfaces/book';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    ToastModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  addBookForm!: FormGroup;

  books$ = this.bookService.books$;

  ngOnInit(): void {
    this.addBookForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: [''],
      coverImage: [''],
    });
  }
  addBook() {
    this.router.navigate(['admin', 'add-book']);
  }

  editBook(book: Book) {
    this.router.navigate(['admin', 'edit-book', book.id]);
  }

  deleteBook(book: Book) {
    this.bookService.deleteBook(book).subscribe(() => {
      this.bookService.getBooks();
      this.messageService.add({
        severity: 'success',
        summary: 'Book deleted',
        detail: 'Congratz',
      });
    });
  }
}
