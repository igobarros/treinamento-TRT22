package br.jus.trt22.trt22backend.repositorio;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import br.jus.trt22.trt22backend.modelo.Advogado;

@RepositoryRestResource(path = "advogados", collectionResourceRel = "advogados")
@Repository
public interface AdvogadoRepository extends PagingAndSortingRepository<Advogado, Long> {

}