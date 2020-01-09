import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, mapTo, catchError, delay } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Usuario } from "./usuario";
import { AccessTokenPayload } from "./access_token";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  static ACCESS_TOKEN = "access_token";
  static REFRESH_TOKEN = "refresh_token";

  constructor(private http: HttpClient) {}

  isLogado(): boolean {
    return this.accessToken != null;
  }

  get accessToken(): string {
    return window.localStorage.getItem(LoginService.ACCESS_TOKEN);
  }

  get accessTokenPayload(): AccessTokenPayload {
    if (this.isLogado()) {
      const accessToken = window.localStorage.getItem(LoginService.ACCESS_TOKEN);
      var base64EncodedPayload = accessToken.split(".")[1];
      base64EncodedPayload = base64EncodedPayload.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64EncodedPayload));

      return (({ exp, iat, typ: tipo }) => ({
        validade: new Date(exp * 1000),
        emissao: new Date(iat * 1000),
        tipo
      }))(payload);
    } else return null;
  }

  getUsuarioLogado(): Usuario {
    if (this.isLogado()) {
      const accessToken = window.localStorage.getItem(LoginService.ACCESS_TOKEN);
      var base64EncodedPayload = accessToken.split(".")[1];
      base64EncodedPayload = base64EncodedPayload.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64EncodedPayload));
      return (({
        exp: validadeToken,
        given_name: nome,
        email,
        resource_access: {
          account: { roles: papeis }
        }
      }) => ({ validadeToken, nome, email, papeis }))(payload);
    } else return null;
  }

  autenticar(usuario: string, senha: string): Observable<boolean> {
    const params = new HttpParams()
      .set("grant_type", "password")
      .set("client_id", environment.client_id)
      .set("username", usuario)
      .set("password", senha)
      .toString();

    return this.http
      .post(environment.keycloak_backend, params, {
        observe: "response",
        headers: new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded" })
      })
      .pipe(
        tap(res => {
          if (res.ok) {
            const body = res.body;
            window.localStorage.setItem(LoginService.ACCESS_TOKEN, body["access_token"]);
            window.localStorage.setItem(LoginService.REFRESH_TOKEN, body["refresh_token"]);
          }
        }),
        map(res => res.ok)
      );
  }

  atualizarToken(): Observable<any> {
    const params = new HttpParams()
      .set("client_id", environment.client_id)
      .set("grant_type", "refresh_token")
      .set("refresh_token", window.localStorage.getItem(LoginService.REFRESH_TOKEN))
      .toString();

    console.log("atualizando token ...");
    return this.http
      .post(environment.keycloak_backend, params, {
        observe: "response",
        headers: new HttpHeaders({ "content-type": "application/x-www-form-urlencoded" })
      })
      .pipe(
        catchError(error => {
          console.log("Erro em login.service#atualizarToken");
          console.dir(error);
          this.logoff();
          return throwError({
            ok: false,
            status: 403,
            message: "Sessão expirada. Necessário autenticar novamente!",
            forcarNovaAutenticacao: true
          });
        }),
        tap(response => {
          if (response.ok) {
            const body = response.body;
            window.localStorage.setItem(LoginService.ACCESS_TOKEN, body[LoginService.ACCESS_TOKEN]);
            window.localStorage.setItem(LoginService.REFRESH_TOKEN, body[LoginService.REFRESH_TOKEN]);
            console.log("access token atualizado");
          }
        })
      );
  }

  logoff(): void {
    window.localStorage.removeItem(LoginService.ACCESS_TOKEN);
    window.localStorage.removeItem(LoginService.REFRESH_TOKEN);
  }
}
