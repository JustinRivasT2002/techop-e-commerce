import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user.interfaces';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  emailReceived: string = ''; // Email recibido desde los formularios
  passwordReceived: string = ''; // Password recibido desde los formularios
  emailForReset: string = ''; // Email de reset
  currentYear: number = new Date().getFullYear(); // Año actual para el footer

  isSignUp: boolean = true; // Flag para alternar entre formulario de registro e inicio de sesión
  showResetPasswordForm: boolean = false; // Flag para mostrar u ocultar formulario de restablecimiento

  // Objeto de usuario enlazado a los formularios
  userData: User = {
    email: '',
    password: '',
  };

  errorMessage: string = ''; // Mensaje de error a mostrar en la interfaz

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Selección de elementos del DOM para manejar animaciones de formulario
    const wrapper = document.querySelector('.wrapper');
    const signUpLink = document.querySelector('.signUp-link');
    const signInLink = document.querySelector('.signIn-link');

    // Evento para animar el formulario al pasar a "Sign Up"
    signUpLink?.addEventListener('click', (event) => {
      event.preventDefault(); // Evita que se recargue la página
      wrapper?.classList.add('animate-signIn');
      wrapper?.classList.remove('animate-signUp');
    });

    // Evento para animar el formulario al pasar a "Sign In"
    signInLink?.addEventListener('click', (event) => {
      event.preventDefault();
      wrapper?.classList.add('animate-signUp');
      wrapper?.classList.remove('animate-signIn');
    });
  }

  onSubmit() {
    const isSignInFormVisible = document.querySelector('.form-wrapper.sign-in')?.classList.contains('active'); // Verificar si estamos en el formulario de inicio de sesión o registro

    const authMethod = isSignInFormVisible ? this.authService.login : this.authService.signUp;

    authMethod.call(this.authService, this.userData)
      .then(() => {
        console.log(isSignInFormVisible ? 'Usuario autenticado con éxito' : 'Usuario registrado con éxito');
        this.clearForm();
        this.router.navigate(['/profile']);
      })
      .catch((error) => {
        console.error('Error en la autenticación', error);
        this.showError('Error al procesar la solicitud. Intente nuevamente.');
      });
  }

  // Registro de nuevo usuario
  onSubmitSignUp() {
    if(!this.userData.email || !this.userData.email) {
      this.showError('Uno o todos los campos de registro estan vacios. Intente nuevamente.');
    }else {
      this.authService.signUp(this.userData)
      .then(() => {
        console.log('Usuario registrado con éxito');
        this.clearForm();
        this.router.navigate(['/profile']);
      })
      .catch(error => {
        console.error('Error en el registro', error);
        this.showError('Este usuario ha sido registrado. Intente nuevamente.');
      });
    }
  }

  // Solicitar restablecimiento de contraseña
  onResetPassword() {
    if (!this.emailForReset) {
      this.showError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    this.authService.resetPassword(this.emailForReset)
      .then(() => {
        console.log('Correo de restablecimiento enviado.');
        this.showError('Te hemos enviado un correo para restablecer tu contraseña.');
      })
      .catch((error) => {
        console.error('Error al enviar el correo de restablecimiento', error);
        this.showError('Error al enviar el correo de restablecimiento. Intenta nuevamente.');
      });
  }

  // Alternar visibilidad del formulario de recuperación de contraseña
  toggleFormResetPassword(event: Event, showReset: boolean) {
    event.preventDefault();
    this.clearForm();
    this.isSignUp = false;
    this.showResetPasswordForm = showReset;
  }

  // Inicio de sesión de usuario
  onSubmitLogin() {
    this.authService.login(this.userData)
      .then(() => {
        console.log('Usuario autenticado con éxito');
        this.clearForm();
        this.router.navigate(['/profile']);
      })
      .catch(error => {
        console.error('Error al iniciar sesión', error);
        this.showError('Credenciales incorrectas. Verifique su correo y contraseña.');
      });
  }

  // Inicio de sesión con Google
  signInWithGoogle() {
    this.authService.logInGoogle()
    .then(() => {
      console.log('Inicio de sesión con Google exitoso');
      this.clearForm();
      this.router.navigate(['/profile']);
    })
    .catch((error) => {
      console.error('Error al iniciar sesión con Google', error);
    });
  }

  // Alternar entre los formularios de inicio y registro
  toggleForm(event: Event, isSignUp: boolean) {
    event.preventDefault();
    this.isSignUp = isSignUp;
    const wrapper = document.querySelector('.wrapper');
    if (this.isSignUp) {
      wrapper?.classList.add('animate-signIn');
      wrapper?.classList.remove('animate-signUp');
    } else {
      this.showResetPasswordForm = false;
      wrapper?.classList.add('animate-signUp');
      wrapper?.classList.remove('animate-signIn');
    }
  }

  // Mostrar mensaje de error durante unos segundos
  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  // Limpiar los campos del formulario
  clearForm() {
    this.userData.email = '';
    this.userData.password = '';
    this.emailForReset = '';
  }
}
