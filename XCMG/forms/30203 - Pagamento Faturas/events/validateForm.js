function validateForm(form){
	var currentTaskId = getValue("WKNumState");
	var nextTaskId = getValue("WKNextState");
	var completedTask = (getValue("WKCompletTask")=="true");
	
	if (!completedTask || currentTaskId == nextTaskId) {
		return;
	}

	var msgError = "";
	var isMobile = (form.getMobile() != null && form.getMobile()) ? true : false;
	var lineBreaker = (isMobile) ? "\n" : "<br/>";
  
	if (currentTaskId == Activity.ABERTURA || currentTaskId == Activity.INICIO) {
		if (isEmpty(form, "cd_empresa") || isEmpty(form, "cd_filial")) {
			msgError += "Filial 分公司 é obrigatorio." + lineBreaker;
		}
		if (isEmpty(form, "cd_centro_custo")) {
			msgError += "Centro de custo 成本中心 é obrigatorio." + lineBreaker;
		}
		
		if (isEmpty(form, "cd_conta_contabil")) {
			msgError += "Conta contábil 会计账号 é obrigatorio." + lineBreaker;
		}
		else if (isEmpty(form,"ck_rateio")
			&&	form.getValue("cd_conta_contabil").substring(0,1) == "4"
			&& (isEmpty(form, "nm_situacao_budget") 
	    		|| form.getValue("nm_situacao_budget") == "Indisponível")) {
			msgError +="Situação budget 预算状态 está indisponível."+lineBreaker;
		}
		log.info("adiantamento - validate - msgError: " + msgError);
		
		
		if (isEmpty(form, "ds_descricao")) {
			msgError += "Descrição 描述 é obrigatorio." + lineBreaker;
		}
		if (isEmpty(form, "cd_fornecedor")) {
			msgError += "Fornecedor 供应商 é obrigatorio." + lineBreaker;
		}
		if (isEmpty(form, "sl_forma_pagamento")) {
			msgError +="Forma de pagamento 付款方式 é obrigatorio."+lineBreaker;
		}
		if (isEmpty(form, "cd_natureza")) {
			msgError +="Natureza 性质 é obrigatorio."+lineBreaker;
		}
		if (necessitaClasseValor(form)){
			if (isEmpty(form, "cd_classdeb") && isEmpty(form, "cd_classcred")) {
				msgError +="Classe de Valor 價值類 é obrigatorio."+lineBreaker;
			}
		}
		
		
		if(form.getValue("nm_politica_antecedencia") == "Fora política"){	    	
	    	if (isEmpty(form, "ds_justificativa_politica")) {
	    		msgError +="Justificativa - política de antecedência 理由 - 提前保单政策 é obrigatorio."+lineBreaker;
	    	}
	    }
	}
	
	if(currentTaskId == Activity.DEFINIR_CONTA_PA){
										
		if (isEmpty(form, "rd_aprov_financeiro")) {
			errorMessage +="Aprovado? 批准了吗 ? é obrigatorio."+lineBreaker;
		}else if(form.getValue("rd_aprov_financeiro") == "Reprovado") {
				if (isEmpty(form, "ds_obs_aprov_financeiro")) {
					errorMessage +="Observações 备注 é obrigatorio."+lineBreaker;
				}
		} else { //aprovado
			
			if (form.getValue("rd_tipo")=="adiantamento" && isEmpty(form, "cd_banco_xcmg")) {
				msgError +="Banco 银行 é obrigatório."+lineBreaker;
			}
			
			
		}		
				
	}
	
	if(currentTaskId == Activity.VERIFICAR_SITUACAO){
		if (isEmpty(form, "dt_pagamento")) {
			msgError +="Data de pagamento 到期日 é obrigatório."+lineBreaker;
		}
		if (isEmpty(form, "cd_natureza")) {
			msgError +="Natureza 性质 é obrigatorio."+lineBreaker;
		}
	}
	
	if(msgError != ""){
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

String.prototype.replaceAll = function(from, to){ 
	var str = this.split(from).join(to); 
	return (str); 
};