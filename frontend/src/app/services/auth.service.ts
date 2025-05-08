import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { firebaseConfig } from '../../environments/firebase-config';
import { User } from '../interfaces/user.interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = getAuth(initializeApp(firebaseConfig));

  constructor(private http: HttpClient) {}

  signUp(user: User) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then((userCredential) => {
        // Llamada al backend para registrar al usuario y enviar el correo de bienvenida
        this.sendWelcomeEmail(user.email);
        return userCredential;
      })
      .catch((error) => {
        console.error('Error al registrarse:', error.message);
        throw error;
      });
  }

  login(user: User) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  logInGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logLogout() {
    return signOut(this.auth);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  isAuthenticated() {
    const user = this.auth.currentUser;
    return user !== null;
  }

  private sendWelcomeEmail(email: string) {
    this.http.post<{ message: string }>('http://localhost:3000/register', { email: email })
    .subscribe(
      response => {
        console.log('Correo de bienvenida enviado:', response.message);
      },
      error => {
        console.error('Error al enviar el correo:', error);
      }
    );
  }

}
