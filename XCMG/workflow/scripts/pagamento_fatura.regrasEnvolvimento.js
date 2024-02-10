function regrasEnvolvimento(){}

function envolveControladoria(){
	log.info(_log + " - envolveControladoria");
	
	var involves = true;
	var cta = ""+hAPI.getCardValue("cd_conta_contabil");
	
	/*var involves = false;
	
	log.info("#cta: "+cta);
	if(cta.charAt(0) == "4")
		involves = true;*/
	if(cta == "1104020001"){ //importação em andamento
		involves = false;
	}
	return involves;
}

function envolveDirFinanceiro(){
	log.info(_log + " - envolveDirFinanceiro");
	
	var approvalNeeded = false;
	var target = numeroAmericano(hAPI.getAdvancedProperty("gatilho_diretor_financeiro"));
	
	var accomplished = hAPI.getCardValue("vl_total");
	log.info(_log + " - envolveDirFinanceiro - accomplished: " + accomplished
			+ " - target: " + target);
	
	if(!regraBypassEnvolvimento() && !isEmpty(accomplished)) {
		accomplished = numeroAmericano(accomplished);
		approvalNeeded = accomplished >= target;
	}
	return approvalNeeded;
}

function envolvePresidente(){
	log.info(_log + " - envolvePresidente");
	
	var approvalNeeded = false;
	var target = numeroAmericano(hAPI.getAdvancedProperty("gatilho_presidente"));
	
	var accomplished = hAPI.getCardValue("vl_total");
	log.info(_log + " - envolvePresidente - accomplished: " + accomplished
			+ " - target: " + target);
	
	if(!regraBypassEnvolvimento() && !isEmpty(accomplished)) {
		accomplished = numeroAmericano(accomplished);
		approvalNeeded = accomplished >= target;
	}
	return approvalNeeded;
}

function regraBypassEnvolvimento(){
	return hAPI.getCardValue("cd_filial") == "1006";
}