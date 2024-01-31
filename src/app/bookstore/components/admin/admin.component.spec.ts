import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Book } from '../../interfaces/book';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockBookService: jasmine.SpyObj<BookService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockBookService = jasmine.createSpyObj('BookService', [
      'getBooks',
      'deleteBook',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, AdminComponent],
      providers: [
        FormBuilder,
        MessageService,
        { provide: BookService, useValue: mockBookService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the addBookForm on ngOnInit', () => {
    component.ngOnInit();
    expect(component.addBookForm).toBeDefined();
    expect(component.addBookForm.controls['title']).toBeDefined();
    expect(component.addBookForm.controls['author']).toBeDefined();
  });

  it('should navigate to add book page on addBook', () => {
    component.addBook();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin', 'add-book']);
  });

  it('should navigate to edit book page on editBook', () => {
    const mockBook: Book = {
      id: '1',
      title: 'Test Book',
      author: 'Author',
      description: '',
      coverImage: '',
    };
    component.editBook(mockBook);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'admin',
      'edit-book',
      mockBook.id,
    ]);
  });

  it('should call deleteBook on BookService and refresh books list on deleteBook', () => {
    const mockBook: Book = {
      id: '1',
      title: 'Test Book',
      author: 'Author',
      description: '',
      coverImage: '',
    };
    mockBookService.deleteBook.and.returnValue(of(<Book>{}));

    component.deleteBook(mockBook);

    expect(mockBookService.deleteBook).toHaveBeenCalledWith(mockBook);
    expect(mockBookService.getBooks).toHaveBeenCalled();
  });
});
