import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export enum DialogType {
  CONFIRMACAO, ALERTA
}
export interface DialogData {
  mensagem: string;
  titulo: string;
  tipo: DialogType;
}

@Component({
  selector: 'app-msg-box',
  templateUrl: './msg-box.component.html',
  styleUrls: ['./msg-box.component.css']
})
export class MsgBoxComponent implements OnInit {

  mensagem: string;
  titulo: string;
  tipo: DialogType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.mensagem = data.mensagem;
    this.titulo = data.titulo;
    this.tipo = data.tipo;
  }

  isDialogoConfirmacao(): boolean{
    return this.tipo === DialogType.CONFIRMACAO;
  }

  ngOnInit() {
  }

}
