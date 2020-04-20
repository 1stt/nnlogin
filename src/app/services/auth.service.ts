import { NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { User } from "./user";
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
// import { AlertService } from 'src/app/shareds/services/alert.service';
import { UserService } from 'src/app/services/user.service';
import { AngularFireObject, AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>;
  users: User;
  authState: any;
  userRef: AngularFireObject<any>;

  constructor(
    // public afs: AngularFirestore, 
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    private db: AngularFireDatabase,
    public userservice: UserService,
    private ngZone:NgZone
    // private alert: AlertService
    ) {

      this.checkLocalStorage();
      this.afAuth.authState.subscribe((auth) => {
        // if (auth) {
          this.authState = auth
      //     // console.log(auth)
      //     localStorage.setItem('user', JSON.stringify(auth));
      //     JSON.parse(localStorage.getItem('user'));
      //     // console.log(JSON.parse(localStorage.getItem('user')))
      // } else {
      //   localStorage.setItem('user', null);
      //   JSON.parse(localStorage.getItem('user'));
      // }
        });
      

    }
  


    checkLocalStorage() {
      if (!localStorage.getItem('users')) {
        console.log("users")
        this.getDataFromFirebase();
      } else {
        console.log(localStorage);
        console.log('localStorage ready!');
      }
    }


    getDataFromFirebase() {
      this.afAuth.authState.subscribe(auth => {
        if (auth) {
          this.users = auth; // save data firebase on user
          console.log('Authenticated');
          this.userservice.setUserLoggedIn(this.users); // set user data from firebase on local storage
        } else {
          console.log('Not authenticated');
        }
      });
    }



  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    // const auth = this.userservice.getUserLoggedIn(this.users);
    const auth = JSON.parse(localStorage.getItem('users'));
    // user.emailVerified =
    console.log(auth)
    return (auth !== null && auth.emailVerified !== false ) ? true : false;
  }


   /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(auth) {
    // const path =`DetailUser/${this.currentUserId}`;
    const userRef: AngularFireObject<any> = this.db.object(`DetailUser/${auth.uid}`);
    const authState: User = {
      uid: auth.uid,
      email: auth.email,
      // username: auth.displayName,
      emailVerified: auth.emailVerified
    } 
    // const setUser = userRef.set(authState)
    // console.log(authState)
    // return setUser
    console.log(authState)
    return userRef.set(authState)
  }


  get authenticated(): boolean {
      return this.authState !== null;
    }

  get currentUserId(): string {
      return this.authenticated ? this.authState.uid : '';
    }

  getCurrentLoggedIn() {
      this.afAuth.authState.subscribe(auth => {
        if (auth) {
          // this.ngZone.run(()=>this.navigateTo('membercreate'));
        }
      });
    }

    //ดึง user ในฐานข้อมูลของ authenfirebase มาเพื่อเช็คในการ login
    login(email: string, password: string) {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
              this.authState = user
              this.updateUserData()
              // this.checkLocalStorage();
              this.ngZone.run(()=>this.navigateTo('membercreate'));
              // this.SetUserData(user.user);
              console.log("xxxxxxxxxxxxxxxxxxx")
            })
            
        .catch(err => {
          console.log('Something went wrong:',err.message);
          window.alert("ไม่มีผู้ใช้นี้ในระบบหรือรหัสผ่านไม่ถูกต้อง")
          // window.alert(err.message)
          // this.ngZone.run(()=>this.navigateTo('reg'));
        });
    }


    signup(email: string, password: string) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      // .then((user) => {
      //   this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
              this.authState = user
              this.SendVerificationMail();
              this.SetUserData(user.user);
              this.updateUserData()
              
              // this.SetUserData(user.user); // add as parameter also!
              // this.ngZone.run(()=>this.navigateTo('membercreate'));
              console.log("yyyyyyyyyy")

            })
        .catch(err => {
          console.log('Something went wrong:',err.message);
          this.ngZone.run(()=>this.navigateTo('reg'));
          // this.alert.notify('ไม่มีผู้ใช้นี้ในระบบ','info');
        });
      // })
      // .catch(error => console.log(error));
  }

