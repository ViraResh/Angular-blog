import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { FbCreateResponce, Post } from './interfaces';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/internal/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private http: HttpClient) { }

  create(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(map((response: FbCreateResponce) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        }
      }));
  }
}
