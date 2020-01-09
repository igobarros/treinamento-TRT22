package br.jus.trt22.trt22backend.modelo;

import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

/**
 * Advogado
 */
@Entity
@Table(schema = "public")
public class Advogado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty
    private String nome;
    @Email
    @NotEmpty
    private String email;
    @NotEmpty
    @Pattern(regexp = "([a-zA-Z0-9]{4}\\-[a-zA-Z]{2}$)", message = "O nÂº OAB deve ter o formato [a-zA-Z0-9]{4}-[a-zA-Z]{2}")
    private String oab;
    @NotEmpty
    private String telefone;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="advogado")
    private List<Processo> processos;


    public Advogado() {
    }

    public Advogado(Long id, String nome, String email, String oab, String telefone, List<Processo> processos) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.oab = oab;
        this.telefone = telefone;
        this.processos = processos;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOab() {
        return this.oab;
    }

    public void setOab(String oab) {
        this.oab = oab;
    }

    public String getTelefone() {
        return this.telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public List<Processo> getProcessos() {
        return this.processos;
    }

    public void setProcessos(List<Processo> processos) {
        this.processos = processos;
    }

    public Advogado id(Long id) {
        this.id = id;
        return this;
    }

    public Advogado nome(String nome) {
        this.nome = nome;
        return this;
    }

    public Advogado email(String email) {
        this.email = email;
        return this;
    }

    public Advogado oab(String oab) {
        this.oab = oab;
        return this;
    }

    public Advogado telefone(String telefone) {
        this.telefone = telefone;
        return this;
    }

    public Advogado processos(List<Processo> processos) {
        this.processos = processos;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Advogado)) {
            return false;
        }
        Advogado advogado = (Advogado) o;
        return Objects.equals(id, advogado.id) && Objects.equals(nome, advogado.nome) && Objects.equals(email, advogado.email) && Objects.equals(oab, advogado.oab) && Objects.equals(telefone, advogado.telefone) && Objects.equals(processos, advogado.processos);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, email, oab, telefone, processos);
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", nome='" + getNome() + "'" +
            ", email='" + getEmail() + "'" +
            ", oab='" + getOab() + "'" +
            ", telefone='" + getTelefone() + "'" +
            ", processos='" + getProcessos() + "'" +
            "}";
    }
    
}