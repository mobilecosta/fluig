function enableFields(form){ 

    var AtividadeAtual = getValue('WKNumState');
    
    if (AtividadeAtual == 5){
        form.setEnabled("RepostaESN", false);
        form.setEnabled("aprovacaoESN", false);
    }

    if (AtividadeAtual == 11){
        form.setEnabled("resposta", false);
        form.setEnabled("retorno", false);
    }

    


}