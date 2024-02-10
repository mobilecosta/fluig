function beforeDocumentPublisher(){
	var inicio = new Date();
	
    var doc = getValue("WKDocument");
    
    if(doc.getDocumentType() == 2){
		log.info('beforeDocumentPublisher - Processando regras');
		let TIPO = getFolderAdditionalComments(doc);
    	if(TIPO.indexOf('TIPO_publicacao') > -1){
			let assunto = String(doc.getTopicId());
	    	let cs = [
				DatasetFactory.createConstraint('cd_assunto', assunto, assunto, ConstraintType.MUST)
				, DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST)
			];
			let fields = ['cd_assunto','tamanho_minimo','validade'];
		    let dataset = DatasetFactory.getDataset('arquivo_assunto_temporalidade', fields, cs, null);
		    if(dataset && dataset.rowsCount > 0){
		    	if(parseInt(dataset.getValue(0,'validade'),10) != 0){
					//var docEdit = getValue("WKDocumentEdit");
		    		//docEdit.setExpires(true);
		    		//docEdit.setExpirationDate(addYearsToDate(parseInt(dataset.getValue(0,'validade'))));
		    	}
		    	let tamanhoDoc = parseFloat(doc.getPhisicalFileSize()*1000);
		    	let tamanhoMinimo = parseFloat(dataset.getValue(0,'tamanho_minimo'));
		    	if (tamanhoDoc == 0){
					logaTempo(inicio);
					throw "Desculpe, arquivos vazios não são permitidos";
				}
				else if(tamanhoDoc < tamanhoMinimo) {
					logaTempo(inicio);
					throw "Desculpe, o arquivo possui o tamanho ("+tamanhoDoc+" kb), sendo o tamanho minimo necessário: ("+tamanhoMinimo+" kb)";
				}
		    }
	    }
	    else if(TIPO.indexOf('TIPO_unidades_totvs') > -1 || TIPO.indexOf('TIPO_ano') > -1 
	    	|| TIPO.indexOf('TIPO_ano_mes') > -1 || TIPO.indexOf('TIPO_especifico') > -1){
			logaTempo(inicio);
	    	throw "Você não pode publicar documentos em pastas intermediarias"
	    }
	    else if(TIPO.indexOf('TIPO_raiz') > -1){
			logaTempo(inicio);
	    	throw "Você não pode publicar documentos na pasta raiz"
	    }
    }
    logaTempo(inicio);
}    
function getFolderAdditionalComments(doc){
	let pastaPai = doc.getParentDocumentId();
	let company = getValue('WKCompany');
	let cs = [ 
		DatasetFactory.createConstraint('documentPK.companyId', company, company, ConstraintType.MUST)
		, DatasetFactory.createConstraint('documentPK.documentId', pastaPai, pastaPai, ConstraintType.MUST)
		, DatasetFactory.createConstraint('activeVersion', true, true, ConstraintType.MUST)
	];
	let dataset = DatasetFactory.getDataset('document', ['documentPK.documentId','additionalComments'], cs, null);
	return dataset.getValue(0,'additionalComments');
}

function addYearsToDate(years){
    var res = new Date();
    res.setFullYear(res.getFullYear() + years);
    return res;
}

function logaTempo(inicio){
	var fim = new Date();
    log.info('beforeDocumentPublisher - tempo: ' + (fim - inicio));
}