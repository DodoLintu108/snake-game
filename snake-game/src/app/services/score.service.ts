// src/app/services/score.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopScores, Score } from '../interfaces/score.interfaces';


@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }
  
  getTopScores(): Observable<TopScores> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<TopScores>(`${this.apiUrl}/top-scores`, { headers });
  }
  submitScore(score: number, difficulty: string): Observable<Score> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Score>(`${this.apiUrl}/scores`, { score, difficulty }, { headers });
  }

  getUserHighScores(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/scores`, { headers });
  }

  getUserScores(): Observable<Score[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Score[]>(`${this.apiUrl}/scores`, { headers });
  }
}