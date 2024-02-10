function afterTaskCreate(colleagueId) {
	log.info("#afterTaskCreate - CST: SOLICITACAO PAGAMENTO");
	var sequenceId   = parseInt(getValue("WKNumState"));
	var ativAtual   = getValue("WKCurrentState"); /* **** */
	log.info("#ativAtual: "+ativAtual);
	var processo    = getValue("WKNumProces");    
    var numcompany  = new java.lang.Integer(getValue("WKCompany")); 
	var senha       = getValue("WKUserPassword");
    var usuario     = getValue("WKUser");

    //var linkFicha =  getValue("WDKTaskLink") ;
    
    var linkFicha  = hAPI.getUserTaskLink(ativAtual);
    
	var linkFichaMobileIOS = "fluig://" + hAPI.getUserTaskLink(ativAtual) ;
	var linkFichaMobileAndroid = hAPI.getUserTaskLink(ativAtual) ;
	
    var form = hAPI.getCardData(processo); // pega todos os campos do formulario de uma vez so

	var cHidden;
	var aprovadorDaVez = "";
	var croleId;
	var destinatarios       = new java.util.ArrayList();
	var parametros          = new java.util.HashMap();
	var cmatriculaAprov ; 
	var cnomeAprovador  ;
	var cmailAprov    	;

	var c1 ;
    var constraints; 
    var dataset;
    var colaborador;
    
	if (ativAtual == 155){
		hAPI.setCardValue("hiddenGestorPassou","sim");	
		
		if(hAPI.getCardValue("areaSolic") == "4" || 
		   hAPI.getCardValue("areaSolic") == "5" ||
		   hAPI.getCardValue("areaSolic") == "6" ||
		   hAPI.getCardValue("areaSolic") == "7"){
			if(parseInt(hAPI.getCardValue("hiddenNumeroDaVez"),10) >= parseInt(hAPI.getCardValue("hiddenNumTotAprovac"),10)){
				var numeroDaSolicitacao = getValue('WKNumProces');
				var threadDaSolicitacao = 0; 
				var responsavelPelaTarefa = colleagueId;      
				
				var dataDoPrazo = new Date();
				dataDoPrazo.setFullYear(dataDoPrazo.getFullYear()+1);
				
				hAPI.setDueDate(numeroDaSolicitacao, threadDaSolicitacao, responsavelPelaTarefa, dataDoPrazo, 50000);
			}else{
				var numeroDaSolicitacao = getValue('WKNumProces');
				var threadDaSolicitacao = 0; 
				var responsavelPelaTarefa = colleagueId;     
				
				var dataDoPrazo = new Date();
				
				var h = parseInt(dataDoPrazo.getHours(),10);
				var m = parseInt(dataDoPrazo.getMinutes(),10);
				var s = parseInt(dataDoPrazo.getSeconds(),10);
				
				var t = (h*60*60)+(m*60)+s;
				horaDoPrazo = t;
				
			    var obj = hAPI.calculateDeadLineHours(dataDoPrazo, horaDoPrazo, 4, "Default");
		        var dt = obj[0];
		        var segundos = obj[1];
		        
		        log.info("#dt: "+dt);
		        log.info("#segundos: "+segundos);
				
				hAPI.setDueDate(numeroDaSolicitacao, threadDaSolicitacao, responsavelPelaTarefa, dt, segundos);
			}
		}
	} 
	else if (ativAtual == 55){
		hAPI.setCardValue("hiddenFiscalPassou","sim");
	}
	else if (ativAtual == 142){
		hAPI.setCardValue("hiddenContasPagarPassou","sim");		
	}
	else if (ativAtual == 5){
		hAPI.setCardValue("hiddenCPGeraTituloPassou","sim");	
	}
    
	log.info (" %%%%%%%%%%%  SOLICPAGTO - AFTER TASK CREATE %%%%%%%%%%%%%  - ativAtual: " + ativAtual + 
			  " - colleagueId:" + colleagueId);
	
	// ao enviar email para a ativ 155 - aprovac gestor
	if (ativAtual == 155){
		
		// ENVIO DE EMAIL!!!!!
		log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual);

		// a primeira vez sempre tem usuar ou papel junto do conteudo 
		cHidden = form.get("hiddenAprovadorDaVez"); 
		log.info("hiddenAprovadorDaVez:" + cHidden.substring(0,5) + " - " + cHidden.substring(6,cHidden.length()) );
				
		// teste
		//cHidden = "PAPEL:SOLIC_PAGAMENTO_ADM_GENTE";
		
		log.info (" %%%%%%%%%%%  SOLICPAGTO - AFTER TASK CREATE %%%%%%%%%%%%%  - ativAtual: " + ativAtual + 
				  " - cHidden: " + cHidden);
		
		
		if (cHidden.substring(0,5) == "USUAR"){
		
			
			log.info (" %%%%%%%%%%%  SOLICPAGTO - AFTER TASK CREATE %%%%%%%%%%%%%  - ativAtual: " + ativAtual + 
					  " - EH USUARIO");
			
			
			log.info (" %%%%%%%%%%%  SOLICPAGTO - AFTER TASK CREATE %%%%%%%%%%%%%  - ativAtual: " + ativAtual + 
					  " - EH USUARIO");
			
			log.info ("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual +
					  "form.get(hiddenAprovadorDaVez): " + form.get("hiddenAprovadorDaVez") +
					  "form.get(hiddenNumTotAprovac): " + form.get("hiddenNumTotAprovac") +
					  "form.get(hiddenNumeroDaVez): " + form.get("hiddenNumeroDaVez") );

			if (parseInt(form.get("hiddenNumTotAprovac")) >= parseInt(form.get("hiddenNumeroDaVez"))){
				
				var aprovadorDaVez = cHidden.substring(6); 
				
				cmatriculaAprov   	= aprovadorDaVez; 
				cnomeAprovador      = form.get("idNomeAprovador___" + form.get("hiddenNumeroDaVez"));
				cmailAprov    		= form.get("idEmailAprovador___" + form.get("hiddenNumeroDaVez"));
				
				log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual + " - WDKTaskLink: " + linkFicha );
				log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual + " - matricula: " + cmatriculaAprov);
				log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual + " - email: " + cmailAprov);
				
				destinatarios.add(cmatriculaAprov);
				
				//Monta mapa com par?metros do template 
			    parametros.put("MAILAPROVADOR",cmailAprov);
			    parametros.put("NOMEAPROVADOR",cnomeAprovador);
			    
			}
		
		} // usuar
		else{
			
			log.info (" %%%%%%%%%%%  SOLICPAGTO - AFTER TASK CREATE %%%%%%%%%%%%%  - ativAtual: " + ativAtual + 
			  " - EH PAPEL!! - cHidden: " + cHidden);
	
			croleId = cHidden.substring(6);
			
			log.info (" %%%%%%%%%%%  SOLICPAGTO - AFTER TASK CREATE %%%%%%%%%%%%%  - croleId: " + croleId);
			
            c1 = DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", croleId,croleId,ConstraintType.MUST);
            constraints = new Array(); 
            constraints.push(c1);
            dataset = DatasetFactory.getDataset("workflowColleagueRole", null, constraints, null);
			
            log.info (" %%%%%%%%%%%  SOLICPAGTO - AFTER TASK CREATE %%%%%%%%%%%%%  - dataset.values.length: " + dataset.values.length);

            if(dataset){
                for(var i=0 ; i<dataset.values.length;i++){
                       destinatarios.add(dataset.getValue(i,"workflowColleagueRolePK.colleagueId"));
                }
         	}
         	
            log.info (" %%%%%%%%%%%  SOLICPAGTO - AFTER TASK CREATE %%%%%%%%%%%%%  - depois for dataset.values.length");

            //Monta mapa com par?metros do template 
    	    parametros.put("MAILAPROVADOR","");
    	    parametros.put("NOMEAPROVADOR","ADM GENTE");
    	    
		} // else
		
		parametros.put("WDK_CompanyId", getValue("WKCompany"));
	    parametros.put("SOLIC", processo);
	    parametros.put("LinkFicha", linkFicha);
	    parametros.put("linkFichaMobileIOS", linkFichaMobileIOS);
	    parametros.put("linkFichaMobileAndroid", linkFichaMobileAndroid);
	    
	   
	    //Este par?metro ? obrigat?rio e representa o assunto do e-mail 
	    parametros.put("subject", "Solicitacao: " + processo +  "=> Solicitacao Pagamentos:");
	    
	    log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ativAtual:" + ativAtual + " - ENVIO EMAIL - antes notifier");
	    
		 //Envia e-mail
	     notifier.notify("adm", "tplCSTSolicPagamento", parametros, destinatarios, "text/html");

	    log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ativAtual:" + ativAtual + " - ENVIO EMAIL - depois notifier");
		
		// FIM ENVIA EMAIL
	
	} // ativ 155
	
	
	// ao enviar email para a ativ 142- aprovac contas a pagar - vivian
	if (ativAtual == 142){
		
		// ENVIO DE EMAIL!!!!!
		log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual);
	
		var form = hAPI.getCardData(processo); // pega todos os campos do formulario de uma vez so

		log.info("SOLICPAGAMENTO - AFTER TASK CREATE - antes procurar colab - colleagueId: " + colleagueId);

		c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId",colleagueId,colleagueId, ConstraintType.MUST);
		constraints = new Array(c1);
		colaborador = DatasetFactory.getDataset("colleague", null, constraints, null);
				
		 var nom ;
		 var mail;
		 
		 log.info("SOLICPAGAMENTO - AFTER TASK CREATE - colaborador: " + colaborador);
		 
		if (colaborador != null) {
		    				
			log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual + 
					" -retorno colaborador ok - pto 0 - nome: " + colaborador.getValue(0,"colleagueName") + 
					" - mai : " + colaborador.getValue(0,"mail"));
				
			nom  = colaborador.getValue(0,"colleagueName");
			mail = colaborador.getValue(0,"mail");

			log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual + " -retorno colaborador ok - pto 1");
			
			parametros.put("WDK_CompanyId", getValue("WKCompany"));
		    parametros.put("SOLIC", processo);
		    parametros.put("LinkFicha", linkFicha);
		    parametros.put("linkFichaMobileIOS", linkFichaMobileIOS);
		    parametros.put("linkFichaMobileAndroid", linkFichaMobileAndroid);
		    
		    log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ENVIO EMAIL - ativAtual:" + ativAtual + " -retorno colaborador ok - pto 2");
		    
		    //Monta mapa com par?metros do template 
		    parametros.put("MAILAPROVADOR",mail);
		    parametros.put("NOMEAPROVADOR",nom);
			
		    //Este par?metro ? obrigat?rio e representa o assunto do e-mail 
		    parametros.put("subject", "Solicitacao: " + processo +  "=> Solicitacao Pagamentos:");
				
			 destinatarios.add(colleagueId);
			 
			 log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ativAtual:" + ativAtual + " - ENVIO EMAIL - antes notifier");
		    
			 //Envia e-mail
		     notifier.notify("adm", "tplCSTSolicPagamento", parametros, destinatarios, "text/html");
	
		    log.info("SOLICPAGAMENTO - AFTER TASK CREATE - ativAtual:" + ativAtual + " - ENVIO EMAIL - depois notifier");
		}
		// FIM ENVIA EMAIL
	} // ativ 142	
	
}