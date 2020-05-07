import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, interval, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class BlogserviceService {

  constructor(private http: HttpClient, private route: Router) { }

  endpoint: string = "http://localhost:5000/api";
  

  getAllPosts() {
    let api = `${this.endpoint}/getAllPosts`;
    return new Promise (resolve => {
      this.http.get<any>(api)
      .subscribe((res: any) => {
        console.log(res.posts);
        if (res.posts.length > 0) {
          resolve(res.posts);
        }
      });
    });
  }

  getPost(id) {
    let api = `${this.endpoint}/getPost`;
    var request = { id: id };
    return new Promise (resolve => {
      this.http.post<any>(api, request)
      .subscribe((res: any) => {
        if (res.post != "") {
          resolve(res.post);
        }
      });
    });
  }

  getUserPost(id : any) {
    let api = `${this.endpoint}/getUserByID`;
    return new Promise(resolve => {
      this.http.post<any>(api, id)
      .subscribe((res: any) => {
        if (res.username != "") {
          resolve(res.username);
        }
      });
    });
  }

  savePost(post : any) {
    let api = `${this.endpoint}/savePost`;
    return new Promise(resolve => {
      this.http.post<any>(api, post)
      .subscribe((res: any) => {
        if (res != undefined) {
          resolve(res.done);
        }
        else {
          resolve(false);
        }
      });
    });
  }
}
