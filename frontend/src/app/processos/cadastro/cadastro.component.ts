import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { map, filter } from 'rxjs/operators';

import { Processo } from '../processo';
import { Advogado } from 'src/app/advogados/advogado';
import { ProcessoService } from '../processo.service';
import { DataSourceTabela } from 'src/app/advogados/cadastro/datasource.tabela';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  processo: Processo = {numero: '', descricao: ''};
  advogado: Advogado;

  @ViewChild("formulario", {static: true}) formulario: NgForm;
  
  exibirSpinner: boolean;
  paginaAtual: number = 0;
  tamanhoPagina: number = 10;
  totalDeProcessos: number = 0;
  dataSource = new DataSourceTabela<Processo>();
  colunas: string[] = ["numero", "descricao", "editar", "excluir"];

  filtroNumero: string;
  filtrarPorNumero = false;
  filtroDescricao: string;
  filtrarPorDescricao=false;



  constructor(private processoService: ProcessoService, public router: Router) { 
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      this.advogado = navigation.extras.state.data;
      this.atualizarListaDeProcessos({});
    } else {
      router.navigate(['/']);
    }
  }                

  isModoEdicao(): boolean {
    return Boolean("_links" in this.processo && this.processo._links.self && this.processo._links.self.href);
  }

  resetarFormulario(): void {
    if (this.formulario) {
      this.formulario.resetForm();
      this.processo = { numero:"",descricao:"" };
    }
  }

  atualizarListaDeProcessos({ pageIndex: pagina = 0, pageSize: tamanhoPagina = this.tamanhoPagina }) {
    this.exibirSpinner = true;

    return this.processoService.listar(pagina, tamanhoPagina, this.advogado, this.filtroNumero, this.filtroDescricao).
    subscribe(
      resultadoPaginado => {
        if (resultadoPaginado.page) {
          this.totalDeProcessos = resultadoPaginado.page.totalElements;
          this.tamanhoPagina = resultadoPaginado.page.size;
          this.paginaAtual = resultadoPaginado.page.number;
        } else {
          this.totalDeProcessos = 0;
          this.tamanhoPagina = 0;
          this.paginaAtual = 0;
        }
        this.dataSource.atualizarDados(resultadoPaginado._embedded.processos);
        this.exibirSpinner = false;
      },
      erro => {
        this.exibirSpinner = false;
        alert(erro.message);
        if (erro.forcarNovaAutenticacao) this.router.navigate(["/login"]);
      }
    );
  }

  salvarProcessos(evento): void {
    evento.preventDefault();
    this.exibirSpinner = true;

    this.processoService.salvar(this.advogado, this.processo).subscribe(
      response => {
        this.exibirSpinner = false;
        if (response.ok) {
          if (this.isModoEdicao()) alert("Processo atualizado com sucesso");
          else alert("Processo salvo com sucesso");

          this.atualizarListaDeProcessos({
            pageIndex: this.isModoEdicao() ? this.paginaAtual : 0,
            pageSize: this.tamanhoPagina
          });
          this.resetarFormulario();
        }
      },
      httpErrorResponse => {
        this.exibirSpinner = false;
        console.log(httpErrorResponse);

        switch (httpErrorResponse.status) {
          case 0:
            alert("Não foi possível enviar requisição: verifique conexão da sua máquina");
            break;
          case 403:
            alert(httpErrorResponse.message);
            if (httpErrorResponse.forcarNovaAutenticacao) {
              this.router.navigate(["/login"]);
              return;
            }
            break;
          case 412:
            let msg = "Erro de validação: ";
            for (const key in httpErrorResponse.error) msg += httpErrorResponse.error[key];
            alert(msg);
            break;
          case 500:
            alert(httpErrorResponse.error.message);
          default:
        }
      }
    );
  }

  limparFiltroNumero(): void{
    this.filtrarPorNumero = false;  
    this.filtroNumero ='';
    this.atualizarListaDeProcessos({});
  }
  
  limparFiltroPorDescricao():void{
    this.filtrarPorDescricao=false;
    this.filtroDescricao='';
    this.atualizarListaDeProcessos({});
  }

  editar(processo: Processo): void {
    this.limparFiltroNumero();
    this.limparFiltroPorDescricao();
    this.processo = { ... processo };
  }

  excluir(processo: Processo): void {
    const msg = `Deseja realmente excluir ${processo.numero}?`;
    const resposta = confirm(msg);
    if (resposta) {
      this.processoService
        .excluir(processo)
        .subscribe(
          () => {
            alert("Processo excluído com sucesso");
            this.atualizarListaDeProcessos({
              pageIndex: this.paginaAtual,
              pageSize: this.tamanhoPagina
            });
          },
          erro => {
            console.log(erro);
            alert(erro.message);
          }
        );
    }
  }

}
