import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AdvogadosRoutingModule } from './advogados-routing.module';
import { MaterialUiModule } from "../material-ui.module";
import { CadastroComponent } from './cadastro/cadastro.component';


@NgModule({
  declarations: [CadastroComponent],
  imports: [
    CommonModule,
    AdvogadosRoutingModule,
    FormsModule,
    HttpClientModule,
    MaterialUiModule
  ]
})
export class AdvogadosModule { }
