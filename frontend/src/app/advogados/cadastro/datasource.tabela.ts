import { MatTableDataSource } from "@angular/material/table";
import { Advogado } from "../advogado";
import { BehaviorSubject, of, Observable } from "rxjs";

export class DataSourceTabela<T> extends MatTableDataSource<T> {
  private subject = new BehaviorSubject<T[]>([]);

  connect(): BehaviorSubject<T[]> {
    return this.subject;
  }

  disconnect(): void {
    this.subject.complete();
  }

  atualizarDados(advogados: T[]) {
    this.subject.next(advogados);
  }
}