// pushUserData() {
//     const path =`DetailUser/${this.currentUserId}`;
//     const user = firebase.auth().currentUser;
  
//     const data = {
//       uid: user.uid,
//       email: user.email,
//       // username: user.username,
//       // photoURL: user.photoURL,
//       emailVerified: user.emailVerified
//       // email: this.authState.email,
//       // name: this.authState.username,
//       // uid: this.authState.uid,
//     }
//     this.db.list(path).push(data)
//       .catch(error => console.log(error));
//   }


    //create user ที่ register เช้ามา
  //   signup(email: string, password: string) {
  //     return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  //     .then((user) => {
  //       this.afAuth.auth.signInWithEmailAndPassword(email, password)
  //       .then((user) => {
  //             this.authState = user
  //             this.ngZone.run(()=>this.navigateTo('membercreate'));
  //             console.log("xxxxxxxxxxxxxxxxxxx")
  //             // this.alert.notify('เข้าสู่ระบบ','info');
  //           })
  //       .catch(err => {
  //         console.log('Something went wrong:',err.message);
  //         // this.router.navigate(['reg']);
  //         this.ngZone.run(()=>this.navigateTo('reg'));
  //         // this.alert.notify('ไม่มีผู้ใช้นี้ในระบบ','info');
  //       });
  //     })
  //     .catch(error => console.log(error));
  // }




//   signup(email: string, password: string) {
//     return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
//     // .then((user) => {
//     //   this.afAuth.auth.signInWithEmailAndPassword(email, password)
//       .then((user) => {
//             this.authState = user
//             this.SendVerificationMail();
//             // this.SetUserData(user.user); // add as parameter also!
//             // this.ngZone.run(()=>this.navigateTo('membercreate'));
//             console.log("yyyyyyyyyy")
//             // this.alert.notify('เข้าสู่ระบบ','info');
//           })
//       .catch(err => {
//         console.log('Something went wrong:',err.message);
//         this.ngZone.run(()=>this.navigateTo('reg'));
//         // this.alert.notify('ไม่มีผู้ใช้นี้ในระบบ','info');
//       });
//     // })
//     // .catch(error => console.log(error));
// }




  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.ngZone.run(()=>this.navigateTo('verify-email-address'));
      console.log("ยืนยันนนนนนอีเมลลล")
    })
  }


  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      console.log(passwordResetEmail)
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }


  //ใช้ในการ router link ไปหน้าอื่นตาม url ที่ใส่ในวงเล็บ
  navigateTo(url){
    this.router.navigate([url]);
}


addDetailUser(data) {
  const userRef: AngularFireObject<any> = this.db.object(`DetailUser/${firebase.auth().currentUser.uid}`);
  console.log("ใส่ข้อมูลที่กรอกลงในดาต้าเบสสสสสสส")
  // const users = firebase.auth().currentUser;
  console.log("ใส่ uid เข้าไป")
  // this.detailList.push(users.uid);
  console.log("ยังไม่ได้จ้าาา")
  return this.userRef.update(data);
  
}


  private updateUserData(): void {
    // const path =`DetailUser/${this.currentUserId}`;
    const path =`DetailUser/${firebase.auth().currentUser.uid}`;
     // Endpoint on firebase  this.router.navigate(['auth',`/editWiki/${data.key}`]);
    const userRef: AngularFireObject<any> = this.db.object(path);
    const user = firebase.auth().currentUser;
    const User = {
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          emailVerified: user.emailVerified
        } 
    // const data = {
    //   uid: user.uid,
    //   email: user.email,
    //   displayName: user.displayName,
    //   // photoURL: user.photoURL,
    //   emailVerified: user.emailVerified
    //   // email: this.authState.email,
    //   // name: this.authState.username,
    //   // uid: this.authState.uid,
    // }
    console.log(User)
  userRef.update(User)
      .catch(error => console.log(error));
      this.userservice.setUserLoggedIn(User)
      console.log("ทำงานแล้วจ้า")
  }

  signOut() {
    return this.afAuth.auth.signOut().then(() => {
      this.userservice.clearLocalStorage();
      // localStorage.removeItem('users');
      this.ngZone.run(()=>this.navigateTo('login'));
      // window.location.reload()
    })
  }


}
