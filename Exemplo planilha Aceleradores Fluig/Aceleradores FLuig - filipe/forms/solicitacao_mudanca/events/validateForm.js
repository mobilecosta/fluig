function validateForm(form) {
	log.info("Cheasy - Solicitação de mudança - validateForm - mode: " + form.getFormMode());
	
	var msgError = "";
	var lineBreaker = "<br/>";

	var CURRENT_STATE = getValue('WKNumState');
	var NEXT_STATE = getValue("WKNextState");
	var COMPLETED_TASK = (getValue("WKCompletTask")=="true");
    
	if(!COMPLETED_TASK || CURRENT_STATE == NEXT_STATE) return;
    
    if(CURRENT_STATE == Activity.ZERO || CURRENT_STATE == Activity.SOLICITAR_MUDANCA){
		if (campoVazio(form, "cnpjCliente")) {
			msgError += "CNPJ é obrigatorio." + lineBreaker;
		}
		
		if (campoVazio(form, "tipo_de_mudanca")) {
			msgError += "Tipo de mudança é obrigatório." + lineBreaker;
		}
		else if(form.getValue("tipo_de_mudanca") == "Emergencial"){
			if (campoVazio(form, "dataAplicacao")) {
				msgError += "Data aplicação é obrigatorio." + lineBreaker;
			}
			if (campoVazio(form, "apartir_de_horario")) {
				msgError += "Horário a partir de é obrigatorio." + lineBreaker;
			}
			if (campoVazio(form, "justificativa")) {
				msgError += "Justificativa é obrigatória." + lineBreaker;
			}
		}
		
		if (campoVazio(form, "ticket_incidente")) {
			msgError += "Ticket incidente é obrigatorio." + lineBreaker;
		}
		if (campoVazio(form, "status_homologacao")) {
			msgError += "Status homologação é obrigatorio." + lineBreaker;
		}
		if (campoVazio(form, "ambiente")) {
			msgError += "Ambiente é obrigatório." + lineBreaker;
		}
		if (campoVazio(form, "descricao_mudanca")) {
			msgError += "Descrição da mudança é obrigatória." + lineBreaker;
		}
	}
    else if(CURRENT_STATE == Activity.ELABORAR_PLANO_TECNICO){
	    var idx_ativ = form.getChildrenIndexes("tbAtividadesPlano");
	    if (idx_ativ.length > 0) {
	        
	        for (var i = 0; i < idx_ativ.length; i++) {
	        	var linha = i + 1;
	            if(campoVazio(form, 'tipoAtividade___' + idx_ativ[i])) {
	            	msgError+= 'Campo "Tipo" é obrigatório (linha ' + linha + ' tabela Plano técnico). ' + lineBreaker;  
				}
	            if(campoVazio(form, 'atividade___' + idx_ativ[i])) {
	            	msgError+= 'Campo "Atividade" é obrigatório (linha ' + linha + ' tabela Plano técnico). ' + lineBreaker;  
				}
	            if(campoVazio(form, 'duracaoPrevista___' + idx_ativ[i])) {
	            	msgError+= 'Campo "Duração prevista" é obrigatório (linha ' + linha + ' tabela Plano técnico). ' + lineBreaker;  
				}
	            if(campoVazio(form, 'zoom_grupo_responsavel___' + idx_ativ[i])) {
	            	msgError+= 'Campo "Grupo responsável" é obrigatório (linha ' + linha + ' tabela Plano técnico). ' + lineBreaker;  
				}
			}
		}
	    else if (idx_ativ.length == 0) {
	    	msgError+= 'Adicione ao menos 1 Atividade. ' + lineBreaker;  
	    }
    }
    else if(CURRENT_STATE == Activity.DOUBLE_CHECK){
	    var idx_ativ = form.getChildrenIndexes("tbAtividadesPlano");
	    if (idx_ativ.length > 0) {
	        var aoMenosUmReprovado = false;
	        
	        for (var i = 0; i < idx_ativ.length; i++) {
	        	var linha = i + 1;
	            if(campoVazio(form, 'double_check_ok___' + idx_ativ[i])) {
	            	msgError+= 'Campo "Double check ok?" é obrigatório (linha ' + linha + ' tabela Plano técnico). ' + lineBreaker;  
				}
	            else if(form.getValue('double_check_ok___' + idx_ativ[i]) == "reprovado"){
	            	aoMenosUmReprovado = true;
	            }
			}
	        log.info("Mudança - ValidateForm - aoMenosUmReprovado: " + aoMenosUmReprovado);
	        if(aoMenosUmReprovado && campoVazio(form, 'observacoes')) {
	        	msgError+= 'Insira no campo "Observações" o motivo da reprovação do plano técnico.' + lineBreaker;
	        }
		}
	    else if (idx_ativ.length == 0) {
	    	msgError+= 'Adicione ao menos 1 Atividade. ' + lineBreaker;  
	    }
    }
    else if(CURRENT_STATE == Activity.AVALIAR_SDM){
    	if (campoVazio(form, "tipo_de_mudanca")) {
			msgError += "Tipo de mudança é obrigatório." + lineBreaker;
		}
		if (campoVazio(form, "dataAplicacao")) {
			msgError += "Data aplicação é obrigatorio." + lineBreaker;
		}
		if (campoVazio(form, "apartir_de_horario")) {
			msgError += "Horário a partir de é obrigatorio." + lineBreaker;
		}
			
    	if (campoVazio(form, "parecer")) {
			msgError += "Parecer do comitê é obrigatorio." + lineBreaker;
		}
    	else if (form.getValue('parecer') == "reprovado" && campoVazio(form, "obs_aprovacao_cgm")) {
			msgError += "Observação do comitê é obrigatória." + lineBreaker;
		}
    }
    else if(CURRENT_STATE == Activity.VALIDAR_MUDANCA){
    	if (campoVazio(form, "resultado")) {
			msgError += "Parecer da validação é obrigatorio." + lineBreaker;
		}
    	else if (form.getValue('resultado') == "reprovada" && campoVazio(form, "obs_validacao_mudanca")) {
			msgError += "Observação da validação da mudança é obrigatória." + lineBreaker;
		}
    }
    
	if (msgError != "") {
		throw msgError;
	}
}

function campoVazio(form, fieldname) {
	return ((form.getValue(fieldname) == null) 
			|| (form.getValue(fieldname) == undefined) 
			|| (form.getValue(fieldname).trim() == ""));
}