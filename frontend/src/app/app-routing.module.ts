import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './seguranca/auth.guard';
import { LoginComponent } from './seguranca/login/login.component';

// rotas
const routes: Routes = [
  {
    path: '',
    redirectTo: 'advogados',
    pathMatch: 'prefix'
  },
  {
    canActivate: [AuthGuard],
    path: 'processos',
    loadChildren: () => import('./processos/processos.module')
      .then(m => m.ProcessosModule)
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'advogados',
    canActivate: [AuthGuard],
    loadChildren: () => import('./advogados/advogados.module')
      .then(m => m.AdvogadosModule)

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
