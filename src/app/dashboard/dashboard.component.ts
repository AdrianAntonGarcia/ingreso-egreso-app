import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  itemsSubs: Subscription;
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user').pipe(filter(auth => {
      return auth.user != null;
    })).subscribe(({ user }) => {
      // Nos subscribimos a la colección de ingresos y egresos del usuario que se conecta
      this.itemsSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid).subscribe((ingresosEgresosFB => {
        // Cada vez que haya un cambio queremos actualizar el store con la nueva data que viene de firebase
        this.store.dispatch(ingresoEgresoActions.setItems({ items: ingresosEgresosFB }));
      }));
    });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.itemsSubs.unsubscribe();
  }

}
