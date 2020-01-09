import { Advogado } from "./../advogado";
import { Processo } from 'src/app/processos/processo';

export interface ResultadoPaginado {
  page: { size: number; totalElements: number; totalPages: number; number: number };
  _embedded: { advogados: Advogado[] };
}

export interface ResultadoPaginadoProcesso {
  page: { size: number; totalElements: number; totalPages: number; number: number };
  _embedded: { processos: Processo[] };
}