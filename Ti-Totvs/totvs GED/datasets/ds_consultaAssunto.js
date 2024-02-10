function defineStructure() {
    addColumn("topicId", DatasetFieldType.NUMBER);
    addColumn("description", DatasetFieldType.STRING);
    setKey(["topicId"]);
    addIndex(["description"]);
}
function onSync(lastSyncDate) {
	return carregaAssuntos("offline", lastSyncDate, []);
}	
function createDataset(fields, constraints, sortFields) {
	return carregaAssuntos("online", "", constraints);
}

function onMobileSync(user) {
	var sort = [];
	var constraints = [];
	var fields = ['topicId', 'description'];
	var result = {
			'fields' : fields,
			'constraints' : constraints,
			'sortingFields' : sort
	};
	return result;
}

function carregaAssuntos(tipo, lastSyncDate, constraints){
	log.info('ds_consultaAssunto === tipo === ' + tipo + " / " + lastSyncDate);
	var dataset = DatasetBuilder.newDataset();

	var search = "&_search=";
	if(tipo == "online") {
		criaColunas(dataset);
		if(constraints != null){
			var pattern = "";
	    	for(var i in constraints){
				if(constraints[i]['fieldName'] == "description") {
					pattern = constraints[i]['initialValue'];
				}
			}
	    	search += (pattern != "");
		}
		search += "&search="+pattern;
	}
    
    try{
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId : getValue("WKCompany") + "",
			serviceCode : "fluigAPI",
			endpoint: "/ecm/api/rest/ecm/topic/list?searchInColumns=topicPK.topicId,description"+search,
			method : "GET",
			timeoutService: "120", // segundos 
			params: { },
			options: {
				encoding: "UTF-8",
				mediaType: "application/json"
			}
		}
		
		log.info("ds_consultaAssunto >>> v1 JSONUtil: " + JSONUtil.toJSON(data));
		var vo = clientService.invoke(JSONUtil.toJSON(data));
		if(vo.getResult()== null || vo.getResult().isEmpty()){
			throw "Retorno está vazio";
		}
		else if(vo.getResult().indexOf("Exception") > -1){
			throw vo.getResult();
		}
		else{
            log.info("ds_consultaAssunto >>> JSON resultado: " + vo.getResult());
			var parsed = JSON.parse(vo.getResult());
			
            var assuntos = parsed.invdata;
            for(var i in assuntos){
        		var row = [
					assuntos [i].topicPK.topicId,
					assuntos [i].description
	            ];
	            if(tipo == "offline") dataset.addOrUpdateRow(row);
	            else dataset.addRow(row);
            }
		}
    }
    catch(e) {
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn("ERRO");
		dataset.addColumn("Detalhe");
		dataset.addRow(["Falha ao comunicar com sistema integrado", e.toString()]);
		
		log.info('ds_consultaAssunto === ERRO : ' + e);
		return dataset;	
	}

	log.info('ds_consultaAssunto === FIM');
	return dataset;
}

//Cria as colunas
function criaColunas(dataset){
	dataset.addColumn("topicId");
	dataset.addColumn("description");
}