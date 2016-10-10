import { Injectable, Optional } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({ headers: this.headers });

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  constructor(private http: Http) { }

  // Using generics here to make sure that we get the type of response is under controll
  post<T>(url: string, data: any): Observable<T> {
    return this.http.post(url, data, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  get<T>(url: string): Observable<T> {
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
