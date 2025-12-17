import { Injectable } from '@angular/core';
import {Desk} from "../home/board/desk/desk"
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  url = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  getDesksList() : Observable<Desk[]> {
    return this.http.get(this.url).pipe(map((data:any) => {
      let desksList : Desk[] = data['desksList'];
      return desksList;
      })
    )
  }

}
