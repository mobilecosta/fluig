function createDataset(fields, constraints, sortFields) {
	try {
		return processResult(callService(fields, constraints, sortFields));
	} catch (e) {
		return processErrorResult(e, constraints);
	}
}

function callService(fields, constraints, sortFields) {
	var serviceData = data();
	var params = serviceData.inputValues;
	var assigns = serviceData.inputAssignments;

	verifyConstraints(serviceData.inputValues, constraints);

	for (var c in constraints) {
		if (constraints[c].fieldName == "idCanal") {
			params.cardData.idCanal = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idRazao") {
			params.cardData.idRazao = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idCNPJ_canal") {
			params.cardData.idCNPJ_canal = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idFornecedor_nome") {
			params.cardData.idFornecedor_nome = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idPedido") {
			params.cardData.idPedido = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idValor") {
			params.cardData.idValor = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idAGN") {
			params.cardData.idAGN = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idFILIAL_TOTVS") {
			params.cardData.idFILIAL_TOTVS = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idCNPJ_TOTVS") {
			params.cardData.idCNPJ_TOTVS = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idNome_FILIAL_TOTVS") {
			params.cardData.idNome_FILIAL_TOTVS = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idCompetencia") {
			params.cardData.idCompetencia = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "idCodigo_fornecedor") {
			params.cardData.idCodigo_fornecedor = constraints[c].initialValue;
		} else if (constraints[c].fieldName == "colleagueId") {
			params.colleagueIds = [constraints[c].initialValue];
		} else if (constraints[c].fieldName == "userId") {
			params.userId = constraints[c].initialValue;
		}
	}

	var serviceHelper = ServiceManager.getService(serviceData.fluigService);
	var serviceLocator = serviceHelper.instantiate(serviceData.locatorClass);
	var service = serviceLocator.getWorkflowEngineServicePort();
	var response = service.startProcess(getParamValue(params.username, assigns.username), getParamValue(params.password, assigns.password),
		getParamValue(params.companyId, assigns.companyId), getParamValue(params.processId, assigns.processId),
		getParamValue(params.choosedState, assigns.choosedState), fillStringArray(serviceHelper, params.colleagueIds, assigns.colleagueIds),
		getParamValue(params.comments, assigns.comments), getParamValue(params.userId, assigns.userId),
		stringToBoolean(getParamValue(params.completeTask, assigns.completeTask)), fillProcessAttachmentDtoArray(serviceHelper, params.attachments, assigns.attachments),
		fillMap(serviceHelper, params.cardData, assigns.cardData), fillProcessTaskAppointmentDtoArray(serviceHelper, params.appointment, assigns.appointment),
		stringToBoolean(getParamValue(params.managerMode, assigns.managerMode)));

	return response;

}

function defineStructure() {
	addColumn('response');
}

function onSync(lastSyncDate) {
	var serviceData = data();
	var synchronizedDataset = DatasetBuilder.newDataset();

	try {
		var resultDataset = processResult(callService());
		if (resultDataset != null) {
			var values = resultDataset.getValues();
			for (var i = 0; i < values.length; i++) {
				synchronizedDataset.addRow(values[i]);
			}
		}

	} catch (e) {
		log.info('Dataset synchronization error : ' + e.message);

	}
	return synchronizedDataset;
}

function verifyConstraints(params, constraints) {
	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			try {
				params[constraints[i].fieldName] = JSON.parse(constraints[i].initialValue);
			} catch (e) {
				params[constraints[i].fieldName] = constraints[i].initialValue;
			}
		}
	}
}

function processResult(result) {
	var dataset = DatasetBuilder.newDataset();
	var resultItens = result.getItem();
	var itemRow = [];
	for (var i = 0; i < resultItens.size(); i++) {
		if (resultItens.get(i).getItem().size() == 2) {
			dataset.addColumn(resultItens.get(i).getItem().get(0));
			itemRow.push(resultItens.get(i).getItem().get(1));
		}
	}
	if (itemRow.length > 0) {
		dataset.addRow(itemRow);
	}
	return dataset;
}

