import { Component } from '@angular/core';
import { Observable, range, of, interval, fromEvent, from, throwError, empty } from 'rxjs';
import { filter, map, flatMap, scan, take, tap, buffer, debounceTime, catchError, concatMap, delay, retryWhen, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ConcatMapHttp'
  errorOn = false;

  eventObs = fromEvent(document, 'click');

  httpRequest = from([1, 2, 3, 4, 5]).pipe(
    concatMap(item => this.errorOn ?
      of(item).pipe(delay(1 / 2 * 1000)) :
      throwError(item)));

  constructor(private http: HttpClient) {}    

  ngOnInit() {
    interval(200).pipe(
      concatMap(item => this.http.get('http://localhost:3000/url').pipe(
        retryWhen(errors =>
          errors.pipe(
            //log error message
            take(10),
            tap(val => console.log(`Error in Request: ${val.error.error}`))
          ))
      ))
    )
    .subscribe(
      timedItem => console.log(timedItem),
      (error) => console.log(`the error was ${error}`),
      () => { console.log(this.errorOn), this.errorOn = false });
  }
}
