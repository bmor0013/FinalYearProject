import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})

export class DbServiceService {

  constructor(private http: HttpClient) {}

  getPoses() {
    return this.http.get("/poses");
  }

  
  savePose(data: any) {
    return this.http.post("/savePose", data, httpOptions);
  }

  deletePose(name: string) {

    let url:string = "/poseDelete/" + name;

    return this.http.delete(url)
  }

}
