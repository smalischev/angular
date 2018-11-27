import { Component } from '@angular/core';
import { Observable, range, of, interval, fromEvent, from, throwError, empty } from 'rxjs';
import { filter, map, flatMap, scan, take, tap, buffer, debounceTime, catchError, concatMap, delay, retryWhen, finalize, mergeMap } from 'rxjs/operators';
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
  counter = 0;
  ngOnInit() {
    interval(1000).pipe(
      tap(() => console.log("request fired")),
      concatMap(item => {
        
        let httpRequest = this.counter % 3 === 0 ? this.http.get('http://localhost:3000/url') : this.http.get('http://localhost:3001/url');
        this.counter++;
        return httpRequest.pipe(
        retryWhen(errors =>
          errors.pipe(
            //log error message
            take(10),
            tap(val => console.log(`Error in Request: ${val.error.error}`))
          ))
      )})
    )
    .subscribe(
      timedItem => {console.log(timedItem)},
      (error) => console.log(`the error was ${error}`),
      () => { console.log(this.errorOn), this.errorOn = false });
  }
  /*ngOnInit(){
    this.http.get('http://localhost:3000/url').subscribe(() => console.log("3000 fertig"));
    this.http.get('http://localhost:3001/url').subscribe(() => console.log("3001 fertig"), (error) => console.log(`Error in Request: ${error.error.error}`));
  }*/
}
