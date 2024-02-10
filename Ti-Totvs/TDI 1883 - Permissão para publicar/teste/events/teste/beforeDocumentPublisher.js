function beforeDocumentPublisher() {
	var doc = getValue("WKDocument");
	var pastaPai = doc.getParentDocumentId();
	var listSeg = consultarWKListSecurity(pastaPai);

	log.info("doc###")
	log.dir(doc)
	log.info("listSeg")
	log.dir(listSeg)

	if (doc.getDocumentType() == 2) {

		if (listSeg != null) {

			for (j = 0; j < listSeg.length; j++) {

				if (listSeg[j].equals("") ||
					listSeg[j].equalsIgnoreCase("all") ||
					listSeg[j].equalsIgnoreCase("*") ||
					listSeg[j].equalsIgnoreCase("TParticipante") ||
					listSeg[j].equalsIgnoreCase("TFranquia") ||
					listSeg[j].equalsIgnoreCase("TCliente")) {

					if (!checarPastaCST(pastaPai)) {
						throw "Nao é possivel definir uma permissão para 'Todos', se atente as permissões de seguranças de documentos sensiveis";
					}
				}
			}
		}
	}
}

function checarPastaCST(pastaPai) {
	var status = true;
	var pastaCST = 5;

	while (pastaPai != 0) {
		if (pastaPai == pastaCST) {
			status = false;
		}
		if (status) {
			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint("documentPK.documentId", pastaPai, pastaPai, ConstraintType.MUST));
			var resultado = DatasetFactory.getDataset("document", null, constraints, null);
			if (resultado != null && resultado.values != null && resultado.values.length > 0) {

				pastaPai = resultado.getValue(0, "parentDocumentId");
			}
		} else {
			pastaPai = 0;
		}
	}

	return status
}

function consultarWKListSecurity(pastaPai) {
	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("documentSecurityConfigPK.documentId", pastaPai, pastaPai, ConstraintType.MUST));
	var resultado = DatasetFactory.getDataset("documentSecurityConfig", null, constraints, null);
	if (resultado != null && resultado.values != null && resultado.values.length > 0) {
		var result = [];

		for (var i = 0; i < resultado.values.length; i++) {
			result.push(resultado.getValue(i, "attributionValue"))
			
		}
		
		return result
	}
}

