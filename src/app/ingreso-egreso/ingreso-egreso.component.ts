import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as uiActions from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';

  cargando: boolean = false;
  subscripcion: Subscription;

  constructor(private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>) {

  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }

  ngOnInit(): void {
    this.subscripcion = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });
  }

  guardar() {

    if (this.ingresoForm.invalid) { return; }
    this.store.dispatch(uiActions.isLoading());
    console.log(this.ingresoForm.valid);
    console.log(this.tipo);
    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then((ref) => {
      this.ingresoForm.reset();
      this.store.dispatch(uiActions.stopLoading());
      Swal.fire('Registro creado', descripcion, 'success');
    }).catch(err => {
      Swal.fire('Error', err.message, 'error');
      this.store.dispatch(uiActions.stopLoading());
    });
  }

}
