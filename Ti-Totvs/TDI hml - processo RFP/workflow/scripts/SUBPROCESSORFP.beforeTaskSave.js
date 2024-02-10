function beforeTaskSave(colleagueId, nextSequenceId, userList) {

    var usuario = getValue('WKUser');
    var numSolicitacao = getValue("WKNumProces");
    var resposta = hAPI.getCardValue('resposta');
    var retorno = hAPI.getCardValue('retorno');
    var mensagem = resposta + ": " + retorno;
    var RepostaESN = hAPI.getCardValue('RepostaESN');

    if (nextSequenceId == 11) {
        hAPI.setTaskComments(usuario, numSolicitacao, 0, mensagem);
        
    }

    if (nextSequenceId == 8) {
        mensagem = RepostaESN;
        hAPI.setTaskComments(usuario, numSolicitacao, 0, mensagem);
    }
}