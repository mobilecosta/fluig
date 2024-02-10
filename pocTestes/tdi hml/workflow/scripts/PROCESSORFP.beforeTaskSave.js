function beforeTaskSave(colleagueId,nextSequenceId,userList){
	
var atv      = getValue("WKNumState");
	
	var anexos   = hAPI.listAttachments();
    var temAnexo = false;
    if (atv == 7) {
	    if (anexos.size() >= 1) {
	        temAnexo = true;
	    }
	
	    if (!temAnexo) {
	        throw "Necessário anexar um arquivo!";
	    }
    }	
}
	/*var attachments = hAPI.listAttachments();
    var hasAttachment = false;

    for (var i = 0; i < attachments.size(); i++) {
        var attachment = attachments.get(i);
        hasAttachment = true;
        
    }

    if (!hasAttachment) {
        throw "Necessário anexar um arquivo!";
    }
}*/