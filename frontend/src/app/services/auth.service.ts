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

  private auth = getAuth(initializeApp(firebaseConfig)); // Inicializa la app de Firebase y obtiene la instancia de autenticación

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  signUp(user: User) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then((userCredential) => {
        this.sendWelcomeEmail(user.email); // Envia correo de bienvenida tras el registro exitoso
        return userCredential;
      })
      .catch((error) => {
        console.error('Error al registrarse:', error.message); // Manejo de errores en el registro
        throw error;
      });
  }

  // Método para iniciar sesión
  login(user: User) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password); // Inicia sesión con correo y contraseña
  }

  // Método para iniciar sesión con Google
  logInGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // Método para cerrar sesión
  logLogout() {
    return signOut(this.auth);
  }

  // Método para restablecer la contraseña
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  // Metrodo para verificar si el usuario está autenticado
  isAuthenticated() {
    const user = this.auth.currentUser;
    return user !== null;
  }

  // Este método se encarga de enviar un correo de bienvenida al usuario después de registrarse
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
