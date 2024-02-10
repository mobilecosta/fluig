function enableFields(form){
    var atividadeAtual = getValue("WKNumState");

    if(atividadeAtual == 5){
        form.setEnabled("nomeUsuario", false);
        form.setEnabled("motivo", false);
        form.setEnabled("acesso", false);
        form.setEnabled("outros", false);
        form.setEnabled("justificativa", false);
    };

    if(atividadeAtual == 12){
        form.setEnabled("nomeUsuario", false);
        form.setEnabled("motivo", false);
        form.setEnabled("acesso", false);
        form.setEnabled("outros", false);
        form.setEnabled("justificativa", false);
        form.setEnabled("aprovacao", false);
        form.setEnabled("obs", false);
    }
}