function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();	
	var clientId = '3b664169-9c25-4372-9dff-8515d659f209'; // Substituir '<CLIENT_ID>' pelo clientId da empresa
	var companyId ='45326572b53711e9ad830a586461420a'; // Substituir '<COMPANY_ID>' pelo companyId da empresa
    var activeDir = 'd4d4d638-6ee8-42b4-9284-cd47d8234ff5';	
	var c1 = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
	var dsParamIdentity = DatasetFactory.getDataset("fluig_parametros_integracao", null, [c1], null);
	if(dsParamIdentity.rowsCount > 0){
		clientId = dsParamIdentity.getValue(0,"clientIdIdentity");
		companyId = dsParamIdentity.getValue(0,"companyIdIdentity");
		activeDir = dsParamIdentity.getValue(0,"adIdIdentity");
	}
	
	var apiUrl = '/rest/v2/';
	//fields = ['abilio.santos@rodobens.com.br'];
	if(fields == null || fields.length != 1){
		newDataset.addColumn("ERROR");
		newDataset.addRow(["Informe o campo de e-mail para listar os usuários!"]);
		return newDataset;
	}
	var email = fields[0];
	var clientOauth = null;
	var assertion = null;
	try{
      var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId : getValue("WKCompany") + '',
            serviceCode : 'Identity',
            endpoint : apiUrl + 'oauth2/clients/' + clientId + '/assertion',
            method : 'GET',// 'delete', 'patch', 'put', 'get'     
            timeoutService: '100', // segundos
         options : {
             encoding : 'UTF-8',
             mediaType: 'application/json',
             useSSL:true,
             crossDomain: true
          },
         headers: {
             'Content-Type': 'application/json;charset=UTF-8'
         }
        }
        clientOauth = clientService.invoke(JSON.stringify(data));
        assertion = clientOauth.getResult()+'';  
		
        data2 = {
                companyId : getValue("WKCompany") + '',
                serviceCode : 'Identity',
                endpoint : apiUrl + 'oauth2/auth',
                method : 'POST',     
                strParams : 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + String(assertion),
              options : {
                 encoding : 'UTF-8',
                 useSSL:true,
                 crossDomain: true
              },
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
        }

        var clientService2 = fluigAPI.getAuthorizeClientService();
        var clientOauth2 = clientService2.invoke(JSON.stringify(data2));
        var json = JSON.parse(clientOauth2.getResult());
        var accessToken = json.access_token;

        data3 = {
                companyId : getValue("WKCompany") + '',
                serviceCode : 'Identity',
                endpoint : apiUrl + 'companies/'+String(companyId)+'/active-directories/'+String(activeDir)+'/users/email/'+ email,
                method : 'GET',
              options : {
                 encoding : 'UTF-8',
                 useSSL:true,
                 crossDomain: true
              },
             headers: {
                 'Content-Type': 'application/json;charset=UTF-8',
                 'Authorization': accessToken

             }
        }
        var clientService3 = fluigAPI.getAuthorizeClientService();
        var clientOauth3 = clientService3.invoke(JSON.stringify(data3));
        var jsonUser = JSON.parse(clientOauth3.getResult());
        var cnUser = jsonUser.cn;
		newDataset.addColumn("adUsername");
		newDataset.addRow([cnUser +""]);
		return newDataset;
	}catch(e){
		log.error("Ocorreu um erro ao lista usuário do AD do Identity " + e);
		newDataset.addColumn("ERROR");
		newDataset.addRow(["Ocorreu um erro ao lista usuário do AD do Identity " + e]);
		return newDataset;
	}

}