function approvalPath(currentState, nextState){
	if(currentState == Activity.AVALIAR_GERENTE_AREA){
		var map = {};
		map[Activity.AVALIAR_DIRETOR_AREA] = "Aprovado";
		map[Activity.GATEWAY_CORRIGIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_DIRETOR_AREA){
		var map = {};
		map[Activity.GATEWAY_ENVOLVE_CONTROLADORIA] = "Aprovado";
		map[Activity.GATEWAY_CORRIGIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_CONTROLADORIA){
		var map = {};
		map[Activity.AVALIAR_DIRETOR_GERAL] = "Aprovado";
		map[Activity.GATEWAY_CORRIGIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_DIRETOR_GERAL){
		/* var map = {};
		map[Activity.GATEWAY_ENVOLVE_DIRETOR_FINANCEIRO] = "Aprovado";
		map[Activity.GATEWAY_CORRIGIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_DIRETOR_FINANCEIRO){ */
		var map = {};
		map[Activity.GATEWAY_ENVOLVE_PRESIDENTE] = "Aprovado";
		map[Activity.GATEWAY_CORRIGIR] = "Reprovado";
		return map[nextState];
	}
	else if(currentState == Activity.AVALIAR_PRESIDENTE){
		var map = {};
		map[Activity.AGUARDAR_VENCIMENTO] = "Aprovado";
		map[Activity.GATEWAY_CORRIGIR] = "Reprovado";
		return map[nextState];
	}
	return null;
}