function processErrorResult(error, constraints) {
	var dataset = DatasetBuilder.newDataset();

	var params = data().inputValues;
	verifyConstraints(params, constraints);

	dataset.addColumn('error');
	dataset.addColumn('cardData');
	dataset.addColumn('comments');
	dataset.addColumn('attachments');
	dataset.addColumn('colleagueIds');
	dataset.addColumn('managerMode');
	dataset.addColumn('appointment');
	dataset.addColumn('choosedState');
	dataset.addColumn('userId');
	dataset.addColumn('completeTask');
	dataset.addColumn('password');
	dataset.addColumn('companyId');
	dataset.addColumn('processId');
	dataset.addColumn('username');

	var cardData = isPrimitive(params.cardData) ? params.cardData : JSONUtil.toJSON(params.cardData);
	var comments = isPrimitive(params.comments) ? params.comments : JSONUtil.toJSON(params.comments);
	var attachments = isPrimitive(params.attachments) ? params.attachments : JSONUtil.toJSON(params.attachments);
	var colleagueIds = isPrimitive(params.colleagueIds) ? params.colleagueIds : JSONUtil.toJSON(params.colleagueIds);
	var managerMode = isPrimitive(params.managerMode) ? params.managerMode : JSONUtil.toJSON(params.managerMode);
	var appointment = isPrimitive(params.appointment) ? params.appointment : JSONUtil.toJSON(params.appointment);
	var choosedState = isPrimitive(params.choosedState) ? params.choosedState : JSONUtil.toJSON(params.choosedState);
	var userId = isPrimitive(params.userId) ? params.userId : JSONUtil.toJSON(params.userId);
	var completeTask = isPrimitive(params.completeTask) ? params.completeTask : JSONUtil.toJSON(params.completeTask);
	var password = isPrimitive(params.password) ? params.password : JSONUtil.toJSON(params.password);
	var companyId = isPrimitive(params.companyId) ? params.companyId : JSONUtil.toJSON(params.companyId);
	var processId = isPrimitive(params.processId) ? params.processId : JSONUtil.toJSON(params.processId);
	var username = isPrimitive(params.username) ? params.username : JSONUtil.toJSON(params.username);

	dataset.addRow([error.message, cardData, comments, attachments, colleagueIds, managerMode, appointment, choosedState, userId, completeTask, password, companyId, processId, username]);

	return dataset;
}

function getParamValue(param, assignment) {
	if (assignment == 'VARIABLE') {
		return getValue(param);
	} else if (assignment == 'NULL') {
		return null;
	}
	return param;
}

function hasValue(value) {
	return value !== null && value !== undefined;
}

function isPrimitive(value) {
	return ((typeof value === 'string') || value.substring !== undefined) || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'undefined';
}


function fillStringArray(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("net.java.dev.jaxb.array.StringArray");

	for (var i = 0; i < params.length; i++) {
		result.getItem().add(getParamValue(params[i], assigns[i]));
	}

	return result;
}

