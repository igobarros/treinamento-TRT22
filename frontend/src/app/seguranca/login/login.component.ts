import { Component, OnInit } from "@angular/core";
import { LoginService } from "../login.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  usuario: string;
  senha: string;
  credenciaisInvalidas = false;
  exibirBarraDeProgresso = false;

  constructor(private loginService: LoginService, private router: Router) {}

  autenticar(): void {
    this.credenciaisInvalidas = false;
    this.exibirBarraDeProgresso = true;

    this.loginService.autenticar(this.usuario, this.senha).subscribe(
      res => {
        this.exibirBarraDeProgresso = false;
        this.router.navigate(["/advogados"]);
      },
      error => {
        this.exibirBarraDeProgresso = false;
        this.credenciaisInvalidas = true;
      }
    );
  }
}
