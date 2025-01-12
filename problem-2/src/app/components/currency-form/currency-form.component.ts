import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IToken } from '../../interfaces/currency.interface';
import { CurrencyService } from '../../services/currency.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { roundTo2 } from '../../utils/utils';

@Component({
  selector: 'app-currency-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './currency-form.component.html',
  styleUrl: './currency-form.component.scss',
})
export class CurrencyFormComponent implements OnInit, OnDestroy {
  @Input()
  tokens: IToken[] = [];

  @Input()
  isConverted: boolean = false;

  @Input()
  convertedAmount: number = 0;

  @Input()
  totalPrice: number = 0;

  @Output()
  onSelectedCurrencyChange = new EventEmitter<IToken>();

  @Output()
  onAmountChange = new EventEmitter<number>();

  currencyForm!: FormGroup;
  selectedPrice: number = 0;

  private _destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    public currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.selectedCurrencyFormControl?.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        const token = this.tokens.find((t) => t.currency === value);
        if (token) {
          this.selectedPrice = roundTo2(token.price);
          this.onSelectedCurrencyChange.emit(token);
        }
      });

    this.amountFormControl?.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        this.onAmountChange.emit(value);
      });
  }

  get amountFormControl() {
    return this.currencyForm.get('amount');
  }

  get selectedCurrencyFormControl() {
    return this.currencyForm.get('selectedCurrency');
  }

  initForm() {
    this.currencyForm = this.fb.group({
      selectedCurrency: ['', Validators.required],
      amount: [
        { value: 0, disabled: this.isConverted ? true : false },
        Validators.required,
      ],
    });
  }

  ngOnDestroy(): void {
    this._destroy$.subscribe();
    this._destroy$.complete();
  }
}
