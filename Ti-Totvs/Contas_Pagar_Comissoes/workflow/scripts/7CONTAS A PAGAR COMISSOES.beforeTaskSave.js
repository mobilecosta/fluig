function beforeTaskSave(colleagueId,nextSequenceId,userList){
	var anexo = hAPI.listAttachments();
	if (nextSequenceId == 12){
		if (anexo.size() == 0){
			throw " é necessário anexar a nota fiscal.";
		}
	}
}