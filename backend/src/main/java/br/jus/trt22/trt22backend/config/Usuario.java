package br.jus.trt22.trt22backend.config;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;

/**
 * Usuario
 * 
 */
public class Usuario {

    private String nome;
    private String email;
    private List<GrantedAuthority> papeis;

    /**
     * @return the nome
     */
    public String getNome() {
        return nome;
    }

    /**
     * @param nome the nome to set
     */
    public void setNome(String nome) {
        this.nome = nome;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the papeis
     */
    public List<GrantedAuthority> getPapeis() {
        return papeis;
    }

    /**
     * @param papeis the papeis to set
     */
    public void setPapeis(List<GrantedAuthority> papeis) {
        this.papeis = papeis;
    }

    /**
     * @return the isAdmin
     */
    public boolean isAdmin() {
        return this.papeis != null && this.papeis.stream()
                .filter(auth -> auth.getAuthority().equals("TRT22-DEMO-ADMIN")).findFirst().isPresent();
    }

}