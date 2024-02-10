function beforeStateEntry(sequenceId){
	var ativAtual   = getValue("WKNumState");	
	var processo    = getValue("WKNumProces");    
    var numcompany  = new java.lang.Integer(getValue("WKCompany")); 
	var senha       = getValue("WKUserPassword");
    var usuario     = getValue("WKUser");
    var isMobile = getValue("WKMobile");
    log.info("#isMobile: "+isMobile);
	var formAtual = getValue("WKFormId");
	
    var userList    = new java.util.ArrayList();

	log.info("SOLICPAGAMENTO - FUNCAO BEFORESTATEENTRY - INICIO : PROCESSO: " + processo + 
			 "ativ atual: " + ativAtual + 
			 "sequenceId: " + sequenceId +
			 " processo: " + processo +
			 " usuario: " + usuario );

	log.info ("fomulario do processo numero:" + formAtual);
		
	
	if (sequenceId != 1){
		hAPI.setCardValue("cdSolicitacao", processo);
		log.info("CRIS123 - NUMERO SOLICITACAO: " + hAPI.getCardValue("cdSolicitacao"));

		// PARA GRAVAR DADOS NO CAMPO IDENTIFICADOR - CENTRAL DE TAREFAS
		var cIdent = "";
		cIdent = "Unidade: " + hAPI.getCardValue("hiddenNmFilial") + "-Dt.Pagto: " + hAPI.getCardValue("dataPagamento") + 
				 "-Solic:" + processo + "-TituloNr: " + hAPI.getCardValue("numTitulo");
		hAPI.setCardValue("hiddenIdentificador", cIdent);
		log.info ("SOLICPAGAMENTO - BEFORE STATE ENTRY - GRAVOU IDENTIFICADOR");
	}
	
	
	try{
    	if (globalVars.get("LOGININTEGRADOR") == null ||
			globalVars.get("PASSWORDINTEGRADOR") == null ||
			globalVars.get("pastaOrigem") == null ||
			globalVars.get("pastaDestino") == null) {
			//SETA AMBIENTE
	    	var res = setaAmbiente();
	    	var LOGININTEGRADOR = res.getValue(0,"login");
	    	var PASSWORDINTEGRADOR = res.getValue(0,"password");
	    	var pastaOrigem = res.getValue(0,"pastaOrigem");
	    	var pastaDestino = res.getValue(0,"pastaDestino");
	    	
	    	globalVars.put("LOGININTEGRADOR",LOGININTEGRADOR);
	    	globalVars.put("PASSWORDINTEGRADOR",PASSWORDINTEGRADOR);
	    	globalVars.put("pastaOrigem",pastaOrigem);
	    	globalVars.put("pastaDestino",pastaDestino);
	
	    	log.info("SOLICPAGAMENTO -  FUNCAO BEFORESTATEENTRY - SETA AMBIENTE ativ 63!!! - "+
	    			"LOGININTEGRADOR: " + LOGININTEGRADOR +
	    			"PASSWORDINTEGRADOR;" + PASSWORDINTEGRADOR +
	    			"pastaOrigem: " + pastaOrigem +
	    			"pastaDestino: " + pastaDestino );
		}
	}
	catch (e) {
    	log.info("SOLICPAGAMENTO - FUNCAO BEFORESTATEENTRY - ERRO AO SETAR VARIAVEIS DE INTEGRACAO: "  + e);
    	throw("SOLICPAGAMENTO - FUNCAO BEFORESTATEENTRY - ERRO AO SETAR VARIAVEIS DE INTEGRACAO: " + e);
	}
	
	if (sequenceId == 155){
		hAPI.setCardValue("hiddenGestorAprovou","");	
	} 
	else if (sequenceId == 55){
		hAPI.setCardValue("hiddenFiscalAprovou","");	
	}
	else if (sequenceId == 142){
		hAPI.setCardValue("hiddenContasPagarAprovou","");	
	}
	else if (sequenceId == 5){
		hAPI.setCardValue("hiddenCPGeraTituloAprovou","");	
	}

	if (sequenceId == 2){
	log.info("@@@PAGAMENTO Entrou na atividade 2")	
	if (parseInt(hAPI.getCardValue("hiddenNumTotAprovac"),10) >= parseInt(hAPI.getCardValue("hiddenNumeroDaVez"),10)){log.info("@@@PAGAMENTO Cond 1")}	
	if (hAPI.getCardValue("hiddenNumTotAprovac") >= hAPI.getCardValue("hiddenNumeroDaVez")){log.info("@@@PAGAMENTO Cond 2")}	
		var form = hAPI.getCardData(processo); // pega todos os campos do formulario de uma vez so
		
		log.info ("CRIZZ1 - SOLICPAGAMENTO - BEFORE STATE ENTRY - ATIVIDADE 2 - DADOS: " +
				  "form.get(hiddenNumTotAprovac): " + form.get("hiddenNumTotAprovac") +
				  "form.get(hiddenNumeroDaVez): " + form.get("hiddenNumeroDaVez") );
	}
	
	
	
	if (sequenceId == 7){
		hAPI.setCardValue("hiddenFim", "Sim");
		log.info("SOLIC PAGTO FIM: " + hAPI.getCardValue("hiddenFim"));
	}
	
	
	
	// VERIFICAR SE POSSUI ANEXO, CASO ESCOLHIDA OPCAO BOLETO BANCARIO
    if (sequenceId == 173){
		
		log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ATIVIDADE 173 - forma pagamento: " + hAPI.getCardValue("formaPagto"));
		
		// SE FOR BOLETO BANCARIO
		if (hAPI.getCardValue("formaPagto") == "1") { 
		
			log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - toolkit - forma pagto = 1");
			// Buscar os anexos
			log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - toolkit - pto 0");
			
			/*var toolkitServiceProvider ;
			var toolkitServiceLocator ;
			var toolkitService ;*/
			var listDocuments ;
			var lErro = false;
			
			try {
				/*toolkitServiceProvider = ServiceManager.getServiceInstance("toolkit");
				toolkitServiceLocator = toolkitServiceProvider.instantiate("com.datasul.ecm.webservices.ToolKitServiceServiceLocator");
				toolkitService = toolkitServiceLocator.getToolKitServicePort();*/
				//listDocuments = toolkitService.getDocumentFromProcess(numcompany, processo);
				listDocuments = hAPI.listAttachments();
				log.info ("SOLICPAGAMENTO - BEFORESTATEENTRY - servico toolkit ok");
			} //try         
			catch(error) 
			{ 
				lErro = true;
				log.info ("SOLICPAGAMENTO - BEFORESTATEENTRY - servico toolkit NOK");
				throw "Erro ao utilizar o servico toolkit!! Favor contatar o atendimento!";
			}
			
			if (lErro == false){
				if (listDocuments.size() == 0) {                  // || listDocuments.length == 0) {
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ENTROU NO listDocumentos == null");
					throw "BEFORESTATEENTRY - Para enviar o processo o Boleto deve ser anexado a partir da Aba ANEXOS!";
				}
				else{
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - listDocumentos NAO ? null");
					//quando for de uma autom customiz 
					//para uma automatica - losango - tem que ser para usuario System:Auto
					// senao vai para o usuario que quiser
					userList.clear();
					userList.add("System:Auto");
					hAPI.setAutomaticDecision(244, userList, "Observa??o");
					userList.add("");
				}
			}
			
		}
		else{
			//quando for de uma autom customiz 
			//para uma automatica - losango - tem que ser para usuario System:Auto
			// senao vai para o usuario que quiser
			log.info("crizzz SOLICPAGAMENTO - BEFORESTATEENTRY - forma pagamento # 1 ");
			userList.clear();
			userList.add("System:Auto");
			hAPI.setAutomaticDecision(244, userList, "Observa??o");
			userList.add("");
		}

		log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ATIV 173 - FIM");
			
    } // FIM ATIV 173
   
	if (sequenceId == 177){ 
		
		log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ATIVIDADE 177");
		
		var form = hAPI.getCardData(processo); // pega todos os campos do formulario de uma vez so
		
		var cHidden;
		var aprovadorDaVez = "";
		log.info ("form.get(hiddenAprovadorDaVez): " + form.get("hiddenAprovadorDaVez") +
				  "form.get(hiddenNumTotAprovac): " + form.get("hiddenNumTotAprovac") +
				  "form.get(hiddenNumeroDaVez): " + form.get("hiddenNumeroDaVez") );
		
		if (parseInt(form.get("hiddenNumTotAprovac")) >= parseInt(form.get("hiddenNumeroDaVez"))){

			// a primeira vez sempre tem usuar ou papel junto do conteudo 
			cHidden = form.get("hiddenAprovadorDaVez"); 
			log.info("hiddenAprovadorDaVez:" + cHidden.substring(0,5) + " - " + cHidden.substring(6,cHidden.length()) );
			
			userList.clear();
			if (cHidden.substring(0,5) == "USUAR"){
				
				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ? USUAR"); 
						
				if (form.get("hiddengestorAprovadorPri") == ""){
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - hiddengestorAprovadorPri == branco ");
					// Se  eh o primeiro (1==1, 5=5 - o index do grid nao significa o numero de linhas)
					aprovadorDaVez = cHidden.substring(6,cHidden.length()); 
					userList.add(aprovadorDaVez);
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - aprovadorDaVez: " + aprovadorDaVez);
					hAPI.setCardValue("hiddengestorAprovadorPri","Nao");
					hAPI.setAutomaticDecision(155, userList, "DIRECIONADO PARA O GESTOR DO DESTINATARIO DA DESPESA");
				}
				else{
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - hiddengestorAprovadorPri # de branco ");
					
					// procura se o proximo gestor eh ativo. caso nao seja ativo, vai p proximo.
					var lFirst = false;
					var ret = 0;
					var record;
					var matr;
					var nom;
					var mail;
					var ativo;
					var fields;
					var c1 ;
					var constraints1 ;
					var colaborador ;
					var row;
					var index;
					aprovadorDaVez = "";
					
					for (var i = parseInt(form.get("hiddenNumeroDaVez")); i <= parseInt(form.get("hiddenNumTotAprovac")); i++) {
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - CENTRO DO FOR: " + i);
						
						cHidden = form.get("idMatrAprovador___" + i.toString());
						aprovadorDaVez = cHidden.substring(0,cHidden.length());

						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - CENTRO DO FOR: aprovadorDaVez:"  + i + " - " + aprovadorDaVez);
						
						fields = new Array("colleaguePK.colleagueId","colleagueName","mail","active");
						c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId",aprovadorDaVez,aprovadorDaVez, ConstraintType.MUST);
						constraints1 = new Array(c1);
						colaborador = DatasetFactory.getDataset("colleague", fields, constraints1, null);
						
						if (colaborador != null) {
				    				
							log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - retorno colaborador ok");
						
							matr = colaborador.getValue(0,"colleaguePK.colleagueId");
							nom  = colaborador.getValue(0,"colleagueName");
							mail = colaborador.getValue(0,"mail");
							ativo = colaborador.getValue(0,"active");
								
							log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ativo: " + ativo);
							
							if (ativo == "true") {
								log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - COLABORADOR ATIVO: " + i + " - " + matr);
								
								lFirst = true;

								hAPI.setCardValue("idMatrAprovador___" + i.toString(),matr);
								hAPI.setCardValue("idNomeAprovador___" + i.toString(),nom);
								hAPI.setCardValue("idEmailAprovador___" + i.toString(),mail);
								
								hAPI.setCardValue("hiddenNumeroDaVez",i.toString());									
								break; // sai quando encontrar o primeiro
							} // if
						} //if
					} // for

					if (lFirst == true){
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - lFirst == true >> hiddengestorAprovadorPri = Nao - vai para 155");
						userList.add(matr);
						hAPI.setCardValue("hiddenAprovadorDaVez","USUAR:" + matr);
						hAPI.setCardValue("hiddengestorAprovadorPri","Nao");
						hAPI.setAutomaticDecision(155, userList, "DIRECIONADO PARA O GESTOR DO DESTINATARIO DA DESPESA");
					}
					// SE DEPOIS DO PRIMEIRO, NAO ENCONTRAR UM GESTOR ATIVO, VAI PARA 
					// A ATIVIDADE AUTOMATICA DAS OUTRAS APROVACOES - PA E CTAS PAGAR
					else{
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - else lFirst != true >> hiddengestorAprovadorPri = Nao - vai para 43");
						userList.add(usuario);
						hAPI.setCardValue("hiddenAprovadorDaVez","");
						hAPI.setCardValue("hiddengestorAprovadorPri","Nao");
						hAPI.setAutomaticDecision(43, userList, "DIRECIONADO PARA ATIVIDADE AUTOMATICA - APROVACOES PA E VALIDACAO CTAS A PAGAR");
					}
				} // else
			}
			//SE FOR POOL DE USUARIO
			else{
				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - else - Pool:Role:" + cHidden.substring(6,cHidden.length()));
				
				userList.add("Pool:Role:" + cHidden.substring(6,cHidden.length()));
				//userList.add("13849989");
				//hAPI.setCardValue("hiddenAprovadorDaVez","");
				hAPI.setAutomaticDecision(155, userList, "DIRECIONADO PARA O PAPEL DO GESTOR DO SOLICITANTE");				
			}
		} // if O NUMERO TOT FOR MENOR QUE O APROVADOR DA VEZ
		else{
			/*
			// 16/10 - MUDANCA AQUI - ESTAVA hAPI.setAutomaticDecision(2, usuario, "Decisao tomada automaticamente pelo Fluig.");
			log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - else numero tot menor que aprovador da vez === ativ 2, para direcionar para as outras aprovac");
			userList.clear();
			userList.add(usuario);
			hAPI.setAutomaticDecision(43, userList, "Decisao tomada automaticamente pelo Fluig.");
			*/
			
			//quando for de uma autom customiz 
			//para uma automatica - losango - tem que ser para usuario System:Auto
			// senao vai para o usuario que quiser
			log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - else numero tot menor que aprovador da vez === ativ 2, para direcionar para as outras aprovac");
			userList.clear();
			userList.add("System:Auto");
			hAPI.setAutomaticDecision(2, userList, "Decisao tomada automaticamente pelo Fluig.");
			userList.add("");

		}
		
	
    } // fim if sequenceId 177
	
	if((ativAtual == 155 && sequenceId == 96) || 
			(ativAtual == 55 && sequenceId == 96) || 
			(ativAtual == 142 && sequenceId != 43)){
		if (getValue("WKUserComment") == null ||getValue("WKUserComment") == "" ) {			
			//throw "É necessário informar a justificativa da movimentação na aba Complementos!";
		}
	}

	if (ativAtual == 5){
	 
	    log.info("cris a --> usuario: " + usuario);

	//if (sequenceId == 96 || sequenceId == 7 ) {
	
		var dataPagto;
	    var dataDem;

		log.info(" SOLICPAGTO - CRIACAO PASTAS E DOCS INICIO  - solic: " + processo + "ativ:" + ativAtual);

		// PROCESSO CRIACAO PASTAS E DOC ANEXO E DOC ESPELHO
		
		
		//para pegar nos outros scripts de evento
		
		
		var LOGININTEGRADOR = globalVars.get("LOGININTEGRADOR");
    	var PASSWORDINTEGRADOR = globalVars.get("PASSWORDINTEGRADOR");
    	var pastaOrigem = globalVars.get("pastaOrigem");
    	var pastaDestino = globalVars.get("pastaDestino");

    	log.info(" SOLICPAGTO - CRIACAO PASTAS E DOCS INICIO  - solic: " + processo + "ativ:" + ativAtual+
    			"DADOS INTEGRACAO :" +
    			"LOGININTEGRADOR" + LOGININTEGRADOR +
    			"PASSWORDINTEGRADOR" + PASSWORDINTEGRADOR +
    			"pastaOrigem" + pastaOrigem +
    			"pastaDestino" + pastaDestino
    			);
    	
		// TRATAMENTO PARA CRIAR A ESTRUTURA DE PASTAS POR ANO/MES/FORNECEDOR - e doc anexo process
		// TEM QUE SER A ULTIMA ATIVIDADE PARA PEGAR TODOS OS DADOS ATUALIZADOS.
		// NAO PODE ENCERRAR O FLUXO SE NAO ESTIVER OK AS PASTAS E DOC ESPELHO
		
		var calendar    = java.util.Calendar.getInstance();
		
		var doc =  docAPI.newDocumentDto();
		var temp;
		var expires = false;
		var notify = false;
		var topic;
		var attach;
		var attachArray;
		var security;
		var version;
		var listAttach = new Array( );
		
		
		// verifica se ja existe pasta para ano competÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âªncia
		log.info(" SOLICPAGTO - PASTA ANO COMPETENCIA - INICIO");
		
		
		dataPagto 			=  hAPI.getCardValue("dataPagamento"); // pega data de inicio da solic - formulario
	    dataDem 			= dataPagto.split("/"); // faz separacao
	    var mesPagto        = dataDem[1]; // recebe mes da dtRegistro
	    var AnoPagto        = dataDem[2]; // recebe ano da dtRegistro
	    if (mesPagto.length == 1) { 
	    	mesPagto = "0" + mesPagto;
		} 
	  
	    
	    var c6 = DatasetFactory.createConstraint("parentDocumentId",pastaDestino,pastaDestino,ConstraintType.MUST);
		var c7 = DatasetFactory.createConstraint("documentDescription",AnoPagto,AnoPagto,ConstraintType.MUST);
		var c8 = DatasetFactory.createConstraint("activeVersion", "true","true",ConstraintType.MUST);
		var constraintsA = new Array(); 
		constraintsA.push(c6);
		constraintsA.push(c7);
		constraintsA.push(c8);
		
		log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ANTES EXECUTAR DATASET DOCUMENTO PARA ANO");
	
		var pastaAno = DatasetFactory.getDataset("document", null, constraintsA, null);
	
		log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS EXECUTAR DATASET DOCUMENTO - PASTA ANO.value..:" + pastaAno.values.length);
		 
		//se tem a pasta ano
		if (pastaAno){
			
			if (pastaAno.values.length > 0){
				var anoParentId  = pastaAno.getValue(0,"documentPK.documentId");
				var anoNomePasta = pastaAno.getValue(0,"documentDescription");
				pastaDestino     = anoParentId;
				
				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ENCONTROU PASTA ANO - Valor do pastaDestino/anoParentId/descricao...:" + 
						   pastaDestino + " - " + anoParentId + " - " + anoNomePasta);
			}
			else{
				
				try{
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - NAO ENCONTROU PASTA ANO - CRIANDO");
					
					var doc = docAPI.newDocumentDto();
					
					doc.setParentDocumentId(parseInt(pastaDestino)); // FIXO
					doc.setDocumentDescription(AnoPagto);
					doc.setAdditionalComments("Processo Solicitacao de Pagamento" );
					doc.setDocumentKeyWord("SOLICPAGTO-Ano Competencia");
					doc.setVersionDescription("\nProcesso:" + processo);
					doc.setDocumentTypeId("SOLICPAGTO-Ano Competencia");
					doc.setIconId(23);
					doc.setCompanyId(numcompany);
					doc.setDocumentType("1");
					doc.setDocumentTypeId("1");
					doc.setInheritSecurity(true);
					doc.setTopicId(1);
					doc.setVersionOption("0");
					
					// Cria a pasta ANO 
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ANTES CRIAR ANO");
					
					var createDoc = docAPI.createFolder(doc, null, null);
					
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS CRIAR PASTA ANO - createDoc:" + createDoc);
					
					pastaDestino = createDoc.getDocumentId();
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS CRIAR PASTA ANO - pastaDestino:" + pastaDestino);

				} // try 
				catch(error) {
					throw "SOLICPAGAMENTO - BEFORESTATEENTRY - Erro ao criar Pasta Ano!" + error.message;
				}
			
			} // else pasta ano nao criada
		
	    } // if pasta ano
	    
	
		// Verifica se ja existe a pasta mÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âªs competÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âªncia
		log.info("SOLICPAGTO - PASTA MES COMPETENCIA - INICIO");
		
		// se tem a pasta ano, verifica se tem a pasta mes
		if (pastaAno){
	
		   

			var c9 = DatasetFactory.createConstraint("parentDocumentId", pastaDestino,pastaDestino,ConstraintType.MUST);
			var c10 = DatasetFactory.createConstraint("documentDescription", mesPagto,mesPagto,ConstraintType.MUST);
			var c11 = DatasetFactory.createConstraint("activeVersion", "true","true",ConstraintType.MUST);
			var constraintsB = new Array(); 
			constraintsB.push(c9);
			constraintsB.push(c10);
			constraintsB.push(c11);
			
			log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ANTES DE EXECUTAR DATASET DOCUMENTO - PARA MES");
			
			var pastaMes = DatasetFactory.getDataset("document", null, constraintsB, null);
	
			log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS DE EXECUTAR DATASET DOCUMENTO - PASTA MES.value..:" + pastaMes.values.length);
	
	        if (pastaMes){
				if (pastaMes.values.length > 0){
					var mesParentId  = pastaMes.getValue(0,"documentPK.documentId");
					var mesNomePasta = pastaMes.getValue(0,"documentDescription");
					pastaDestino     = mesParentId;
					
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ENCONTROU PASTA MES Valor do pastaDestino/mesParentId/descricao...:" + 
							pastaDestino + " - " + mesParentId + " - " + mesNomePasta);	
				}
				else{
					try{
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - NAO ENCONTROU PASTA MES - CRIANDO");
						
						//varÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â docÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â =ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â docAPI.newDocumentDto();
						var doc = docAPI.newDocumentDto();
						
						// Cria a pasta com mÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âªs de competÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âªncia 
						doc.setParentDocumentId(pastaDestino); // FIXO
						doc.setDocumentDescription(mesPagto);
						doc.setAdditionalComments("Processo Solicitacao de Pagamento" );
						doc.setDocumentKeyWord("SOLICPAGTO-Mes Competencia");
						doc.setVersionDescription("\nProcesso:" + processo);
						doc.setDocumentTypeId("SOLICPAGTO-mes Competencia");
						doc.setIconId(23);
						doc.setCompanyId(numcompany);
						doc.setDocumentType("1");
						doc.setDocumentTypeId("1");
						doc.setInheritSecurity(true);
						doc.setTopicId(1);
						doc.setVersionOption("0");
						
						// Cria a pasta MES 
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ANTES CRIAR PASTA MES");
						
						var createDoc = docAPI.createFolder(doc, null, null);
						
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS CRIAR PASTA MES createDoc: " + createDoc);
						
						pastaDestino = createDoc.getDocumentId();
						
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS CRIAR PASTA MES pastaDestino: " + pastaDestino);
						
	        		} // try 
					catch(error) {
						throw "SOLICPAGAMENTO - BEFORESTATEENTRY - Erro ao criar Pasta Mes !" + error.message;
					}
						
				} // else pasta mes nao criada	
			} // if pasta mes
		} // IF PASTA ANO
	    
		
		if (pastaMes){
			// verifica se ja existe pasta para A EMPRESA PAGADORA
	        log.info("SOLICPAGTO - PASTA EMPRESA PAGADORA - UNIDADE - INICIO");
	        
	        //var empPag      = hAPI.getCardValue("hiddenNmFilial") ; // definicao Bianca
			
			 // VALIDATE FORMS
			 // var empPag      = form.getValue("hiddenNmFilial") + ' - ' + form.getValue("cnpjEmpresa").replaceAll(/[^a-z0-9\s]/gi, '').replaceAll(/[_\s]/g, '-'); // definicao Bianca
			 
			 log.info("SOLICPAGTO - PASTA EMPRESA PAGADORA - vreificacao cnpj");
			 
			var cnpjempresa = hAPI.getCardValue("cnpjEmpresa").replaceAll(/[^a-z0-9\s]/gi, '').replaceAll(/[_\s]/g, '-');
			log.info("SOLICPAGTO - PASTA EMPRESA PAGADORA - resultado  cnpjempresa: " + cnpjempresa);
			
			var empPag      = hAPI.getCardValue("hiddenNmFilial") + ' - ' + cnpjempresa;
			
			log.info("SOLICPAGTO - PASTA EMPRESA PAGADORA - resultado  empPag: " + empPag);
			
			var c15 = DatasetFactory.createConstraint("parentDocumentId",pastaDestino,pastaDestino,ConstraintType.MUST);
			var c16 = DatasetFactory.createConstraint("documentDescription",empPag,empPag,ConstraintType.MUST);
			var c17 = DatasetFactory.createConstraint("activeVersion","true","true",ConstraintType.MUST);
			var constraintsE = new Array(); 
			constraintsE.push(c15);
			constraintsE.push(c16);
			constraintsE.push(c17);
			var pastaEmpPag = DatasetFactory.getDataset("document", null, constraintsE, null);
			
			if (pastaEmpPag){
	        	if (pastaEmpPag.values.length > 0){
					var empPagParentId  = pastaEmpPag.getValue(0,"documentPK.documentId");
					var empPagNomePasta = pastaEmpPag.getValue(0,"documentDescription");
					pastaDestino     = empPagParentId;
					log.info(" SOLICPAGAMENTO - BEFORESTATEENTRY - ENCONTROU PASTA EMPRESA PAGADORA  Valor do pastaDestino/anoParentId/descricao...:" + 
							 pastaDestino + " - " + empPagParentId + " - " + empPagNomePasta);	
				}
				else{
					try{
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - NAO ENCONTROU PASTA EMPRESA PAGADORA - CRIANDO");

						
						//doc = docAPI.newDocumentDto();
						var doc = docAPI.newDocumentDto();

						// Cria a pasta para A EMP PAG 
						doc.setParentDocumentId(pastaDestino); // FIXO
						doc.setDocumentDescription(empPag);
						doc.setAdditionalComments("Processo Solicitacao de Pagamento" );
						doc.setDocumentKeyWord("SOLICPAGTO- empresa pagadora");
						doc.setVersionDescription("\nProcesso:" + processo);
						doc.setDocumentTypeId("SOLICPAGTO- empresa pagadora");
						doc.setIconId(23);
						doc.setCompanyId(numcompany);
						doc.setDocumentType("1");
						doc.setDocumentTypeId("1");
						doc.setInheritSecurity(true);
						doc.setTopicId(1);
						doc.setVersionOption("0");
		
						// Cria a pasta do FORNECEDOR 
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ANTES CRIAR PASTA EMPRESA PAGADORA");
						
						var createDoc = docAPI.createFolder(doc, null, null);
						
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS CRIAR PASTA EMPRESA PAGADORA createDoc: " + createDoc);
						
						pastaDestino = createDoc.getDocumentId();
						
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS CRIAR PASTA EMPRESA PAGADORA pastaDestino: " + pastaDestino);
						
	        		} // try 
					catch(error) {
						throw "SOLICPAGAMENTO - BEFORESTATEENTRY - Erro ao criar Pasta Empresa Pagadora!" + error.message;
					}
					
				} // else
			} //if (pastaEmpPag)
		} // if (pastaMes)
		
		
		if (pastaEmpPag){
	    
			// verifica se ja existe pasta para o FORNECEDOR
	        log.info("SOLICPAGTO - PASTA FORNECEDOR - INICIO");

	        var fornec      = hAPI.getCardValue("nomeEmpresa");

	        
			var c12 = DatasetFactory.createConstraint("parentDocumentId",pastaDestino,pastaDestino,ConstraintType.MUST);
			var c13 = DatasetFactory.createConstraint("documentDescription",fornec,fornec,ConstraintType.MUST);
			var c14 = DatasetFactory.createConstraint("activeVersion","true","true",ConstraintType.MUST);
			var constraintsC = new Array(); 
			constraintsC.push(c12);
			constraintsC.push(c13);
			constraintsC.push(c14);
			var pastaFornec = DatasetFactory.getDataset("document", null, constraintsC, null);
	
			if (pastaFornec){
	        	if (pastaFornec.values.length > 0){
					var fornecParentId  = pastaFornec.getValue(0,"documentPK.documentId");
					var fornecNomePasta = pastaFornec.getValue(0,"documentDescription");
					pastaDestino     = fornecParentId;
					log.info(" SOLICPAGAMENTO - BEFORESTATEENTRY - ENCONTROU PASTA FORNECEDOR Valor do pastaDestino/anoParentId/descricao...:" + 
							 pastaDestino + " - " + fornecParentId + " - " + fornecNomePasta);	
				}
				else{
					try{
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - NAO ENCONTROU PASTA FORNECEDOR - CRIANDO");
						
						//doc = docAPI.newDocumentDto();
						var doc = docAPI.newDocumentDto();
						
						// Cria a pasta para o fornecedor 
						doc.setParentDocumentId(pastaDestino); // FIXO
						doc.setDocumentDescription(fornec);
						doc.setAdditionalComments("Processo Solicitacao de Pagamento" );
						doc.setDocumentKeyWord("SOLICPAGTO- Fornecedor");
						doc.setVersionDescription("\nProcesso:" + processo);
						doc.setDocumentTypeId("SOLICPAGTO- Fornecedor");
						doc.setIconId(23);
						doc.setCompanyId(numcompany);
						doc.setDocumentType("1");
						doc.setDocumentTypeId("1");
						doc.setInheritSecurity(true);
						doc.setTopicId(1);
						doc.setVersionOption("0");
						
						// Cria a pasta do FORNECEDOR 
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - ANTES CRIAR PASTA FORNECEDOR");
						
						var createDoc = docAPI.createFolder(doc, null, null);
						
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS CRIAR PASTA FORNECEDOR createDoc: " + createDoc);
						
						pastaDestino = createDoc.getDocumentId();
						
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DEPOIS CRIAR PASTA FORNECEDOR pastaDestino: " + pastaDestino);
						
	        		} // try 
					catch(error) {
						throw "SOLICPAGAMENTO - BEFORESTATEENTRY - Erro ao criar Pasta do Fornecedor!" + error.message;
					}
				} // else pasta fornec nao criada
			} // if pasta fornec
		} // IF PASTA MES
		
		
		if (pastaFornec){
			
			// CRIANDO O DOCUMENTO ANEXO!! - LOGICA NOVA
			
			var calendar    = java.util.Calendar.getInstance().getTime();
	    	
			documentServiceProviderFolder = ServiceManager.getServiceInstance("FolderService");
			log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - getServiceInstance FolderService OK");
			
	        var doc =  documentServiceProviderFolder.instantiate("com.totvs.technology.ecm.dm.ws.DocumentDto");
	        log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - instantiate com.totvs.technology.ecm.dm.ws.DocumentDto OK");
	        
			try{
				var docs = hAPI.listAttachments();
				
				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - antes verific documento anexo --listDocuments : " + docs);
				
				for (var i = 0; i < docs.size(); i++) {

	    			if (docs.get(i).getDocumentType() == "7"){ 

	    				var doc = docs.get(i);
					
	    				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - pastaDestino" + pastaDestino);
	    				
	    				//nomeDoc = "Solic:" + numSolicitacao + " - Anexo: " + listDocuments[i].getPhisicalFile();
	    				
	    				var nomeDoc = "Solic:" + processo + " - Anexo: " + docs.get(i).getPhisicalFile();
	    				
	    				doc.setParentDocumentId(parseInt(pastaDestino));
	    				doc.setDocumentDescription(nomeDoc);
	    				doc.setVersionDescription("Processo: " + processo);
	    				doc.setExpires(false);
	    				doc.setCreateDate(calendar);
	    				doc.setInheritSecurity(true);
	    				doc.setTopicId(1);
	    				doc.setUserNotify(false);
	    				doc.setValidationStartDate(calendar);
	    				doc.setVersionOption("0");
	    				doc.setUpdateIsoProperties(true);
	    				
	    				//doc.setPublisherId("34302534");  // cristina.poffo - adm ao deu
	    				//*doc.setColleagueId("34302534"); // cristina.poffo

	    				doc.setPublisherId("adm");  
	    				doc.setColleagueId("adm"); 

	    				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - PROCESSO: " + processo + " - ativAtual: " + ativAtual +  
	    						 " - ANTES publishWorkflowAttachment - USUARIO: 34302534 SETADO");

	    				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - PROCESSO: " + processo + " - ativAtual: " + ativAtual +  
	    						 " - criaDocumento -  antes do publishWorkflowAttachment() - docs.get(i).getDocumentType():" + docs.get(i).getDocumentDescription());

	    				hAPI.publishWorkflowAttachment(doc);

	    				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - PROCESSO: " + processo + " - ativAtual: " + ativAtual +  
						 " - criaDocumento -  depois do publishWorkflowAttachment()");
	    				
	    			}
				}
			}
			catch(error) 
			{ 
				lErro = true;
				log.info ("SOLICPAGAMENTO - BEFORESTATEENTRY - PROCESSO: " + processo + " - ativAtual: " + ativAtual +  
						  " - ERRO AO PUBLICAR DOCUMENTOS DO PROCESSO - error.message:" + error.message);
				throw "SOLICPAGAMENTO - BEFORESTATEENTRY - PROCESSO: " + processo + " - ativAtual: " + ativAtual +  
				      " - ERRO AO PUBLICAR DOCUMENTOS DO PROCESSO - error.message:" + error.message;
			}			
		} // IF PASTA FORNEC
	
		
		if (pastaFornec){
			
			log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - DOCUMENTO ESPELHO!!");
			
				var nrDocFornec = pastaDestino;
				
				//CRIANDO A FICHA - DOC ESPELHO
				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - VERIFICANDO ANEXOS DO PROCESSO - INICIO");
		
				var codDocFicha = getValue("WKCardId");	
				var codFormFicha = getValue("WKFormId");
				
				log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - INICIO FICHA - codDocFicha: " + codDocFicha );
				
				try{
					var cx1 = DatasetFactory.createConstraint("documentPK.documentId",codDocFicha,codDocFicha,ConstraintType.MUST);
					//var cx2 = DatasetFactory.createConstraint("activeVersion", "1","1",ConstraintType.MUST);
					//testes 1.5 pedem true
					var cx2 = DatasetFactory.createConstraint("activeVersion", true,true,ConstraintType.MUST);
					var constraintsX = new Array(); 
					constraintsX.push(cx1);
					constraintsX.push(cx2);
					
					var fichaDoc = DatasetFactory.getDataset("document", null, constraintsX, null);
					
					log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - FICHA - LENGTH: " + fichaDoc.values.length);
				}
				catch (e) {
					throw "Erro ao localizar ficha: " + e; 
				}
			
				var lErroSelect = false;
				var lTemFichaEspelho = false;
				var retornonext = ""; 
			    if (fichaDoc) {
			    	
					if (fichaDoc.values.length > 0){
			    		
						log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - length > que zero");
						
						//desenv
			    		//var dataSource = "java:/jdbc/TOTVSTechRO";
						
						//prod
						var dataSource = "java:/jdbc/FluigDSRO";
			        	
						var ic = new javax.naming.InitialContext();
			        	var ds = ic.lookup(dataSource);
			            
			        	try {
			            	var conn1 = ds.getConnection();
			            	var stmt1 = conn1.createStatement();
			            	//ResultSet rs = null;
			            	
			            	lErroSelect = false;
			            	try {
			            		
			            		log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - SELECT : " +
				            			"SELECT Count(*) AS RecordCount from link_docto_virtual where " + 
        								" cod_empresa = '" + numcompany + "' and " +
        								" nr_docto_pai_corren = " + nrDocFornec + " and " +
        								" nr_documento = " + codDocFicha + " and " +
        								" log_delete = 0 and " +
        								" nr_docto_pai_orig = " + pastaOrigem + ";" 
        								);
			            		
			            		// deixar estes comandos colados - nao colocar nem log.info antes
			            		var rs = stmt1.executeQuery("SELECT Count(*) AS RecordCount from link_docto_virtual where " +
			            				" cod_empresa = '" + numcompany + "' and " +
        								" nr_docto_pai_corren = " + nrDocFornec + " and " +
        								" nr_documento = " + codDocFicha + " and " +
        								" log_delete = 0 and " +
        								" nr_docto_pai_orig = " + pastaOrigem + ";" );
			            		 retornonext = (rs.next()).toString(); 
			            		 // deixar estes comandos colados - nao colocar nem log.info antes
			            		 
			            	} 
				            catch(error) {
				            	lErroSelect = true;
				            	log.error("DS_SQL select  ==============> " + error.message);
				        		throw "SOLICPAGAMENTO - BEFORESTATEENTRY - Erro LER a ficha - SELECT - na pasta particular da Area!!" + error.message;
				        	} 

				            log.info("SOLICPAGAMENTO - BEFORESTATEENTRY -lErroSelect: " + lErroSelect + " -retornonext:  " + retornonext  + " - processo: " + processo);
				            		
				            if (lErroSelect == true){
				            	log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - nao conseguiu dar select!! - processo: " + processo);
				            }
				            else if (lErroSelect == false && retornonext == "true"){
				            	log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - pto 2 - rs.next()");
			            		log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - rs.getInt(RecordCount): " + rs.getInt("RecordCount"));
			            		// nao retirar este comando abaixo - ele define se em ou nao registros
				            	 if (rs.getInt("RecordCount") > 0){  
				            		 log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - JA TEM FICHA!! - processo: " + processo);
				            		 lTemFichaEspelho = true;
				            	 }
				            	 else{
				            		 lTemFichaEspelho = false;
				            	 }
				            }
				             
				            log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - lErroSelect: " + lErroSelect + " - lTemFichaEspelho:" + lTemFichaEspelho);

				            // se nao tem ficha espelho, da insert
				            if (lErroSelect == false && lTemFichaEspelho == false){
				            	var conn2 = ds.getConnection();
				            	var stmt2 = conn2.createStatement();
				            	
				            	log.info("SOLICPAGAMENTO - BEFORESTATEENTRY - insertttt: " +
				            			" insert into link_docto_virtual (cod_empresa, nr_docto_pai_corren, nr_documento, log_delete, nr_docto_pai_orig)" + 
									    " values ('" + numcompany + "'," + nrDocFornec + "," + codDocFicha + ",0," + pastaOrigem  + ");"
									    );
				            										            	
				            	var rs = stmt2.executeUpdate(" insert into link_docto_virtual (cod_empresa, nr_docto_pai_corren, nr_documento, log_delete, nr_docto_pai_orig)" + 
				            							    " values ('" + numcompany + "'," + nrDocFornec + "," + codDocFicha + ",0," + pastaOrigem  + ");" );
				            	
				            	
				            	log.info ("SOLICPAGAMENTO - BEFORESTATEENTRY - CRIOU ESPELHOOOOOOOO: " + codDocFicha + " - PASTA:" + pastaFornec);	
				            }
			            	
		            	} 
			            catch(error) {
			            	log.error("DS_SQL INSERT ==============> " + error.message);
			        		throw "SOLICPAGAMENTO - BEFORESTATEENTRY - Erro ao CRIAR Atalho da Ficha na pasta particular da Area!! Tente novamente!" + error.message;
			        	} 
			            finally {
			            	if(stmt1 != null) stmt1.close();
			            	if(conn1 != null) conn1.close();
			            	if(stmt2 != null) stmt2.close();
			            	if(conn2 != null) conn2.close();
			            }
					} // IF VALUES.LENGHT FICHA
					else{
						throw "SOLICPAGAMENTO - BEFORESTATEENTRY - Sistema nao encontrou ficha!! Tente novamente!";
					}
			
			    } // if fichadOC
				else{
					throw "SOLICPAGAMENTO - BEFORESTATEENTRY - Sistema nao encontrou ficha!! Tente novamente!";
				}
	    	
		} // if pastaFornec
	
	} /*seq 96 u */

	log.info("SOLICPAGAMENTO - FUNCAO BEFORESTATEENTRY - FIM ");

	
	function setaAmbiente(){
		log.info("funcao setaAmbiente - inicio");
		try{
			var c1 = DatasetFactory.createConstraint("ambiente", "PRODUCAO", "PRODUCAO", ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("cod_def_proces", "SolicitarPagamento", "SolicitarPagamento", ConstraintType.MUST);
			var c3 = DatasetFactory.createConstraint("formAtual", formAtual, formAtual, ConstraintType.MUST);
			constraints = new Array(c1,c2,c3);
			var res = DatasetFactory.getDataset("dsParamAmbFormWkf", null, constraints, null);
			log.info("funcao setaAmbiente - getDataset dsParamAmbFormWkf - res: " + res);
			
			if (res){
				if (res.values.length > 0){return res;}
				else return "erro ao retornar dados de ambiente - nao retorou registro";
			}
			else return "erro ao retornar dados de ambiente - retornou nulo";
		}
		catch (e) {
			return "erro ao retornar dados de ambiente - NOK";
			log.info("funcao setaAmbiente - getDataset dsParamAmbFormWkf - ERRO: " + e);
		}	
	}	
	
} // fim function