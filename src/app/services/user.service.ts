import { Injectable } from '@angular/core';
import { User } from "./user";
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
    constructor() {}
    // Set data on localStorage
    setUserLoggedIn(users: User) {
      localStorage.setItem('users', JSON.stringify(users));
      console.log('saved on localStorage');
    }
    // get data on localStorage
    getUserLoggedIn() {
      if (localStorage.getItem('users')) {
        JSON.parse(localStorage.getItem('users'));
      } else {
        console.log('localStorage empty');
      }
    }
    // Optional: clear localStorage
    clearLocalStorage() {
      localStorage.clear();
    }
  }