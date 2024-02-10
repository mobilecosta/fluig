function beforeStateEntry(sequenceId){
	log.info(_log + " - beforeStateEntry - sequenceId: " + sequenceId);
	if(sequenceId == Activity.GATEWAY_ENVOLVE_FISCAL){
		var type = hAPI.getCardValue("rd_tipo");
		if(type != "adiantamento"){
		
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
	}
	
	processMobileApproval();
}