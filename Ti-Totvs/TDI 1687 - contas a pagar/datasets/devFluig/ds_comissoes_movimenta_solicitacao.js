var dados = {
	empresa : 10097,
	matricula : 272121369, // 159470324,
	usuario : "paulo.rsouza@totvs.com.br",
	senha : "Totvs@12345"
}

function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("erro");
	dataset.addColumn("solicitacao");
	var solicitacao = getConstraint(constraints, "solicitacao");
	var arquivos = getConstraint(constraints, "arquivos");
	var requisitante = retornaRequisitante(solicitacao);

	// Teste
	// solicitacao = 3887043;
	// arquivos = "arquivo_teste.pdf";

	var serviceManager = ServiceManager.getService("ECMWorkflowEngineService");
	var instance = serviceManager.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
	var keyValueDtoArray = serviceManager.instantiate("com.totvs.technology.ecm.workflow.ws.KeyValueDtoArray");
	var processTaskAppointmentDtoArray = serviceManager.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray");
	var port = instance.getWorkflowEngineServicePort();
	var stringArray = serviceManager.instantiate("net.java.dev.jaxb.array.StringArray");
	var anexos = retornaAnexos(serviceManager, arquivos);
	stringArray.getItem().add("Pool:Role:CONTAS_A_PAGAR");

	try {
		var service = port.saveAndSendTaskClassic(dados.usuario, dados.senha, dados.empresa, parseInt(solicitacao, 10), 12, stringArray,
				"", dados.matricula, true, anexos, keyValueDtoArray, processTaskAppointmentDtoArray, false, 0);
		dataset.addRow([ false, service.getItem().get(0).getValue() ]);
	} catch (e) {
		dataset.addRow([ true, "" + e ]);
		log.error("Erro ao movimentar a solicitação: " + e);
	}
	return dataset;
}

function getConstraint(constraints, filter) {
	for (var i = 0; i < constraints.length; i++) {
		if (constraints[i].fieldName == filter && constraints[i].initialValue != "") {
			return constraints[i].initialValue;
		}
	}
	return null;
}

function retornaAnexos(serviceManager, arquivos) {
	var processAttachmentDtoArray = serviceManager.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray");
	var processAttachmentDto = null;
	var attachment = null;
	var listaArquivos = arquivos.split(";");

	for (var i = 0; i < listaArquivos.length; i++) {
		var arquivo = enviaDocumentoParaUpload(listaArquivos[i]);
		if (arquivo != null) {
			processAttachmentDto = serviceManager.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDto");
			attachment = serviceManager.instantiate("com.totvs.technology.ecm.workflow.ws.Attachment");
			processAttachmentDto.setAttachmentSequence(i);
			processAttachmentDto.setCompanyId(10097);
			processAttachmentDto.setDescription(arquivo.substring(14));
			processAttachmentDto.setFileName(arquivo);
			processAttachmentDto.setVersion(1000);
			attachment.setAttach(false);
			attachment.setFileName(arquivo);
			attachment.setPrincipal(true);
			processAttachmentDto.getAttachments().add(attachment);
			processAttachmentDtoArray.getItem().add(processAttachmentDto);
		} else {
			log.error("Erro ao anexar o arquivo " + listaArquivos[i] + " ao processo.");
			throw "Erro ao anexar o arquivo " + listaArquivos[i] + " ao processo.";
		}
	}
	return processAttachmentDtoArray;
}

function enviaDocumentoParaUpload(idDocumento) {
	var serviceManager = ServiceManager.getService("ECMDocumentService");
	var instance = serviceManager.instantiate("com.totvs.technology.ecm.dm.ws.ECMDocumentServiceService");
	var port = instance.getDocumentServicePort();
	var arquivo = null;

	try {
		var service = port.copyDocumentToUploadArea(dados.usuario, dados.senha, dados.empresa, idDocumento, 1000, dados.matricula);
		arquivo = service.getItem().get(0);
	} catch (e) {
		log.error("Erro ao anexar o documento ao processo: " + e);
		throw "Erro ao anexar o documento ao processo: " + e;
	}
	return arquivo;
}

function retornaRequisitante(solicitacao) {
	var constraints = [];
	constraints.push(DatasetFactory.createConstraint("processTaskPK.movementSequence", 1, 1, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("processTaskPK.companyId", 10097, 10097, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("processTaskPK.processInstanceId", solicitacao, solicitacao, ConstraintType.MUST));
	var dataset = DatasetFactory.getDataset("processTask", [ "processTaskPK.colleagueId" ], constraints, null);
	return dataset.getValue(0, "processTaskPK.colleagueId");
}