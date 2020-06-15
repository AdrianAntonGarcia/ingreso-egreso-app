import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  usuario: Usuario;
  subsUsuario: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.subsUsuario = this.store.select('user').pipe(filter(({ user }) => user != null)).subscribe(({ user }) => {
      this.usuario = { ...user };
    });

  }

  ngOnDestroy(): void {
    this.subsUsuario.unsubscribe();
  }

  logout() {
    Swal.fire({
      title: 'Cerrando sesión',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
    this.authService.logout().then(() => {
      Swal.close();
      this.router.navigate(['/login']);
    });

  }
}
