export interface Processo{
    numero:string;
    descricao:string;
    _links?:{
        self: {href:string}
    }
}
