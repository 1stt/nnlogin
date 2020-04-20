import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class RegService {
  
  detailList:AngularFireList<any>;


  constructor( 
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    public auth: AuthService,) { 
      
    // this.detailList = db.list('DetailUser');
    // ยังไม่ได้ register เลยยังไม่มี uid อยู่ที่ DetailUser ของ database มันเลยหา uid ไม่เจอก็เลยต้องเอา function adddetail ไปใส่ที่ singup ใน authenservice หลังจากที่ updatedatauser ลง database แล้ว
    this.detailList = db.list(`DetailUser/${firebase.auth().currentUser.uid}`);

  }

   //Detailuser//
   getDetailuserList(): Observable<any[]> {
    return this.detailList.snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    });
  }

  getDetailUser(id): Observable<any> {
    return this.db.object('DetailUser/' + id).snapshotChanges().map(res => {
      return res.payload.val();
    });
  }

  addDetailUser(data) {
    console.log("ใส่ข้อมูลที่กรอกลงในดาต้าเบสสสสสสส")
    // const users = firebase.auth().currentUser;
    console.log("ใส่ uid เข้าไป")
    // this.detailList.push(users.uid);
    console.log("ยังไม่ได้จ้าาา")
    return this.detailList.push(data);
    
  }

   removeDetailUser(id): void {
    this.detailList.remove(id);
  }

  editDetailUser(id, data) {
    return this.detailList.update(id, data);
  }

}
