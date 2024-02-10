function servicetask64(attempt, message) {
    // ID do registro do formulário
    var documentId = getValue("WKCardId");

    // Dataset de integração
    var dsIntegracao = DatasetFactory.getDataset("ds_protheus_cadastro_fornecedor", null, [
        DatasetFactory.createConstraint("documentId", documentId, null, ConstraintType.MUST)
    ], null);


    log.info("Resultado integração cadastro_fornecedor");
    log.dir(dsIntegracao);

    // Verifica o resultado
    checkResult(dsIntegracao);
}

function updateCardData(field, value) {
    DatasetFactory.getDataset("ds_updateCardData", null, [
        DatasetFactory.createConstraint("cardId", getValue("WKCardId"), null, ConstraintType.MUST),
        DatasetFactory.createConstraint("cardData", value, null, ConstraintType.MUST),
        DatasetFactory.createConstraint("cardField", field, null, ConstraintType.MUST),
        DatasetFactory.createConstraint("companyId", getValue("WKCompany"), null, ConstraintType.MUST)
    ], null);
}

function checkResult(dsIntegracao) {
    var code = dsIntegracao.getValue(0, "Codigo");
    var msg = dsIntegracao.getValue(0, "Mensagem");

    // Corrige as quebras de linha da mensagem
    msg = code + " - " + msg.replace('\n', '<br/>');

    // Caso ocorra um erro
    if (code != 1) {
        if (code == 500) {
            msg = "ERP retornou um erro desconhecido.<br/>" +
                "Provável causa: um valor não esperado foi rejeitado.<br/>" +
                "Verifique se todos os campos obrigatórios foram preenchidos.<br/>" +
                msg;
        }

        updateCardData("erro", msg);

        throw msg;
    }
}