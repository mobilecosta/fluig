function validateForm(form) {
	log.info("XCMG - Pagamentro de tributos - validateForm - mode: " + form.getFormMode());
	
	var msgError = "";
	var isMobile = (form.getMobile() != null && form.getMobile()) ? true : false;
	var lineBreaker = (isMobile) ? "\n" : "<br/>";

	var CURRENT_STATE = getValue('WKNumState');
	var NEXT_STATE = getValue("WKNextState");
	var COMPLETED_TASK = (getValue("WKCompletTask")=="true");
	var POLICY = { NOK: "Fora política", OK: "Dentro política" };
    
	if(!COMPLETED_TASK || CURRENT_STATE == NEXT_STATE) return;
    
    if (isEmpty(form, "dt_pagamento")) {
		msgError += "Data de pagamento 發薪日 é obrigatorio." + lineBreaker;
	}
    if(CURRENT_STATE == Activity.ZERO || CURRENT_STATE == Activity.INICIO){
    	if (isEmpty(form, "cd_empresa") || isEmpty(form, "cd_filial")) {
			msgError += "Filial 分公司 é obrigatorio." + lineBreaker;
		}
		if (isEmpty(form, "cd_centro_custo")) {
			msgError += "Centro de custo 成本中心 é obrigatorio." + lineBreaker;
		}
		if (isEmpty(form, "cd_conta_contabil")) {
			msgError += "Conta contábil 会计账号 é obrigatorio." + lineBreaker;
		}
		if (isEmpty(form, "ds_descricao")) {
			msgError += "Descrição 描述 é obrigatorio." + lineBreaker;
		}
		
		if (isEmpty(form, "cd_fornecedor")) {
			msgError += "Fornecedor 供应商 é obrigatorio." + lineBreaker;
		}
		if (isEmpty(form, "nm_forma_pagamento")) {
			msgError += "Forma de pagamento 付款方式 é obrigatorio." + lineBreaker;
		}
		if (necessitaClasseValor(form)){
			if (isEmpty(form, "cd_classdeb") && isEmpty(form, "cd_classcred")) {
				msgError +="Classe de Valor 價值類 é obrigatorio."+lineBreaker;
			}
		}

		//validar titulos
		//XXX:Quando titulo tipo TC (COMEX) permite lançar atrasado
		var temTC = false; 
	    var idx_tit = form.getChildrenIndexes("tbTitulos");
	    if (idx_tit.length > 0) {
	        
	        for (var i = 0; i < idx_tit.length; i++) {
	        	var linha = i + 1;
	            if(isEmpty(form, 'tit_dt_emissao___' + idx_tit[i])) {
	            	msgError+= 'Campo "Data emissão 发行日期" é obrigatório (linha ' + linha + ' tabela Títulos). ' + lineBreaker;  
				}
	            if(isEmpty(form, 'tit_dt_vencimento___' + idx_tit[i])) {
	            	msgError+= 'Campo "Data de vencimento 到期日" é obrigatório (linha ' + linha + ' tabela Títulos). ' + lineBreaker;  
				}
	            if(isEmpty(form, 'titulo___' + idx_tit[i]) 
	            	&& isEmpty(form, 'tit_cd_centro_custo___' + idx_tit[i])) {
	            	msgError+= 'Campo "Centro de custo 成本中心" é obrigatório (linha ' + linha + ' tabela Títulos). ' + lineBreaker;  
				}
	            if(isEmpty(form, 'tit_cd_natureza___' + idx_tit[i])) {
	            	msgError+= 'Campo "Natureza 性质" é obrigatório (linha ' + linha + ' tabela Títulos). ' + lineBreaker;  
				}
				if(isEmpty(form, 'tit_vl_original___' + idx_tit[i])) {
	            	msgError+= 'Campo "Valor 金额" é obrigatório (linha ' + linha + ' tabela Títulos). ' + lineBreaker;  
				}
				
				if(isEmpty(form, 'tit_tipo___' + idx_tit[i])) {
	            	msgError+= 'Campo "Tipo 稅務文件類型" é obrigatório (linha ' + linha + ' tabela Títulos). ' + lineBreaker;  
				}
				else if(form.getValue('tit_tipo___' + idx_tit[i]) == "TC") {
	            	temTC = true;  
				}
			}
			
			if(!temTC){
				//Se não é tipo TC (COMEX), não pode abrir fora da política
				if (form.getValue("nm_politica_antecedencia") == POLICY.NOK){
		    		throw "Solicitações fora da política de antecedência não podem ser iniciadas!"
		    			+ "無法發起提前政策之外的請求!";
		    	}
		    }
		    else{
				//Quando tipo TC (COMEX) necessário justificar abertura atrasada
				if (form.getValue("nm_politica_antecedencia") == POLICY.NOK && isEmpty(form, "ds_justificativa_politica")) {
					msgError += "Justificativa - Política de antecedência 理由 - 预付保单政策 é obrigatorio." + lineBreaker;
				}
			}
		}
	    else if (idx_tit.length == 0) {
	    	msgError+= 'Adicione ao menos 1 Título 标题. ' + lineBreaker;  
	    }
	    
	    if(form.getValue("sl_moeda") != "1" && isEmpty(form, "vl_taxa")){
			msgError +="Taxa é obrigatorio."+lineBreaker;
		}
	    
	    if (isEmpty(form, "cd_gerente_area") || isEmpty(form, "nm_gerente_area")) {
			msgError += "Falha ao recuperar os aprovadores."
				+ " Selecione o centro de custo novamente. 無法檢索批准人。再次選擇成本中心。" + lineBreaker;
		}
	    
	    
		if (isEmpty(form, "vl_total_tributos_bruto")) {
			msgError +="Valor bruto 总额 é obrigatorio."+lineBreaker;
		}		    
    }
    
    
    if(CURRENT_STATE == Activity.RECEBIDO_CONFERIDO){
    	    	
		if (isEmpty(form, "rd_aprov_financeiro")) {
			errorMessage +="Aprovado? 批准了吗 ? é obrigatorio."+lineBreak;
		}else if(form.getValue("rd_aprov_financeiro") == "Reprovado") {
				if (isEmpty(form, "ds_obs_aprov_financeiro")) {
					errorMessage +="Observações 备注 é obrigatorio."+lineBreak;
				}
		}
    	
    }
       
    
	if (msgError != "") {
		throw msgError;
	}
}

function necessitaClasseValor(form){
	return form.getValue("cd_filial") == "2002"
		|| form.getValue("cd_conta_contabil") == "1104020001";
}

function isEmpty(form, fieldname) {
	return ((form.getValue(fieldname) == null) 
			|| (form.getValue(fieldname) == undefined) 
			|| (form.getValue(fieldname).trim() == ""));
}