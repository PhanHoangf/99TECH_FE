import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map } from 'rxjs';
import { IToken } from '../interfaces/currency.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly URL = 'https://interview.switcheo.com/prices.json';

  constructor(private httpClient: HttpClient) {}

  getToken() {
    return this.httpClient.get<IToken[]>(this.URL).pipe(
      catchError(this.handleError),
      map((tokens: IToken[]) => {
        let formatRes: IToken[] = [];

        tokens.forEach((token) => {
          if (!formatRes.find((t) => t.currency === token.currency)) {
            formatRes.push(token);
          }
        });

        return formatRes;
      })
    );
  }

  getCurrencyIcon(name: string) {
    if (name) {
      return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${name}.svg`;
    }

    return '';
  }

  handleError = (err: HttpErrorResponse) => {
    alert(`Failed to fetch API: ${err.message} | ${err.status}`);
    return EMPTY;
  };
}
