function beforeDocumentPublisher() {
	var inicio = new Date();

	var doc = getValue("WKDocument");
	var listSeg = getValue("WKListSecurity");
	var pastaPai = doc.getParentDocumentId();

	if (doc.getDocumentType() == 2) {

		if (listSeg != null) {
			for (j = 0; j < listSeg.size(); j++) {

				if (listSeg.get(j).getAttributionValue().equals("") ||
					listSeg.get(j).getAttributionValue().equalsIgnoreCase("all") ||
					listSeg.get(j).getAttributionValue().equalsIgnoreCase("*") ||
					listSeg.get(j).getAttributionValue().equalsIgnoreCase("TParticipante") ||
					listSeg.get(j).getAttributionValue().equalsIgnoreCase("TFranquia") ||
					listSeg.get(j).getAttributionValue().equalsIgnoreCase("TCliente")) {
					if (!checarPastaCST(pastaPai)) {
						throw "Nao é possivel definir uma permissão para 'Todos', favor restringir a segurança do documento. Utilize os grupos 'TParticipante', 'TFranquia' e 'TParceiro' conforme o publico alvo dessa publicação! A segurança do documento é de responsabilidade do publicador!"
					}
				}
			}
		}


		log.info('beforeDocumentPublisher - Processando regras');
		let TIPO = getFolderAdditionalComments(doc);
		if (TIPO.indexOf('TIPO_publicacao') > -1) {
			let assunto = String(doc.getTopicId());
			let cs = [
				DatasetFactory.createConstraint('cd_assunto', assunto, assunto, ConstraintType.MUST)
				, DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST)
			];
			let fields = ['cd_assunto', 'tamanho_minimo', 'validade'];
			let dataset = DatasetFactory.getDataset('arquivo_assunto_temporalidade', fields, cs, null);
			if (dataset && dataset.rowsCount > 0) {
				if (parseInt(dataset.getValue(0, 'validade'), 10) != 0) {
					//var docEdit = getValue("WKDocumentEdit");
					//docEdit.setExpires(true);
					//docEdit.setExpirationDate(addYearsToDate(parseInt(dataset.getValue(0,'validade'))));
				}
				let tamanhoDoc = parseFloat(doc.getPhisicalFileSize() * 1000);
				let tamanhoMinimo = parseFloat(dataset.getValue(0, 'tamanho_minimo'));
				if (tamanhoDoc == 0) {
					logaTempo(inicio);
					throw "Desculpe, arquivos vazios não são permitidos";
				}
				else if (tamanhoDoc < tamanhoMinimo) {
					logaTempo(inicio);
					throw "Desculpe, o arquivo possui o tamanho (" + tamanhoDoc + " kb), sendo o tamanho minimo necessário: (" + tamanhoMinimo + " kb)";
				}
			}
		}
		else if (TIPO.indexOf('TIPO_unidades_totvs') > -1 || TIPO.indexOf('TIPO_ano') > -1
			|| TIPO.indexOf('TIPO_ano_mes') > -1 || TIPO.indexOf('TIPO_especifico') > -1) {
			logaTempo(inicio);
			throw "Você não pode publicar documentos em pastas intermediarias"
		}
		else if (TIPO.indexOf('TIPO_raiz') > -1) {
			logaTempo(inicio);
			throw "Você não pode publicar documentos na pasta raiz"
		}
	}
	logaTempo(inicio);
}
function getFolderAdditionalComments(doc) {
	let pastaPai = doc.getParentDocumentId();
	let company = getValue('WKCompany');
	let cs = [
		DatasetFactory.createConstraint('documentPK.companyId', company, company, ConstraintType.MUST)
		, DatasetFactory.createConstraint('documentPK.documentId', pastaPai, pastaPai, ConstraintType.MUST)
		, DatasetFactory.createConstraint('activeVersion', true, true, ConstraintType.MUST)
	];
	let dataset = DatasetFactory.getDataset('document', ['documentPK.documentId', 'additionalComments'], cs, null);
	return dataset.getValue(0, 'additionalComments');
}

function addYearsToDate(years) {
	var res = new Date();
	res.setFullYear(res.getFullYear() + years);
	return res;
}

function logaTempo(inicio) {
	var fim = new Date();
	log.info('beforeDocumentPublisher - tempo: ' + (fim - inicio));
}

function checarPastaCST(pastaPai) {
	var status = true;
	var pastaCST = 1849015;

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