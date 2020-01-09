import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProcessosRoutingModule } from './processos-routing.module';
import { CadastroComponent } from './cadastro/cadastro.component';
import { MaterialUiModule } from '../material-ui.module';


@NgModule({
  declarations: [CadastroComponent],
  imports: [
    CommonModule,
    ProcessosRoutingModule,
    MaterialUiModule,
    FormsModule
  ]
})
export class ProcessosModule { }
