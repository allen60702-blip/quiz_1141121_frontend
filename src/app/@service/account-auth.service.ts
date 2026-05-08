import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountAuthService {

  constructor() {
    // 初始化時從 localStorage 嘗試讀取舊有資訊
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  // 使用 Angular 17+ 的 Signal 來管理登入狀態，讓 UI 能夠即時反應
  currentUser = signal<{ name: string; isAdmin: boolean } | null>(null);

  // 登入成功後存入狀態
  setUser(name: string, isAdmin: boolean) {
    const user = { name, isAdmin };
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // 登出清空狀態
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  // 檢查是否為管理員
  get isAdmin(): boolean {
    return this.currentUser()?.isAdmin || false;
  }

  // 檢查是否已登入
  get isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

}