function fillProcessAttachmentDto(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDto");

	var attachmentSequence = getParamValue(params.attachmentSequence, assigns.attachmentSequence);
	if (hasValue(attachmentSequence)) { result.setAttachmentSequence(attachmentSequence); }
	var colleagueId = getParamValue(params.colleagueId, assigns.colleagueId);
	if (hasValue(colleagueId)) { result.setColleagueId(colleagueId); }
	var colleagueName = getParamValue(params.colleagueName, assigns.colleagueName);
	if (hasValue(colleagueName)) { result.setColleagueName(colleagueName); }
	var companyId = getParamValue(params.companyId, assigns.companyId);
	if (hasValue(companyId)) { result.setCompanyId(companyId); }
	var crc = getParamValue(params.crc, assigns.crc);
	if (hasValue(crc)) { result.setCrc(crc); }
	var createDate = serviceHelper.getDate(getParamValue(params.createDate, assigns.createDate));
	if (hasValue(createDate)) { result.setCreateDate(createDate); }
	var createDateTimestamp = getParamValue(params.createDateTimestamp, assigns.createDateTimestamp);
	if (hasValue(createDateTimestamp)) { result.setCreateDateTimestamp(createDateTimestamp); }
	var deleted = getParamValue(params.deleted, assigns.deleted);
	if (hasValue(deleted)) { result.setDeleted(deleted); }
	var description = getParamValue(params.description, assigns.description);
	if (hasValue(description)) { result.setDescription(description); }
	var documentId = getParamValue(params.documentId, assigns.documentId);
	if (hasValue(documentId)) { result.setDocumentId(documentId); }
	var documentType = getParamValue(params.documentType, assigns.documentType);
	if (hasValue(documentType)) { result.setDocumentType(documentType); }
	var fileName = getParamValue(params.fileName, assigns.fileName);
	if (hasValue(fileName)) { result.setFileName(fileName); }
	var newAttach = getParamValue(params.newAttach, assigns.newAttach);
	if (hasValue(newAttach)) { result.setNewAttach(newAttach); }
	var originalMovementSequence = getParamValue(params.originalMovementSequence, assigns.originalMovementSequence);
	if (hasValue(originalMovementSequence)) { result.setOriginalMovementSequence(originalMovementSequence); }
	var permission = getParamValue(params.permission, assigns.permission);
	if (hasValue(permission)) { result.setPermission(permission); }
	var processInstanceId = getParamValue(params.processInstanceId, assigns.processInstanceId);
	if (hasValue(processInstanceId)) { result.setProcessInstanceId(processInstanceId); }
	var size = getParamValue(params.size, assigns.size);
	if (hasValue(size)) { result.setSize(size); }
	var version = getParamValue(params.version, assigns.version);
	if (hasValue(version)) { result.setVersion(version); }

	return result;
}

function fillProcessAttachmentDtoArray(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray");

	for (var i = 0; i < params.length; i++) {
		result.getItem().add(fillProcessAttachmentDto(serviceHelper, params[i], assigns[i]));
	}

	return result;
}

function fillMap(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("net.java.dev.jaxb.array.StringArrayArray");
	var paramKeys = Object.keys(params);

	for (var i = 0; i < paramKeys.length; i++) {

		var item = serviceHelper.instantiate("net.java.dev.jaxb.array.StringArray");
		item.getItem().add(paramKeys[i]);
		item.getItem().add(getParamValue(params[paramKeys[i]], assigns[paramKeys[i]]));
		result.getItem().add(item);
	}

	return result;
}

function fillProcessTaskAppointmentDto(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDto");

	var appointmentDate = serviceHelper.getDate(getParamValue(params.appointmentDate, assigns.appointmentDate));
	if (hasValue(appointmentDate)) { result.setAppointmentDate(appointmentDate); }
	var appointmentSeconds = getParamValue(params.appointmentSeconds, assigns.appointmentSeconds);
	if (hasValue(appointmentSeconds)) { result.setAppointmentSeconds(appointmentSeconds); }
	var appointmentSequence = getParamValue(params.appointmentSequence, assigns.appointmentSequence);
	if (hasValue(appointmentSequence)) { result.setAppointmentSequence(appointmentSequence); }
	var colleagueId = getParamValue(params.colleagueId, assigns.colleagueId);
	if (hasValue(colleagueId)) { result.setColleagueId(colleagueId); }
	var colleagueName = getParamValue(params.colleagueName, assigns.colleagueName);
	if (hasValue(colleagueName)) { result.setColleagueName(colleagueName); }
	var companyId = getParamValue(params.companyId, assigns.companyId);
	if (hasValue(companyId)) { result.setCompanyId(companyId); }
	var isNewRecord = getParamValue(params.isNewRecord, assigns.isNewRecord);
	if (hasValue(isNewRecord)) { result.setIsNewRecord(isNewRecord); }
	var movementSequence = getParamValue(params.movementSequence, assigns.movementSequence);
	if (hasValue(movementSequence)) { result.setMovementSequence(movementSequence); }
	var processInstanceId = getParamValue(params.processInstanceId, assigns.processInstanceId);
	if (hasValue(processInstanceId)) { result.setProcessInstanceId(processInstanceId); }
	var transferenceSequence = getParamValue(params.transferenceSequence, assigns.transferenceSequence);
	if (hasValue(transferenceSequence)) { result.setTransferenceSequence(transferenceSequence); }

	return result;
}

