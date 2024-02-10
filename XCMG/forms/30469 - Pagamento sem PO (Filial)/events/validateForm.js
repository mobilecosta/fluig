function validateForm(form){
	var currentTaskId = getValue("WKNumState");
	var nextTaskId = getValue("WKNextState");
	var completedTask = (getValue("WKCompletTask")=="true");
	var isMobile = (form.getMobile() != null && form.getMobile()) ? true : false;
	
	log.info("SEM PO - validateForm - currentTaskId: "  +currentTaskId 
		+ " nextTaskId: " + nextTaskId); 
	
	if (!completedTask || currentTaskId == nextTaskId) {
		return;
	}

	var errorMessage = "";
	var lineBreak = (isMobile) ? "\n" : "<br/>";
  
	if (currentTaskId == Activity.ABERTURA || currentTaskId == Activity.INICIO) {
		if (isEmpty(form.getValue("nm_filial"))) {
			errorMessage +="Filial 分公司 é obrigatorio."+lineBreak;
		}
		if (isEmpty(form.getValue("cd_centro_custo"))) {
			errorMessage +="Centro de custo 成本中心 é obrigatorio."+lineBreak;
		}
		if (isEmpty(form.getValue("ds_descricao"))) {
			errorMessage +="Descrição 描述 é obrigatorio."+lineBreak;
		}
		if (isEmpty(form.getValue("cd_fornecedor"))) {
			errorMessage +="Fornecedor 供应商 é obrigatorio."+lineBreak;
		}
		if (isEmpty(form.getValue("sl_forma_pagamento"))) {
			errorMessage +="Forma de pagamento 付款方式 é obrigatorio."+lineBreak;
		}
		if(form.getValue("nm_politica_antecedencia") == "Fora política"){	    	
	    	if (isEmpty(form.getValue("ds_justificativa_politica"))) {
	    		errorMessage +="Justificativa - política de antecedência 理由 - 提前保单政策 é obrigatorio."+lineBreak;
	    	}
	    }
		
		var totalProdutos = 0;
		var indexes = form.getChildrenIndexes("tb_produtos");
	    if (indexes.length > 0) {
	        for (var i = 0; i < indexes.length; i++) { // percorre os campos Pai x Filho
	        	var registro = form.getValue("nr_produto___"+indexes[i]);
	        	
	        	if (isEmpty(form.getValue("cd_produto___"+indexes[i]))) {
	    			errorMessage +="Produto 产品 da linha "+registro+" de produtos é obrigatorio."+lineBreak;
	    		}
	        	if (isEmpty(form.getValue("cd_conta_contabil___"+indexes[i]))) {
	    			errorMessage +="Conta contábil 会计账号 da linha "+registro+" de produtos é obrigatorio."+lineBreak;
	    		}
	        	if (isEmpty(form.getValue("vl_produto___"+indexes[i]))) {
	    			errorMessage +="Valor 金额 da linha "+registro+" de produtos é obrigatorio."+lineBreak;
	    		}else{
	    			var valorProduto = "" + form.getValue("vl_produto___"+indexes[i]);
	    			valorProduto = valorProduto.replaceAll(".", "");
	    			valorProduto = valorProduto.replaceAll(",", ".");
	    			totalProdutos += parseFloat(valorProduto);
	    		}
	        }
	    }else{
	    	errorMessage+= "Obrigatório ao menos um produto."+lineBreak;
	    }
		    
	    var totalParcelas = 0;
	    indexes = form.getChildrenIndexes("tb_parcelas");
	    if (indexes.length > 0) {
	        for (var i = 0; i < indexes.length; i++) { // percorre os campos Pai x Filho
	        	var registro = form.getValue("nr_parcela___"+indexes[i]);
	        	
	        	if (isEmpty(form.getValue("vl_parcela___"+indexes[i]))) {
	    			errorMessage +="Valor 金额 da linha "+registro+" de parcelas é obrigatorio."+lineBreak;
	    		}else{
	    			var valorParcela = ""+form.getValue("vl_parcela___"+indexes[i]);
	    			valorParcela =valorParcela.replaceAll(".", "");
	    			valorParcela = valorParcela.replaceAll(",", ".");
	    			totalParcelas += parseFloat(valorParcela);
	    		}
	        	
	        	if (isEmpty(form.getValue("dt_parcela___"+indexes[i]))) {
	    			errorMessage +="Data de vencimento 到期日 da linha "+registro+" de parcelas é obrigatorio."+lineBreak;
	    		}
	        }
	    }else{
	    	errorMessage+= "Obrigatório ao menos uma parcela."+lineBreak;
	    }
	    
	    if(parseFloat(totalParcelas.toFixed(2)) != parseFloat(totalProdutos.toFixed(2))){
	    	errorMessage+= "A soma total das parcelas deve ser igual a soma total dos produtos: R$"+form.getValue("vl_total")+lineBreak;
	    }	 
	    
	    if (isEmpty(form.getValue("ck_rateio")) && (isEmpty(form.getValue("nm_situacao_budget")) || form.getValue("nm_situacao_budget") == "Indisponível")) {
			errorMessage +="Situação budget 预算状态 está indisponível."+lineBreak;
		}
	    
	    
		if (isEmpty(form.getValue("vl_total_bruto"))) {
			errorMessage +="Valor bruto 总额  é obrigatorio."+lineBreak;
		}
	    	    
	}

	if(currentTaskId == Activity.LANCAR_NOTA){
		if (isEmpty(form.getValue("rd_lancado"))) {
			errorMessage +="Lançado? 输入了吗 ? é obrigatorio."+lineBreak;
		}else if(form.getValue("rd_lancado") == "Não") {
			if (isEmpty(form.getValue("ds_obs_lancar_nota"))) {
				errorMessage +="Observações 备注 é obrigatorio."+lineBreak;
			}
		}					
	}	
		
	if(currentTaskId == Activity.RECEBIDO_CONFERIDO_PAGO){
		

		if (isEmpty(form.getValue("rd_aprov_financeiro"))) {
			errorMessage +="Aprovado? 批准了吗 ? é obrigatorio."+lineBreak;
		}else if(form.getValue("rd_aprov_financeiro") == "Reprovado") {
		
			
				if (isEmpty(form.getValue("ds_obs_aprov_financeiro"))) {
					errorMessage +="Observações 备注 é obrigatorio."+lineBreak;
				}
					
					
					
					
		} else{ // rd_aprov_financeiro = Aprovado
					
			var indexes = form.getChildrenIndexes("tb_parcelas");
		    if (indexes.length > 0) {
		        for (var i = 0; i < indexes.length; i++) { // percorre os campos Pai x Filho
		        	if(form.getValue("nm_pago___"+indexes[i]) == "atual"){
		        		if (isEmpty(form.getValue("rd_pago___"+indexes[i]))) {
			    			errorMessage +="Pago? 支付了吗 ? é obrigatorio."+lineBreak;
			    		}else if(form.getValue("rd_pago___"+indexes[i]) == "Não"){
			    			errorMessage +="Solicitação não pode ser movimentada até o pagamento da parcela."+lineBreak;
			    		}
		        	}	        	
		        }
		    }
			
			
		}
		
		
			
	}
	
	if(errorMessage != ""){
		throw errorMessage;
	}
}

function isEmpty(value) {
	return (value == null || value == undefined || value.trim() == "");
}

String.prototype.replaceAll = function(from, to){ 
	var str = this.split(from).join(to); 
	return (str); 
};