function regrasEnvolvimento(){}

function envolveControladoria(){
	log.info(_log + " - envolveControladoria");
	
	var hasAddedFees = false;
	var indexes = hAPI.getChildrenIndexes("tbTitulos");
	for (var i = 0; i < indexes.length; i++) {
		var row = indexes[i];
		var tit_vl_juros = hAPI.getCardValue("tit_vl_juros___"+row);
		var tit_vl_multa = hAPI.getCardValue("tit_vl_multa___"+row);
		log.info(_log + " - envolveControladoria - tit_vl_juros: " + tit_vl_juros
			+ " - tit_vl_multa: " + tit_vl_multa);
		if((!isEmpty(tit_vl_juros) && numeroAmericano(tit_vl_juros) > 0)
			 || (!isEmpty(tit_vl_multa) && numeroAmericano(tit_vl_multa) > 0)){
			log.info(_log + " - envolveControladoria - juros ou multa linha: " + row);
			hasAddedFees = true;
			break;
		}
	}
	return hasAddedFees;
}

function envolveDirFinanceiro(){
	log.info(_log + " - envolveDirFinanceiro");
	
	var approvalNeeded = false;
	var target = numeroAmericano(hAPI.getAdvancedProperty("gatilho_diretor_financeiro"));
	
	var accomplished = hAPI.getCardValue("vl_total_tributos");
	log.info(_log + " - envolveDirFinanceiro - accomplished: " + accomplished
			+ " - target: " + target);
	if(!isEmpty(accomplished)) {
		accomplished = numeroAmericano(accomplished);
		approvalNeeded = accomplished >= target;
	}
	return approvalNeeded;
}

function envolvePresidente(){
	log.info(_log + " - envolvePresidente");
	
	var approvalNeeded = false;
	var target = numeroAmericano(hAPI.getAdvancedProperty("gatilho_presidente"));
	var accomplished = 0;
	
	var indexes = hAPI.getChildrenIndexes("tbTitulos");
	for (var i = 0; i < indexes.length; i++) {
		var row = indexes[i];
		var tit_vl_multa = hAPI.getCardValue("tit_vl_multa___"+row);
		log.info(_log + " - envolvePresidente - tit_vl_multa: " + tit_vl_multa
			+ " - target: " + target);
		if(!isEmpty(tit_vl_multa) && numeroAmericano(tit_vl_multa) > 0){
			accomplished += numeroAmericano(tit_vl_multa);
		}
	}
	approvalNeeded = (accomplished >= target);
	log.info(_log + " - envolvePresidente - approvalNeeded: " + approvalNeeded
			+ " - accomplished: " + accomplished + " - target: " + target);
	return approvalNeeded;
}