function fillProcessTaskAppointmentDtoArray(serviceHelper, params, assigns) {
	if (params == null) {
		return null;
	}

	var result = serviceHelper.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray");

	for (var i = 0; i < params.length; i++) {
		result.getItem().add(fillProcessTaskAppointmentDto(serviceHelper, params[i], assigns[i]));
	}

	return result;
}

function getObjectFactory(serviceHelper) {
	var objectFactory = serviceHelper.instantiate("com.totvs.technology.ecm.workflow.ws.ObjectFactory");

	return objectFactory;
}



function data() {
	return {
		"fluigService": "startProcess",
		"operation": "startProcess",
		"soapService": "ECMWorkflowEngineServiceService",
		"portType": "WorkflowEngineService",
		"locatorClass": "com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService",
		"portTypeMethod": "getWorkflowEngineServicePort",
		"parameters": [],
		"inputValues": {
			"cardData": {
				"idCanal": "",
				"idRazao": "",
				"idCNPJ_canal": "",
				"idFornecedor_nome": "",
				"idPedido": "",
				"idAGN": "",
				"idFILIAL_TOTVS": "",
				"idCNPJ_TOTVS": "",
				"idNome_FILIAL_TOTVS": "",
				"idCompetencia": "",
				"idValor": "",
				"idCodigo_fornecedor": ""
			},
			"comments": "",
			"attachments": [],
			"colleagueIds": [],
			"managerMode": false,
			"appointment": [],
			"choosedState": 4,
			"userId": "",
			"completeTask": false,
			"password": "Totvs@12345",
			"companyId": 10097,
			"processId": "TESTE CONTAS A PAGAR COMISSOES",
			"username": "paulo.rsouza@totvs.com.br"
		},
		"inputAssignments": {
			"cardData": {
				"idCanal": "VALUE",
				"idRazao": "VALUE",
				"idCNPJ_canal": "VALUE",
				"idFornecedor_nome": "VALUE",
				"idPedido": "VALUE",
				"idAGN": "VALUE",
				"idFILIAL_TOTVS": "VALUE",
				"idCNPJ_TOTVS": "VALUE",
				"idNome_FILIAL_TOTVS": "VALUE",
				"idCompetencia": "VALUE",
				"idValor": "VALUE",
				"idCodigo_fornecedor": "VALUE"
			},
			"comments": "VALUE",
			"attachments": [],
			"colleagueIds": ["VALUE"],
			"managerMode": "VALUE",
			"appointment": [],
			"choosedState": "VALUE",
			"userId": "VALUE",
			"completeTask": "VALUE",
			"password": "VALUE",
			"companyId": "VALUE",
			"processId": "VALUE",
			"username": "VALUE"
		},
		"outputValues": {},
		"outputAssignments": {},
		"extraParams": {
			"enabled": false
		}
	}
}

function stringToBoolean(param) {
	if (typeof (param) === 'boolean') {
		return param;
	}
	if (param == null || param === 'null') {
		return false;
	}
	switch (param.toLowerCase().trim()) {
		case 'true': case 'yes': case '1': return true;
		case 'false': case 'no': case '0': case null: return false;
		default: return Boolean(param);
	}
} 