function beforeStateEntry(sequenceId){
	var attachments = hAPI.listAttachments();
	var company = ''+getValue("WKCompany");
	var process = ''+getValue("WKNumProces");
	var currentId = getValue("WKCurrentState");
  
	if (sequenceId == Activity.LANCAR_NOTA){
		var valorAnterior =  hAPI.getCardValue("vl_total");
		hAPI.setCardValue("vl_total_anterior", valorAnterior);
		
		var attchmentsNeeded = parseInt(hAPI.getAdvancedProperty("qtd_anexos"),10);
		var needBoleto = hAPI.getCardValue("sl_forma_pagamento") == "boleto";
		if(needBoleto) attchmentsNeeded++;
		
		var rateio = !isEmpty(hAPI.getCardValue("ck_rateio"));
		if(rateio) attchmentsNeeded++;
		
		var attachments = hAPI.listAttachments();
		var hasAttachment = (attachments != null && attachments.size() >= attchmentsNeeded);

		if (!hasAttachment) {
			var erro = "Atenção! 注意 ! Não esqueceça de adicionar os ("+attchmentsNeeded+") anexos";
			
			if(needBoleto)
				erro += ", incluindo o boleto. 包括匯票 "
			
			if(rateio)
				erro += ", incluindo o documento de detalhamento do rateio."
					
			erro += " 不要忘記添加附件";
					
			throw erro;
	    }
    }
    
    //Anexe o comprovante de pagamento.
	
	if(currentId == Activity.RECEBIDO_CONFERIDO_PAGO && sequenceId == Activity.GATEWAY_APROV_FINANCEIRO){
		
		var v_atual_paga = false;
		
		var indexes = hAPI.getChildrenIndexes("tb_parcelas");
		for (var i = 0; i < indexes.length; i++) {
						
			var row = indexes[i];
						
			var paid = hAPI.getCardValue("nm_pago___"+row);
			
			if(paid == "atual" && hAPI.getCardValue("rd_pago___"+row) == "Sim"){
				hAPI.setCardValue("nm_pago___"+row,"sim");
				v_atual_paga = true;
			}else if(paid == "pendente" && v_atual_paga){
				hAPI.setCardValue("nm_pago___"+row,"atual");
				var newPaymentDate =  hAPI.getCardValue("dt_parcela___"+row);
				hAPI.setCardValue("dt_pagamento",newPaymentDate);
				var newPaymentDateISO = transformDateFromTo(newPaymentDate,"dd/MM/yyyy","yyyy-MM-dd");
				hAPI.setCardValue("dt_pagamento_iso",newPaymentDateISO);
				break;
			}
			
			
		}
				
		if(hAPI.getCardValue("rd_aprov_financeiro") == "Aprovado"){
			
			if(!comprovanteAnexado(company, process, currentId)){
				throw "Obrigatório anexar o comprovante de pagamento!";
			}

		}

		
	}
	
	processMobileApproval();
}