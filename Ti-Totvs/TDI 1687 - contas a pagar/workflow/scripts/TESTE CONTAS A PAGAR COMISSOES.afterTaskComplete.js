function afterTaskComplete(colleagueId,nextSequenceId,userList){


	var ativAtual   = getValue("WKNumState");	
	var processo    = getValue("WKNumProces");    
    var usuario     = getValue("WKUser");
    var numcompany  = new java.lang.Integer(getValue("WKCompany")); 
	var calendar    = java.util.Calendar.getInstance();
	//prod
    var folderId    = 7100; /* 8440114 */ // 10778646;
	//MUDEI PARA A PASTA QUE CRIEI - HENRIQUE
    //var folderId    = 2876596;
    /* 1710338; */ /*DESENV*/ /* número do caminho a ser criada as pastas */
	var senha       = getValue("WKUserPassword");
	var ano         = hAPI.getCardValue("IdAno"); 
	var mes         = hAPI.getCardValue("IdMes"); 
	var fornec      = hAPI.getCardValue("EmpresaPag");
	var nfEletron   = hAPI.getCardValue("Eletron");
	var NF8hfiscal   = hAPI.getCardValue("NF8hfiscal");
	
	// PRE
	var LOGININTEGRADOR = "paulo.rsolza@totvs.com.br";
	var USERCODEINTEGRADOR = "paulo.rsolza@totvs.com.br";
	var PASSWORDINTEGRADOR = "Totvs@12345";
	
	// DESENV
    //var LOGININTEGRADOR = "JV.TDI.PORTAIS@totvs.com.br";
    //var USERCODEINTEGRADOR = "JV.TDI.PORTAIS";
     //var PASSWORDINTEGRADOR = "Adminportal!1";
	
	log.info("JuckENTROU EM AFTERTASKCOMPLETE ============== " + ativAtual + " - " + processo + " - " + usuario + " - " + numcompany + " - " + nextSequenceId + " senha...:" + senha);
	
	if(ativAtual == 10 && nextSequenceId == 1){
		log.info("Irá enviar email ============== " );
		sendEmail();
	}

	if (ativAtual == 22)  {

		
		log.info("ATIVIDADE 27777777777777777777777777777777777777777777777");
		
	    // Busca doctos anexados ao processo
		try
		{
			/*var toolkitServiceProvider = ServiceManager.getServiceInstance("toolkit");
			var toolkitServiceLocator = toolkitServiceProvider.instantiate("com.datasul.ecm.webservices.ToolKitServiceServiceLocator");
			var toolkitService = toolkitServiceLocator.getToolKitServicePort();*/
			var listDocuments = hAPI.listAttachments();
		}
		catch(e){
			log.info("erro ao tentar acessar a lista de documentos - listattachments: " + e.message);
			hAPI.setCardValue("idErro","Erro ao tentar acessar a lista de documentos - listattachments:,verifique se os arquivos do processo foram anexados na estrutura VP Administrativa Financeira / CST / Adm de Contratos de Fornecedores / BASE PARA FORMULÁRIOS / FORMULÁRIOS/... " +
					"Caso não tenha publicado os anexos, contate a área de Atendimento FLUIG.");
			return;
		}

		try
		{
	        var documentServiceProviderFolder = ServiceManager.getServiceInstance("FolderService");
	    	//DES
	        var documentServiceLocatorFolder = documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.ECMFolderServiceServiceLocator");
       	    //var documentServiceLocatorFolder = documentServiceProviderFolder.instantiate("com.datasul.technology.webdesk.dm.ws.FolderServiceServiceLocator");  /* PRODUÇÃO */
	 		var documentServiceFolder = documentServiceLocatorFolder.getFolderServicePort();
		}
		catch(e){
			log.info("erro ao tentar acessar o serviço FolderService: " + e.message);
			hAPI.setCardValue("idErro","Erro ao tentar acessar o serviço FolderService, verifique se os arquivos do processo foram anexados na estrutura VP Administrativa Financeira / CST / Adm de Contratos de Fornecedores / BASE PARA FORMULÁRIOS / FORMULÁRIOS/..." +
					"Caso não tenha publicado os anexos, contate a área de Atendimento FLUIG.");
			return;
		}


		// Busca o webservices de documentos
		 
		try
		{
			var documentServiceProvider = ServiceManager.getServiceInstance("DocumentService");
			//DES
			var documentServiceLocator = documentServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.ECMDocumentServiceServiceLocator");
			//var documentServiceLocator = documentServiceProvider.instantiate("com.datasul.technology.webdesk.dm.ws.DocumentServiceServiceLocator");	  /* PRODUÇÃO */	
			var documentService = documentServiceLocator.getDocumentServicePort();
		}	
		catch(e){
			log.info("erro ao tentar acessar o serviço DocumentService: " + e.message);
			hAPI.setCardValue("idErro", "Erro ao tentar acessar o serviço DocumentService,verifique se os arquivos do processo foram anexados na estrutura VP Administrativa Financeira / CST / Adm de Contratos de Fornecedores / BASE PARA FORMULÁRIOS / FORMULÁRIOS/..." +
					"Caso não tenha publicado os anexos, contate a área de Atendimento FLUIG.");
			return;
			
		}
			

		if (listDocuments.size() > 0) {   

			var document = new Array( );

			var doc =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentDto");
			
			log.info("DEPOIS DO DocumentDto ============== " );

			var temp;

			var expires = false;

			var notify = false;

			var topic;

			var attach;

			var attachArray;

			var security;

			var version;

			var listAttach = new Array( );



			/* verifica se já existe pasta para ano competência*/

			var c1 = DatasetFactory.createConstraint("parentDocumentId", folderId,folderId,ConstraintType.MUST);

			var c2 = DatasetFactory.createConstraint("documentDescription", ano,ano,ConstraintType.MUST);

			var c3 = DatasetFactory.createConstraint("activeVersion", "true","true",ConstraintType.MUST);

			var constraints = new Array(); 

			constraints.push(c1);

			constraints.push(c2);

			constraints.push(c3);

			var pastaAno = DatasetFactory.getDataset("document", null, constraints, null);


	        if(pastaAno){

				log.info("entrou pasta ano.../ano:" + ano);

				if(pastaAno.values.length > 0){

					var anoParentId  = pastaAno.getValue(0,"documentPK.documentId");

					var anoNomePasta = pastaAno.getValue(0,"documentDescription");

					folderId     = anoParentId;

					log.info("Valor do folderId/anoParentId/descricao...:" + folderId + " - " + anoParentId + " - " + anoNomePasta);	

				}

				else{

				

					/* Cria a pasta com descrição do Ano de competência */

					doc.setDocumentId(0);

					doc.setVersion(0);

					doc.setParentDocumentId(folderId); // FIXO

					doc.setDocumentDescription(ano);

					doc.setAdditionalComments("Processo Nota Fiscal Pagamento" );

					doc.setDocumentKeyWord("Nota Fiscal");

					doc.setVersionDescription("\nProcesso:" + processo);

					doc.setDocumentTypeId("Nota Fiscal");

					doc.setExpires(false);

					doc.setPublisherId(usuario);

					doc.setIconId(23);

					doc.setCompanyId(numcompany);

					doc.setColleagueId(usuario);

					doc.setApproved(true);

					doc.setActiveVersion(true);

					doc.setCreateDate(calendar);

					doc.setDocumentType("1");

					doc.setDocumentTypeId("1");

					doc.setInheritSecurity(true);

					doc.setTopicId(1);

					doc.setUserNotify(false);

					doc.setValidationStartDate(calendar);

					doc.setVersionOption("0");

					doc.setVolumeId("Default");			

					document[0] = doc;



					var docArray         =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentDtoArray");

					var docArraySecurity =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDtoArray");

					var docArrayApprover =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDtoArray");

					docArray.setItem(document);



					// Cria o documento no Webdesk



					log.info("CRIANDO DOCUMENTO...: " + usuario + " senha...: " + senha);

					var createDoc = documentServiceFolder.createFolder(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, docArray, docArraySecurity, docArrayApprover);

					log.info("CRIADO");

					log.info(createDoc);

					var wsmano =  createDoc.getItem(0);

					log.info("wsmDocumentIdAno" + wsmano.getDocumentId());

					log.info("wsmgetVersionAno" + wsmano.getVersion());

					folderId = wsmano.getDocumentId();

				}

			}	

			

			/* Verifica se já existe a pasta mês competência */

			var c1 = DatasetFactory.createConstraint("parentDocumentId", folderId,folderId,ConstraintType.MUST);

			var c2 = DatasetFactory.createConstraint("documentDescription", mes,mes,ConstraintType.MUST);

			var c3 = DatasetFactory.createConstraint("activeVersion", "true","true",ConstraintType.MUST);

    		var constraints = new Array(); 

			constraints.push(c1);

			constraints.push(c2);

			constraints.push(c3);

			

			var pastaMes = DatasetFactory.getDataset("document", null, constraints, null);

	        if(pastaMes){

				log.info("entrou pasta mes");

				if(pastaMes.values.length > 0){

					log.info("Valor do folderId...:" + folderId);

					var mesParentId  = pastaMes.getValue(0,"documentPK.documentId");

					var mesNomePasta = pastaMes.getValue(0,"documentDescription");

					folderId     = mesParentId;

					log.info("Valor do folderId/mesParentId/descricao...:" + folderId + " - " + mesParentId + " - " + mesNomePasta);	

				}

				else{

					/* Cria a pasta com mês de competência */

					doc.setDocumentId(0);

					doc.setVersion(0);

					doc.setParentDocumentId(folderId); // FIXO

					doc.setDocumentDescription(mes);

					doc.setAdditionalComments("Processo Nota Fiscal Pagamento" );

					doc.setDocumentKeyWord("Nota Fiscal");

					doc.setVersionDescription("\nProcesso:" + processo);

					doc.setDocumentTypeId("Nota Fiscal");

					doc.setExpires(false);

					doc.setPublisherId(usuario);

					doc.setIconId(23);

					doc.setCompanyId(numcompany);

					doc.setColleagueId(usuario);

					doc.setApproved(true);

					doc.setActiveVersion(true);

					doc.setCreateDate(calendar);

					doc.setDocumentType("1");

					doc.setDocumentTypeId("1");

					doc.setInheritSecurity(true);

					doc.setTopicId(1);

					doc.setUserNotify(false);

					doc.setValidationStartDate(calendar);

					doc.setVersionOption("0");

					doc.setVolumeId("Default");			

					document[0] = doc;





					var docArray         =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentDtoArray");

					var docArraySecurity =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDtoArray");

					var docArrayApprover =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDtoArray");

					docArray.setItem(document);





					// Cria o documento no Webdesk

					log.info("CRIANDO DOCUMENTO");

					var createDoc = documentServiceFolder.createFolder(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, docArray, docArraySecurity, docArrayApprover);

					log.info("CRIADO");

					log.info(createDoc);

					var wsmes =  createDoc.getItem(0);

					log.info("wsmesDocumentId" + wsmes.getDocumentId());

					log.info("wsmesgetVersion" + wsmes.getVersion());

					folderId = wsmes.getDocumentId();

				}	

			}

			

			/* verifica se já existe pasta para o fornecedor da nota*/

			var c1 = DatasetFactory.createConstraint("parentDocumentId", folderId,folderId,ConstraintType.MUST);

			var c2 = DatasetFactory.createConstraint("documentDescription", fornec,fornec,ConstraintType.MUST);

			var c3 = DatasetFactory.createConstraint("activeVersion", "true","true",ConstraintType.MUST);

			var constraints = new Array(); 

			constraints.push(c1);

			constraints.push(c2);

			constraints.push(c3);

			var pastaFornec = DatasetFactory.getDataset("document", null, constraints, null);


	        if(pastaFornec){

				log.info("entrou pasta fornec");

				if(pastaFornec.values.length > 0){

					log.info("Valor do folderId...:" + folderId);

					var fornecParentId  = pastaFornec.getValue(0,"documentPK.documentId");

					var fornecNomePasta = pastaFornec.getValue(0,"documentDescription");

					folderId     = fornecParentId;

					log.info("Valor do folderId/anoParentId/descricao...:" + folderId + " - " + fornecParentId + " - " + fornecNomePasta);	

				}

				else{

					/* Cria a pasta para o fornecedor da nota */

					doc.setDocumentId(0);

					doc.setVersion(0);

					doc.setParentDocumentId(folderId); // FIXO

					doc.setDocumentDescription(fornec);

					doc.setAdditionalComments("Processo Nota Fiscal Pagamento" );

					doc.setDocumentKeyWord("Nota Fiscal");

					doc.setVersionDescription("\nProcesso:" + processo);

					doc.setDocumentTypeId("Nota Fiscal");

					doc.setExpires(false);

					doc.setPublisherId(usuario);

					doc.setIconId(23);

					doc.setCompanyId(numcompany);

					doc.setColleagueId(usuario);

					doc.setApproved(true);

					doc.setActiveVersion(true);

					doc.setCreateDate(calendar);

					doc.setDocumentType("1");

					doc.setDocumentTypeId("1");

					doc.setInheritSecurity(true);

					doc.setTopicId(1);

					doc.setUserNotify(false);

					doc.setValidationStartDate(calendar);

					doc.setVersionOption("0");

					doc.setVolumeId("Default");			

					document[0] = doc;



					var docArray         =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentDtoArray");

					var docArraySecurity =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDtoArray");

					var docArrayApprover =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDtoArray");

					docArray.setItem(document);



					// Cria o documento no Webdesk

					log.info("CRIANDO DOCUMENTO");

					var createDoc = documentServiceFolder.createFolder(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, docArray, docArraySecurity, docArrayApprover);

					log.info("CRIADO");

					log.info(createDoc);

					var wsmfornec =  createDoc.getItem(0);

					log.info("wsmfornecDocumentId" + wsmfornec.getDocumentId());

					log.info("wsmfornecgetVersion" + wsmfornec.getVersion());

					folderId = wsmfornec.getDocumentId();

				}

			}	



			log.info("CRIANDO DOCUMENTO, DENTRO DE:..." + folderId);

			/* Cria a pasta com o número do pedido */

			doc.setDocumentId(0);

			doc.setVersion(0);

			doc.setParentDocumentId(folderId); // FIXO

			doc.setDocumentDescription(hAPI.getCardValue("NrPedido"));

			doc.setAdditionalComments("Processo Nota Fiscal Pagamento" );

			doc.setDocumentKeyWord("Nota Fiscal");

			doc.setVersionDescription("\nProcesso:" + processo);

			doc.setDocumentTypeId("Nota Fiscal");

			doc.setExpires(false);

			doc.setPublisherId(usuario);

			doc.setIconId(23);

			doc.setCompanyId(numcompany);

			doc.setColleagueId(usuario);

			doc.setApproved(true);

			doc.setActiveVersion(true);

			doc.setCreateDate(calendar);

			doc.setDocumentType("1");

			doc.setDocumentTypeId("1");

			doc.setInheritSecurity(true);

			doc.setTopicId(1);

			doc.setUserNotify(false);

			doc.setValidationStartDate(calendar);

			doc.setVersionOption("0");

			doc.setVolumeId("Default");			

    		document[0] = doc;



			var docArray         =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentDtoArray");

			var docArraySecurity =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDtoArray");

			var docArrayApprover =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDtoArray");

			docArray.setItem(document);



			// Cria o documento no Webdesk

     		log.info("CRIANDO DOCUMENTO");

			var createDoc = documentServiceFolder.createFolder(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, docArray, docArraySecurity, docArrayApprover);

			log.info("CRIADO");

			log.info(createDoc);

			var wsm =  createDoc.getItem(0);

			log.info("wsmDocumentId" + wsm.getDocumentId());

			log.info("wsmgetVersion" + wsm.getVersion());

			 
			
			log.info ("NOTAFISCALPAGTO - pto xxxx  - anexo!");
            
            for (var i = 0; i < listDocuments.size(); i++) {
               log.info("NOTAFISCALPAGTO - cris1 ANEXAR OS ARQUIVOS NA PASTA ============== " );
                   
               	var doclist = listDocuments.get(i);
                   
               	
               	log.info("NOTAFISCALPAGTO -  BEFORETASKCOMPLETE - DOCS ANEXOS - fileName: " + doclist.getPhisicalFile());
                
               	attach = documentServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.Attachment");
                attach.setFileName(doclist.getPhisicalFile());
				
				log.info("NOTAFISCALPAGTO -  BEFORETASKCOMPLETE - DOCS ANEXOS - WKUser: " +  getValue("WKUser"));
				log.info("NOTAFISCALPAGTO -  BEFORETASKCOMPLETE - DOCS ANEXOS - WKUserPassword: " + getValue("WKUserPassword"));
				log.info("NOTAFISCALPAGTO -  BEFORETASKCOMPLETE - DOCS ANEXOS - numcompany: " + numcompany);
				log.info("NOTAFISCALPAGTO -  BEFORETASKCOMPLETE - DOCS ANEXOS - doclist.getDocumentId: " + doclist.getDocumentId());
				log.info("NOTAFISCALPAGTO -  BEFORETASKCOMPLETE - DOCS ANEXOS - doclist.getVersion: " + doclist.getVersion());
				log.info("NOTAFISCALPAGTO - BEFORETASKCOMPLETE - DOCS ANEXOS - doclist.getPhisicalFile: " + doclist.getPhisicalFile());
				//LOGININTEGRADOR,PASSWORDINTEGRADOR,USERCODEINTEGRADOR
				
				//attach.setFilecontent(documentService.getDocumentContent(getValue("WKUser"), "md5:"+getValue("WKUserPassword"), numcompany, doclist.getDocumentId(), getValue("WKUser"), doclist.getVersion(), doclist.getPhisicalFile()));
				attach.setFilecontent(documentService.getDocumentContent(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, doclist.getDocumentId(), getValue("WKUser"), doclist.getVersion(), doclist.getPhisicalFile()));
				attach.setPrincipal(true);
               	
                listAttach[0] = attach;
                attachArray = documentServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.AttachmentArray");


               attachArray.setItem(listAttach);

               log.info("ANEXAR OS ARQUIVOS NA PASTA ============== DADOS DO METODO - LOGININTEGRADOR: " + LOGININTEGRADOR + " - USERCODEINTEGRADOR: "+ USERCODEINTEGRADOR +" : "+PASSWORDINTEGRADOR+" : "+numcompany+" : "+doclist.getDocumentId()+" : "+doclist.getVersion() + " : "+usuario);
               
               //document = documentService.getDocumentVersion(USERCODEINTEGRADOR, PASSWORDINTEGRADOR, numcompany, doclist.getDocumentId(), doclist.getVersion(), usuario);
               document = documentService.getDocumentVersion(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, doclist.getDocumentId(), doclist.getVersion(), usuario);
               
               log.info("ANEXAR OS ARQUIVOS NA PASTA ============== pto 1" );
               
               doc = document.getItem(0);
               doc.setDocumentId(0);
               doc.setVersion(0);
               doc.setParentDocumentId(wsm.getDocumentId()); // FIXO
               doc.setDocumentDescription(doclist.getPhisicalFile());
               doc.setAdditionalComments("Processo Nota Fiscal Pagamento");
               doc.setDocumentKeyWord("Processo Nota Fiscal Pagamento");
               doc.setVersionDescription("\nProcesso:" + processo);
               doc.setExpires(false);
               doc.setPublisherId(usuario);
               doc.setIconId(21);
               doc.setCompanyId(numcompany);
               doc.setColleagueId(usuario);
               doc.setApproved(true);
               doc.setActiveVersion(true);
               doc.setCreateDate(calendar);
               doc.setDocumentType("1");
               doc.setInheritSecurity(true);
               doc.setTopicId(1);
               doc.setUserNotify(false);
               doc.setValidationStartDate(calendar);
               
               log.info("ANEXAR OS ARQUIVOS NA PASTA ============== pto 2" );
               
               doc.setVersionOption("0");
               doc.setVolumeId("Default");

               try  {
                      doc.setUpdateIsoProperties(true);
               }
               catch(e){
                      log.info("erro ao tentar doc.setUpdateIsoProperties(true);");
               }
               document.setItem(0, doc);
            
	            // Cria o documento no Webdesk
	            try{
	                  log.info("PUBLICANDO DOCUMENTO");
	                  //var createDoc = documentService.createDocument(USERCODEINTEGRADOR, PASSWORDINTEGRADOR, numcompany, document, attachArray, null, null, null);
	                  var createDoc = documentService.createDocument(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, document, attachArray, null, null, null);
	                  log.info("PUBLICADO");
	                  log.info(createDoc);
	            }
	            catch(e){
	                   log.info("erro ao tentar publicar os anexos, favor verificar!" + e.message);
	                   form.setValue("idErro","Erro ao tentar publicar os anexos, Caso nao tenha publicado os anexos, contate a Area de Atendimento FLUIG.");
	            }
	        }
            
            
/* logica antiga


			//Publicar o documento na pasta 

			for (var i = 0; i < listDocuments.size(); i++) {

				log.info("ANEXAR OS ARQUIVOS NA PASTA ============== " );

				// SeÃ§Ã£o para atachar o arquivo ao documento 

				attach = documentServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.Attachment");

				attach.setFileName(listDocuments[i].getPhisicalFile());

				log.info("fileName: " + listDocuments[i].getPhisicalFile());

				attach.setFilecontent(listDocuments[i].getFileContent());

				attach.setPrincipal(true);

				listAttach[0] = attach;

				attachArray = documentServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.AttachmentArray");

				attachArray.setItem(listAttach);

	

				log.info("Inicio publicar Documento" );
				log.info("getDocumentId...:" + listDocuments[i].getDocumentId() + " - " + "version...:" + listDocuments[i].getVersion() + " - " + "usuario..: " + usuario);

				document = documentService.getDocumentVersion(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, listDocuments[i].getDocumentId(), listDocuments[i].getVersion(), usuario);

	

				doc = document.getItem(0);

				doc.setDocumentId(0);

				doc.setVersion(0);

				doc.setParentDocumentId(wsm.getDocumentId()); // FIXO

				doc.setDocumentDescription(listDocuments[i].getPhisicalFile());

				doc.setAdditionalComments("Processo Nota Fiscal Pagamento");

				doc.setDocumentKeyWord("Processo Nota Fiscal Pagamento");

				doc.setVersionDescription("\nProcesso:" + processo);

				doc.setDocumentTypeId("\nProcesso:" + processo);

				doc.setExpires(false);

				doc.setPublisherId(usuario);

				doc.setIconId(21);

				doc.setCompanyId(numcompany);

				doc.setColleagueId(usuario);

				doc.setApproved(true);

				doc.setActiveVersion(true);

				doc.setCreateDate(calendar);

				doc.setDocumentType("1");

				doc.setDocumentTypeId("1");

				doc.setInheritSecurity(true);

				doc.setTopicId(1);

				doc.setUserNotify(false);

				doc.setValidationStartDate(calendar);



				// Mantem a versÃ£o atual do documento

    			doc.setVersionOption("0");

				doc.setVolumeId("Default");

				try

				{

					doc.setUpdateIsoProperties(true);

				}

				catch(e)

				{

					log.info("erro ao tentar doc.setUpdateIsoProperties(true);");

				}

    			document.setItem(0, doc);


				// Cria o documento no Webdesk
    			try{
					log.info("PUBLICANDO DOCUMENTO");
					var createDoc = documentService.createDocument(LOGININTEGRADOR, PASSWORDINTEGRADOR, numcompany, document, attachArray, null, null, null);
					log.info("PUBLICADO");
					log.info(createDoc);
    			}
    			catch(e){
    				log.info("erro ao tentar publicar os anexos, favor verificar!" + e.message);
    				hAPI.setCardValue("idErro","Erro ao tentar publicar os anexos, Caso não tenha publicado os anexos, contate a área de Atendimento FLUIG.");
    			}

			}
			*/

		}
		
	}

}