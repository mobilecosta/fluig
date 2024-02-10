function validaStatusCPagarPA(){
	log.info (" %%%%%%%%%%%  SOLICPAGTO -validaStatusCPagarPA - INICIO");
	
	if (hAPI.getCardValue("descricaoItem") == "00"  && 
		hAPI.getCardValue("hiddenFiscalPassou") != "" && 
		hAPI.getCardValue("hiddenContasPagarPassou") == "") {

		log.info (" %%%%%%%%%%% cris 1602 SOLICPAGTO -validaStatusCPagarPA - POSICAO PARA ENVIAR PARA O 142 - AVALIAR SE GESTOR JA APROVOU - INICIO + hiddenNumTotAprovac: " + hAPI.getCardValue("hiddenNumTotAprovac"));
		
		//13/02 - VALIDAR SE O RESPONSAVEL JA APROVOU NA ATVIIDADE 155 - ESPECIFICO PARA A VIVIAN NAO PRECISAR APROVAR 2 VEZES
		var lEncontrouCPPA = false;
		for ( var i = 1; i <= parseInt(hAPI.getCardValue("hiddenNumTotAprovac")); i++) {
			log.info (" %%%%%%%%%%%  SOLICPAGTO -validaStatusCPagarPA - gestor:" + i);
			if (hAPI.getCardValue("idMatrAprovador___" + i.toString())){
				log.info (" %%%%%%%%%%%  SOLICPAGTO -validaStatusCPagarPA - gestor:" + hAPI.getCardValue("idMatrAprovador___" + i.toString()));
				
				croleId = "SOLIC_PAGAMENTO_CONTAS_PAGAR_PA";
				log.info (" %%%%%%%%%%%  SOLICPAGTO -validaStatusCPagarPA - croleId: " + croleId);
				c1 = DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", croleId,croleId,ConstraintType.MUST);
	            constraints = new Array(); 
	            constraints.push(c1);
	            dataset = DatasetFactory.getDataset("workflowColleagueRole", null, constraints, null);
				
	            log.info (" %%%%%%%%%%%  SOLICPAGTO - validaStatusCPagarPA - dataset.values.length: " + dataset.values.length);

	            if(dataset){
	                for(var z=0 ; z<dataset.values.length;z++){
	                	log.info("colab dentro do papel: " +  z + " - " + dataset.getValue(z,"workflowColleagueRolePK.colleagueId"));
	                	if (hAPI.getCardValue("idMatrAprovador___" + i) == dataset.getValue(z,"workflowColleagueRolePK.colleagueId")){
		                	log.info (" %%%%%%%%%%%  SOLICPAGTO - validaStatusCPagarPA - encontrou!!! ");
		    	            lEncontrouCPPA = true;
		    	            break;
	                	}
	                }
	         	}
 			}		
		}
		// se o aprovador nao aprovou na atividade 155, tem que passar pela ativ 142
		if (lEncontrouCPPA == false){
			log.info (" %%%%%%%%%%%  SOLICPAGTO -validaStatusCPagarPA - POSICAO PARA ENVIAR PARA O 142 - AVALIAR SE GESTOR JA APROVOU - FIM - NAO APROVOU AINDA");
			return true;
		}
		else{
			log.info (" %%%%%%%%%%%  SOLICPAGTO -validaStatusCPagarPA - POSICAO PARA ENVIAR PARA O 142 - AVALIAR SE GESTOR JA APROVOU - FIM - JA APROVOU NA ATIV 155 - PULANDO...");
			return false;
		}
			
	}
	else{
		return false;
	}

	//return false;

}