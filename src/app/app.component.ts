import { Component, OnDestroy, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export interface ProfileModel {
  Id: string,
  DisplayName: string,
  EmailAddress: string,
  PhoneNumber: string
}
export interface CurrentUser {
  uid: string;
  name?: string;
  email?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'test-auth';
  currentUser: CurrentUser | null = null;
  profilesArray: ProfileModel[] = [];
  fb: firebase.app.App;
  fs: firebase.firestore.Firestore;
  profilesCollection: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  unsubscribe?: firebase.Unsubscribe;

  constructor () {
    this.fb = firebase.initializeApp({
      apiKey: "AIzaSyBvTZXXTOjuPFv6km2HtzCW0Uzdvu-ZHc0",
      authDomain: "econymleaguemaster.firebaseapp.com",
      databaseURL: "https://econymleaguemaster.firebaseio.com",
      projectId: "econymleaguemaster",
      storageBucket: "econymleaguemaster.appspot.com",
      messagingSenderId: "266752641992",
      appId: "1:266752641992:web:b6d61a93658af48b40cefd",
      measurementId: "G-GGNJKKP985"  
    });
    this.fs = firebase.firestore();
    this.profilesCollection = this.fs.collection('UserProfiles');
  }

  ngOnDestroy():void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  ngOnInit():void {
    this.unsubscribe = this.fb.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        this.currentUser = {
          uid: authUser.uid,
          name: authUser.displayName ? authUser.displayName : '',
          email: authUser.email ? authUser.email : ''
        };
        this.profilesArray = [];
        this.profilesCollection.get().then(qSnap => {
          qSnap.forEach(doc => {
            this.profilesArray.push({
              Id: doc.id,
              DisplayName: doc.get('DisplayName'),
              EmailAddress: doc.get('EmailAddress'),
              PhoneNumber: doc.get('PhoneNumber')
            });
          });
        });
      } else {
        this.currentUser = null;
      }  
    });
  }

  signIn(): void {
    this.fb.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut(): void {
    this.fb.auth().signOut();
  }
}
