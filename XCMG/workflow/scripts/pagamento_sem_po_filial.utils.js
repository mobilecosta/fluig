function utils(){}

var _codigoProcesso = getValue("WKDef");
var _solicitacao = getValue("WKNumProces");
var _log = _codigoProcesso + " - _solicitacao: " + _solicitacao + " - ";

function isEmpty(valor){
	return valor == null || valor == '';
}

function parseOrFormatDate(date,operation,dateFormat){
	var sdf = new java.text.SimpleDateFormat(dateFormat);
	var newDate = null;
	
	if(operation == "parse")
		newDate = sdf.parse(date);
	else if(operation == "format")
		newDate = sdf.format(date);
		
	return newDate;
}

function transformDateFromTo(date,from,to){
	var dateFrom = new java.text.SimpleDateFormat(from);
	var dateTo = new java.text.SimpleDateFormat(to);
	
	return dateTo.format(dateFrom.parse(date));
}

function comprovanteAnexado(company, process, numState){
	var anexado = false;

    var hc1 = DatasetFactory.createConstraint("processHistoryPK.companyId", company, company, ConstraintType.MUST);
	var hc2 = DatasetFactory.createConstraint("processHistoryPK.processInstanceId", process, process, ConstraintType.MUST);
	var historyDataset = DatasetFactory.getDataset("processHistory", ["processHistoryPK.movementSequence", "stateSequence"], [hc1, hc2], null);
	log.info("comprovanteAnexado - HISTORY - rows - " + historyDataset.rowsCount);
	//log.dir(historyDataset);
	
	if(historyDataset.rowsCount > 0){
		var ultimoMovimento = historyDataset.getValue(historyDataset.rowsCount-1, "processHistoryPK.movementSequence");
		
		//var ultimoMovimento = historyDataset.getValue(historyDataset.rowsCount-1, "NUM_SEQ_MOVTO");
		
		var ac1 = DatasetFactory.createConstraint("processAttachmentPK.companyId", company, company, ConstraintType.MUST);
		var ac2 = DatasetFactory.createConstraint("processAttachmentPK.processInstanceId", process, process, ConstraintType.MUST);
		var ac3 = DatasetFactory.createConstraint("originalMovementSequence", ultimoMovimento, ultimoMovimento, ConstraintType.MUST);
		var attachmentDataset = DatasetFactory.getDataset("processAttachment", ["originalMovementSequence"], [ac1, ac2, ac3], null);
		log.info("QUANTOS ANEXOS? "+attachmentDataset.rowsCount);
		//log.dir(attachmentDataset);
		return attachmentDataset.rowsCount >= 1;
	}
    
    return anexado;
}