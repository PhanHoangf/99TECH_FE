import { Component, OnInit } from '@angular/core';
import { CurrencyFormComponent } from './components/currency-form/currency-form.component';
import { CommonModule } from '@angular/common';
import { CurrencyService } from './services/currency.service';
import { IToken } from './interfaces/currency.interface';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { roundTo2 } from './utils/utils';
import { delay, of, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyFormComponent, CommonModule],
  providers: [CurrencyService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'currency-swap';
  tokens: IToken[] = [];

  transferCurrencyPrice = 0;
  transferAmount = 0;

  receivedAmount = 0;
  receivedCurrency = 0;
  receivedPrice = 0;

  isLoading = false;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.loadToken();
  }

  loadToken() {
    this.currencyService.getToken().subscribe((res) => {
      this.tokens = res;
    });
  }

  handleTransferCurrencyChange(currency: IToken) {
    this.transferCurrencyPrice = currency.price;
    this.calculateSwap();
  }

  handleTransferAmountChange(amount: number) {
    this.transferAmount = amount;
    this.calculateSwap();
  }

  handleReceivedCurrencyChange(currency: IToken) {
    this.receivedCurrency = currency.price;
    this.calculateSwap();
  }

  calculateSwap() {
    if (
      this.transferCurrencyPrice &&
      this.transferAmount &&
      this.receivedCurrency
    ) {
      of(null)
        .pipe(
          tap(() => (this.isLoading = true)),
          delay(2000)
        )
        .subscribe(() => {
          const totalTransfer =
            this.transferCurrencyPrice * this.transferAmount;
          this.receivedAmount = totalTransfer / this.receivedCurrency;
          this.receivedPrice = this.receivedAmount * this.receivedCurrency;
          this.isLoading = false;
        });
    }
  }
}
