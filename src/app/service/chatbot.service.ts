import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timeout } from "rxjs";

@Injectable({ providedIn: 'root' })  
export class ChatbotService {
  private apiUrl = '/api/chatbot';

  constructor(private http: HttpClient) {}  

  sendMessage(message: string): Observable<{ output: string }> {  
    return this.http.post<{ output: string }>(this.apiUrl, { chatInput: message }).pipe(timeout(6000));
  }
}