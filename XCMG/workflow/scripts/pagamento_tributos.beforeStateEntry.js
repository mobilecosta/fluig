function beforeStateEntry(sequenceId){
	log.info(_log + " - beforeStateEntry - sequenceId: " + sequenceId);
	if(sequenceId == Activity.SERVICE_ATRIBUIR){ //Activity.AVALIAR_GER_AREA){
		var attachmentsNeeded = parseInt(hAPI.getAdvancedProperty("qtd_anexos"),10);

		var attachments = hAPI.listAttachments();
		var hasAttachment = (attachments != null && attachments.size() >= attachmentsNeeded);
		if (!hasAttachment) {
			throw "Atenção! 注意 ! Não esqueceça de adicionar os ("+attachmentsNeeded+") anexos! 不要忘記添加附件";
	    }
	}
	
	processMobileApproval();
}