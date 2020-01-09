package br.jus.trt22.trt22backend.repositorio;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import br.jus.trt22.trt22backend.modelo.Advogado;
import br.jus.trt22.trt22backend.modelo.Processo;

@RepositoryRestResource(path = "processos", collectionResourceRel = "processos")
@Repository
public interface ProcessoRepository extends PagingAndSortingRepository<Processo, Long> {

    Page<Processo> findByNumeroContainingAndDescricaoIgnoreCaseContainingAndAdvogado(String numero, String descricao, Advogado advogado, Pageable pageable);
    Page<Processo> findByNumeroContainingAndAdvogado(String numero, Advogado advogado, Pageable pageable);
    Page<Processo> findByDescricaoIgnoreCaseContainingAndAdvogado(String descricao, Advogado advogado, Pageable pageable);

}