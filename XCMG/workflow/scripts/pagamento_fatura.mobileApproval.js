function mobileApproval(){}

function processMobileApproval(){
	var NUM_STATE = getValue("WKNumState");
	var NEXT_STATE = getValue("WKNextState");
	var IS_MOBILE = getValue("WKMobile");
	var USER_COMMENT = getValue("WKUserComment");
	var feedback = getApprovalFeedback(NUM_STATE);
	
	log.info(_log + " - processMobileApproval "
		+ " - NUM_STATE: " + NUM_STATE + " - NEXT_STATE: " + NEXT_STATE
		+ " - IS_MOBILE: " + IS_MOBILE + " - USER_COMMENT: " + USER_COMMENT 
		+ " - feedback: ");
	log.dir(feedback);
	if(isApprovalActivity(NUM_STATE)){
		var targetStatus = approvalPath(NUM_STATE, NEXT_STATE);
		var new_feedback = { 
			"status": targetStatus, 
			"obs": isEmpty(USER_COMMENT) ? feedback.obs : USER_COMMENT
		};
		log.info(_log + " - processMobileApproval - new_feedback: ");
		log.dir(new_feedback);
		
		if((targetStatus == "Reprovado" || new_feedback.status == "Reprovado") && isEmpty(new_feedback.obs)){
			throw "Conforme o direcionamento do fluxo, o processo é aprovado ou reprovado."
				+ " Quando reprovado, o campo Observações é obrigatório."
				+ " 根據流程的方向，流程被批准或不批准。未獲批准時，備註字段為必填字段。";
		}
		setApprovalFeedback(NUM_STATE, new_feedback);
	}
}

function isApprovalActivity(currentState){
	return currentState == Activity.AVALIAR_GERENTE_AREA
	    || currentState == Activity.AVALIAR_DIRETOR_AREA
		|| currentState == Activity.AVALIAR_CONTROLADORIA
		|| currentState == Activity.AVALIAR_GERENTE_FINANCEIRO
		|| currentState == Activity.AVALIAR_DIRETOR_FINANCEIRO
		|| currentState == Activity.AVALIAR_PRESIDENTE;
}

function getApprovalFeedback(currentState){
	if(currentState == Activity.AVALIAR_GERENTE_AREA){
		return { 
			"status": hAPI.getCardValue("rd_aprov_gerente_area")
			, "obs": hAPI.getCardValue("ds_obs_gerente_area")
		}
	}
	else if(currentState == Activity.AVALIAR_DIRETOR_AREA){
		return { 
			"status": hAPI.getCardValue("rd_aprov_diretor_area")
			, "obs": hAPI.getCardValue("ds_obs_diretor_area")
		}
	}
	else if(currentState == Activity.AVALIAR_CONTROLADORIA){
		return { 
			"status": hAPI.getCardValue("rd_aprov_controladoria")
			, "obs": hAPI.getCardValue("ds_obs_controladoria")
		}
	}
	else if(currentState == Activity.AVALIAR_GERENTE_FINANCEIRO){
		return { 
			"status": hAPI.getCardValue("rd_aprov_gerente_financeiro")
			, "obs": hAPI.getCardValue("ds_obs_gerente_financeiro")
		}
	}
	else if(currentState == Activity.AVALIAR_DIRETOR_FINANCEIRO){
		return { 
			"status": hAPI.getCardValue("rd_aprov_diretor_financeiro")
			, "obs": hAPI.getCardValue("ds_obs_diretor_financeiro")
		}
	}
	else if(currentState == Activity.AVALIAR_PRESIDENTE){
		return { 
			"status": hAPI.getCardValue("rd_aprov_presidencia")
			, "obs": hAPI.getCardValue("ds_obs_presidencia")
		}
	}
	return null;
}

function setApprovalFeedback(currentState, feedback){
	if(currentState == Activity.AVALIAR_GERENTE_AREA){
		hAPI.setCardValue("rd_aprov_gerente_area", feedback.status);
		hAPI.setCardValue("ds_obs_gerente_area", feedback.obs);
	}
	else if(currentState == Activity.AVALIAR_DIRETOR_AREA){
		hAPI.setCardValue("rd_aprov_diretor_area", feedback.status);
		hAPI.setCardValue("ds_obs_diretor_area", feedback.obs);
	}
	else if(currentState == Activity.AVALIAR_CONTROLADORIA){
		hAPI.setCardValue("rd_aprov_controladoria", feedback.status);
		hAPI.setCardValue("ds_obs_controladoria", feedback.obs);
	}
	else if(currentState == Activity.AVALIAR_GERENTE_FINANCEIRO){
		hAPI.setCardValue("rd_aprov_gerente_financeiro", feedback.status);
		hAPI.setCardValue("ds_obs_gerente_financeiro", feedback.obs);
	}
	else if(currentState == Activity.AVALIAR_DIRETOR_FINANCEIRO){
		hAPI.setCardValue("rd_aprov_diretor_financeiro", feedback.status);
		hAPI.setCardValue("ds_obs_diretor_financeiro", feedback.obs);
	}
	else if(currentState == Activity.AVALIAR_PRESIDENTE){
		hAPI.setCardValue("rd_aprov_presidencia", feedback.status);
		hAPI.setCardValue("ds_obs_presidencia", feedback.obs);
	}
}