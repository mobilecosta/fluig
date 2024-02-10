function beforeDocumentPublisher() {
	//Exemplo implementação

	var doc = getValue("WKDocument");
	var listSeg = getValue("WKListSecurity");
	var pastaPai = doc.parentDocumentId;
	var url = fluigAPI.getPageService().getServerURL();
	log.info('url');
	log.dir(url);

	if (!checarPastaCST(pastaPai)) {
		throw "Não é permitido publicar nesta pasta"
	}
}

function checarPastaCST(pastaPai) {
	var status = true;
	var pastaCST = url();

	log.info("pastaCST")
	log.dir(pastaCST)

	while (pastaPai != 0) {
		if (pastaPai == pastaCST) {
			status = false;
		}
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("documentPK.documentId", pastaPai, pastaPai, ConstraintType.MUST));
		var resultado = DatasetFactory.getDataset("document", null, constraints, null);
		if (resultado != null && resultado.values != null && resultado.values.length > 0) {
			pastaPai = resultado.getValue(0, "parentDocumentId");
		}
	}

	return status
}

function url() {
	if (fluigAPI.getPageService().getServerURL() == "http://10.172.159.36:8080") {
		return 5;
	} else {
		return 2
	}
}