function beforeStateEntry(sequenceId) {

    if (sequenceId == 22) {

        var processo = getValue("WKNumProces");
        var folderId = 10251004;
        var competencia = hAPI.getCardValue("DataPagamento");
        var ano = competencia.substr(0, 4);
        var mes = competencia.substr(5, 2);
        var Dia = competencia.substr(8);
        var fornecedor = hAPI.getCardValue("idRazao");
        var solicitacao = hAPI.getCardValue("solicitacao");

        var parseDataPagamento = parseData(competencia);
        hAPI.setCardValue("parseDataPagamento", parseDataPagamento);

        // Verificar se tem pasta do ano
        try {

            var pasta = consultarPastas(folderId, ano);

            if (!pasta) {

                //Cria a pasta do Ano
                var dto = docAPI.newDocumentDto();
                dto.setDocumentDescription(ano);
                dto.setDocumentType("1");
                dto.setParentDocumentId(folderId);
                dto.setDocumentTypeId("");

                var folder = docAPI.createFolder(dto, null, null);

                var folderYear = folder.getDocumentId();

            } else {
                var folderYear = pasta;
            }


        } catch (e) {

            throw " >>> ERROR >>> Consultar/Criar pasta Ano <<< | " + e.name + " - " + e.message;

        };

        // verificar se tem pasta do mes dentro da pasta do ano
        try {

            var pasta = consultarPastas(folderYear, mes);

            if (!pasta) {

                //Cria a pasta do Mes
                var dto = docAPI.newDocumentDto();
                dto.setDocumentDescription(mes);
                dto.setDocumentType("1");
                dto.setParentDocumentId(folderYear);
                dto.setDocumentTypeId("");

                var folder = docAPI.createFolder(dto, null, null);

                var folderMonth = folder.getDocumentId();

            } else {
                var folderMonth = pasta;
            }


        } catch (e) {

            throw " >>> ERROR >>> Consultar/Criar pasta Mes <<< | " + e.name + " - " + e.message;

        };

        // verificar se tem pasta do dia dentro da pasta do mes
        try {

            var pasta = consultarPastas(folderMonth, Dia);

            if (!pasta) {

                //Cria a pasta da Dia
                var dto = docAPI.newDocumentDto();
                dto.setDocumentDescription(Dia);
                dto.setDocumentType("1");
                dto.setParentDocumentId(folderMonth);
                dto.setDocumentTypeId("");

                var folder = docAPI.createFolder(dto, null, null);

                var folderDay = folder.getDocumentId();
            } else {
                var folderDay = pasta;
            }

        } catch (e) {

            throw " >>> ERROR >>> Consultar/Criar pasta Dia <<< | " + e.name + " - " + e.message;

        };

        // verificar se tem pasta da fornecedor dentro da pasta do Dia
        try {

            var pasta = consultarPastas(folderDay, fornecedor);

            if (!pasta) {

                //Cria a pasta da fornecedor
                var dto = docAPI.newDocumentDto();
                dto.setDocumentDescription(fornecedor);
                dto.setDocumentType("1");
                dto.setParentDocumentId(folderDay);
                dto.setDocumentTypeId("");

                var folder = docAPI.createFolder(dto, null, null);

                var folderfornecedor = folder.getDocumentId();
            } else {
                var folderfornecedor = pasta;
            }

        } catch (e) {

            throw " >>> ERROR >>> Consultar/Criar pasta fornecedor <<< | " + e.name + " - " + e.message;

        };

        //Cria os anexos na pasta do fornecedor
        try {
            //pego a lista dos anexos
            var anexosDoProcesso = hAPI.listAttachments();

            //variavel para recuperar a data
            var calendar = java.util.Calendar.getInstance().getTime();

            //se tiver anexos
            if (anexosDoProcesso.size() > 0) {

                //passo por todos os anexos
                for (var i = 0; i < anexosDoProcesso.size(); i++) {

                    //jogo o anexo na variavel
                    var doc = anexosDoProcesso.get(i);

                    var descricao = "(" + solicitacao + ") " + doc.getDocumentDescription();

                    //defino as propriedades ...
                    doc.setParentDocumentId(parseInt("" + folderfornecedor)); // pasta destino
                    doc.setVersionDescription("Processo: " + processo);
                    doc.setExpires(false);
                    doc.setCreateDate(calendar);
                    doc.setTopicId(1);
                    doc.setUserNotify(false);
                    doc.setValidationStartDate(calendar);
                    doc.setVersionOption("0");
                    doc.setUpdateIsoProperties(true);
                    doc.setDocumentDescription(descricao);
                    doc.setAdditionalComments("Processo Nota Fiscal Pagamento");

                    //inclui o anexo à pasta
                    hAPI.publishWorkflowAttachment(doc);

                }
            }
        } catch (e) {

            throw " >>> ERROR >>> Salvar anexos <<< | " + e.name + " - " + e.message;
        }
    }

}


function consultarPastas(folder, description) {
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("parentDocumentId", folder, folder, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("documentDescription", description, description, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("activeVersion", "true", "true", ConstraintType.MUST));
    var resultado = DatasetFactory.getDataset("document", null, constraints, null);

    if (resultado != null && resultado.values != null && resultado.values.length > 0) {
        return resultado.getValue(0, "documentPK.documentId");
    }
    return false;
}

function parseData(data) {
    var mes = data.substr(5, 2)
    var dia = data.substr(8, 2)
    var ano = data.substr(2, 2)

    return dia + '/' + mes + '/' + ano;
}