function servicetask23(attempt, message) {
	log.info('task23 start - cadastro de produto');
    var resultFields = [
        "resultadoReq1"
    ];

    var results = [
    	hAPI.getCardValue(resultFields[0]),
    ];

    var IntegrationTypes = {
        CREATE: "3",
        EDIT: "4"
    };

    var editProduct = hAPI.getCardValue('consulta_sb1') && hAPI.getCardValue("editProduct") == 'on'; 
    var integrationType = editProduct ? IntegrationTypes.EDIT : IntegrationTypes.CREATE;
    
    hAPI.setCardValue("erro", "");
    
    // Se cadastro ainda não deu certo
    log.info('log task23 1');
    if (results[0] != 1) {
        var dsIntegracaoB1 = integrate("cadastro_produto", "B1", integrationType);
        log.info('log task23 2');
        results[0] = checkResult(dsIntegracaoB1, true);
        log.info('log task23 3');
    }
    
    // Se cadastro essencial deu certo e cadastro de complemento ainda não deu certo
    // if (results[0] == 1 && results[1] != 1) {
    //     var dsIntegracaoB5 = integrate("complemento_produto", "B5", integrationType);
    //     results[1] = checkResult(dsIntegracaoB5, true);
        
    //     updateCardData(resultFields[1], results[1]);
    // }
    // Se cadastro de complemento deu certo ou já existe
    /*if (results[1] == 1 || resultFields[1] == 15) {
        var dsIntegracaoB5 = integrate("complemento_produto", "B5", "4");
        results[1] = checkResult(dsIntegracaoB5, true);
        
        updateCardData(resultFields[1], results[1]);
    }*/

    // Se complemento deu certo e produto_fornecedor ainda não deu certo
    // if (results[1] == 1 && results[2] != 1) {
    //     var dsIntegracaoA5 = integrate("produto_fornecedor", "A5", integrationType);
    //     results[2] = checkResult(dsIntegracaoA5, true);
        
    //     updateCardData(resultFields[2], results[2]);
    // }
    
    // Se produto_fornecedor ainda não deu certo ou já existe
    /*if (results[2] == 1 || resultFields[2] == 15) {
        var dsIntegracaoA5 = integrate("produto_fornecedor", "A5", "4");
        results[2] = checkResult(dsIntegracaoA5, true);
        
        updateCardData(resultFields[2], results[2]);
    }*/
    
}

function checkResult(dsIntegracao, shouldThrowError) {
    var code = dsIntegracao.getValue(0, "Codigo");
    var msg = dsIntegracao.getValue(0, "Mensagem");
    
    log.info('checkResult produto');
    log.info(code);
    log.info(msg);
    
    // Corrige as quebras de linha da mensagem
    msg = msg.replace(" QUEBRA ", "<br/>");
    
    // Caso ocorra um erro
    if (code != 1 && shouldThrowError) {
        if (code == 500) {
            msg = "ERP retornou um erro desconhecido.<br/>" +
                "Provável causa: um valor não esperado foi rejeitado.<br/>" +
                "Verifique se todos os campos obrigatórios foram preenchidos.<br/>" +
                msg;
            
        }
        
    	// updateCardData("erro", msg);
        
        throw msg;
        
    }

    return code;
}


function updateCardData(field, value) {
    var username = "admin";
    var password = "adm";
    
    DatasetFactory.getDataset("ds_updateCardData", null, [
        DatasetFactory.createConstraint("cardId", getValue("WKCardId"), null, ConstraintType.MUST),
        DatasetFactory.createConstraint("cardData", value, null, ConstraintType.MUST),
        DatasetFactory.createConstraint("cardField", field, null, ConstraintType.MUST),
        DatasetFactory.createConstraint("companyId", getValue("WKCompany"), null, ConstraintType.MUST),
        DatasetFactory.createConstraint("username", username, null, ConstraintType.MUST),
        DatasetFactory.createConstraint("password", password, null, ConstraintType.MUST)
    ], null);
    
}


function integrate(serviceCode, inputPrefix, operation) {
    return DatasetFactory.getDataset("ds_protheus_alteracao_produto", null, [
        DatasetFactory.createConstraint("serviceCode", serviceCode, null, ConstraintType.MUST),
        DatasetFactory.createConstraint("documentId", getValue("WKCardId"), null, ConstraintType.MUST),
        DatasetFactory.createConstraint("inputPrefix", inputPrefix, null, ConstraintType.MUST),
        DatasetFactory.createConstraint("operation", operation, null, ConstraintType.MUST),
        DatasetFactory.createConstraint("branch", hAPI.getCardValue("branch"), null, ConstraintType.MUST)
    ], null);
    
}
