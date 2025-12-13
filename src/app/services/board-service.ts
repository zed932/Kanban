import { Injectable } from '@angular/core';
import {Desk} from "../home/board/desk/desk"

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  url = "http://localhost:3000/desksList"

  constructor() {}

  async getDesksList() : Promise<Desk[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

}
