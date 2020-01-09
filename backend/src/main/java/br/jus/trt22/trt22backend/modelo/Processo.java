package br.jus.trt22.trt22backend.modelo;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Processo
 */
@Entity
public class Processo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private String descricao;

    @ManyToOne
    private Advogado advogado;


    public Processo() {
    }

    public Processo(Long id, String numero, String descricao) {
        this.id = id;
        this.numero = numero;
        this.descricao = descricao;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return this.numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Processo id(Long id) {
        this.id = id;
        return this;
    }

    public Processo numero(String numero) {
        this.numero = numero;
        return this;
    }

    public Processo descricao(String descricao) {
        this.descricao = descricao;
        return this;
    }

    public Advogado getAdvogado() {
        return this.advogado;
    }

    public void setAdvogado(Advogado advogado) {
        this.advogado = advogado;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Processo)) {
            return false;
        }
        Processo processo = (Processo) o;
        return Objects.equals(id, processo.id) && Objects.equals(numero, processo.numero) && Objects.equals(descricao, processo.descricao) && (Objects.equals(advogado, processo.advogado));
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, numero, descricao, advogado);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", numero='" + getNumero() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", advogado='" + getAdvogado() + 
            "}";
    }

}