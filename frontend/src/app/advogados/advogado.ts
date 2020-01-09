export interface Advogado {
  nome: string;
  email: string;
  oab: string;
  telefone: string;

  _links? :{
    self: {href:string},
    processos: {href:string}
  }
}
