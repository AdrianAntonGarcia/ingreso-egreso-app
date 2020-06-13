import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubsciption: Subscription;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.uiSubsciption = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
      // console.log('Cargando subs');
    });
  }
  ngOnDestroy(): void {
    /**
     * SUPER IMPORTANTE:
     * Borrar la subscripción cuando salimos de la página
     */
    this.uiSubsciption.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) { return; }

    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });
    const { email, password } = this.loginForm.value;
    this.auth.loginUsuario(email, password).then(credenciales => {
      // console.log(credenciales);
      // Swal.close();
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['']);
    }).catch(error => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error'
      });
    });
  }
}
