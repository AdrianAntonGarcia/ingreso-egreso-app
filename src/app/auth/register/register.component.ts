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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  subscripcion: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.subscripcion = this.store.select('ui').subscribe((uis) => {
      this.cargando = uis.isLoading;
    });
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

  crearUsuario() {
    if (this.registroForm.invalid) { return; }

    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });
    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password).then(credenciales => {
      console.log(credenciales);
      this.store.dispatch(ui.stopLoading());
      // Swal.close();
      this.router.navigate(['/']);
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
