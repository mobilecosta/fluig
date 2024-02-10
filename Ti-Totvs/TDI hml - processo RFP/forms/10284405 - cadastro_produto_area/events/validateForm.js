function validateForm(form){

    if (form.getValue("produto") == ''){
        throw "Digite o nome do Produto! "
    }
    if (form.getValue("Area") == ''){
        throw "Digite o nome da Área! "
    }
    if (form.getValue("idGrupo") == ''){
        throw "Selecione o Grupo responsável! "
    }
    
}