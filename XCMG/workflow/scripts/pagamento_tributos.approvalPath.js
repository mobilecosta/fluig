function approvalPath(currentState, nextState){
	if(currentState == Activity.AVALIAR_GER_AREA){
		var map = {};
		map[Activity.AUTO_ENVOLVE_CONTROLADORIA] = "Aprovado";
		map[Activity.AUTO_ATRIBUIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_CONTROLADORIA){
		var map = {};
		map[Activity.AVALIAR_GER_FINANCEIRO] = "Aprovado";
		map[Activity.AUTO_ATRIBUIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_GER_FINANCEIRO){
		var map = {};
		map[Activity.AUTO_ENVOLVE_DIR_FINANCEIRO] = "Aprovado";
		map[Activity.AUTO_ATRIBUIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_DIR_FINANCEIRO){
		var map = {};
		map[Activity.AUTO_ENVOLVE_PRESIDENTE] = "Aprovado";
		map[Activity.AUTO_ATRIBUIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_PRESIDENTE){
		var map = {};
		map[Activity.AUTO_INTEGRAR] = "Aprovado";
		map[Activity.AUTO_ATRIBUIR] = "Reprovado";
		return map[nextState];
	}
	return null;
}