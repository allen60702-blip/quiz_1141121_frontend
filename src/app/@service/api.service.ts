import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  // 1. 設定後端地址
  private baseUrl = 'http://localhost:8080';

  // 2. 注入 HttpClient
  constructor(private http: HttpClient) { }

  // 3. GET 方法 (用大括號包起來 { })
  // 加上 withCredentials: true，這樣後端 HttpSession 才能正確辨識使用者
  getApi(url: string): Observable<any> {
    // 這裡會把 baseUrl 拼起來，變成 http://localhost:8080/user/login 之類的
    // return this.http.get(this.baseUrl + url, { withCredentials: true });
    return this.http.get(`${this.baseUrl}/${url}`, { withCredentials: true });
  }

  // 4. POST 方法 (用大括號包起來 { })
  postApi(url: string, postData: any): Observable<any> {
    // 這裡會組合成 http://localhost:8080/api/quiz/create
    // return this.http.post(this.baseUrl + url, postData, { withCredentials: true });
    return this.http.post(`${this.baseUrl}/${url}`, postData, { withCredentials: true });
  }

  // api.service.ts
  saveQuestionnaire(data: any): Observable<any> {
    // 將整份 questionData 物件 POST 到後端 API
    // 路徑假設為 http://localhost:8080/api/questionnaire
    return this.http.post(`${this.baseUrl}/api/questionnaire`, data);
  }

}
