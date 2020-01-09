import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Advogado } from "./advogado";
import { ResultadoPaginado } from "./cadastro/resultado.paginado";

@Injectable({
  providedIn: "root"
})
export class AdvogadoService {
  constructor(private http: HttpClient) { }

  salvar(advogado: Advogado): Observable<any> {
    if ("_links" in advogado && advogado._links.self) {
      return this.http.put<void>(advogado._links.self.href, advogado, {
        observe: "response"
      });
    } else {
      return this.http.post<void>(`${environment.backend}/advogados`, advogado, {
        observe: "response"
      });
    }
  }

  listar(pagina: number, tamanhoPagina: number): Observable<ResultadoPaginado> {
    return this.http.get<ResultadoPaginado>(
      `${environment.backend}/advogados?page=${pagina}&size=${tamanhoPagina}&sort=id,desc`
    );
  }

  excluir(advogado: Advogado): Observable<void> {
    return this.http.delete<void>(advogado._links.self.href);
  }
}
