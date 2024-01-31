import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BookService } from '../../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Book } from '../../../interfaces/book';

@Component({
  selector: 'app-edit-book',
  standalone: true,
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
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss',
})
export class EditBookComponent implements OnInit {
  private bookService = inject(BookService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  editBookForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    description: [''],
    coverImage: [''],
  });
  bookId = this.route.snapshot.paramMap.get('bookId');

  ngOnInit(): void {
    this.bookService.getBookById(this.bookId!).subscribe(book => {
      this.editBookForm.patchValue(book);
    });
  }

  saveBook() {
    const book = <Book>{ ...this.editBookForm.value, id: this.bookId };

    this.bookService.editBook(book).subscribe(() => {
      this.bookService.getBooks();
      this.messageService.add({
        severity: 'success',
        summary: 'Book edited',
        detail: 'Congratz',
      });
      this.router.navigate(['admin']);
    });
  }
}
