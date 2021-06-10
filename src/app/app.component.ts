import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularFire Test';
  profiles: Observable<any[]> | undefined;

  constructor (
    public auth: AngularFireAuth,
    private firestore: AngularFirestore
  ){
    this.auth.onAuthStateChanged(authUser => {
      console.log('AngularFireAuth::onAuthStateChanged() ENTER');
      if (authUser) {
        console.log('authUser is present - authUser.uid =', authUser.uid);
        this.profiles = firestore.collection('UserProfiles').valueChanges();
      } else {
        console.log('authUser is NOT present');
        this.profiles = undefined;
      }
      console.log('AngularFireAuth::onAuthStateChanged() EXIT');
    });
  }

  signIn():void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut():void {
    this.auth.signOut();
  }
}
