function beforeTaskSave(colleagueId, nextSequenceId, userList) {
	var state = getValue("WKNumState");

    if (state == 0 || state == 4) {
        var attachments = hAPI.listAttachments();
        var hasAttachment = false;

        if (attachments.size() > 0)  {
            hasAttachment = true;
        }

        if (!hasAttachment) {
            // throw "é necessário anexar a documentação suporte!";
        }
    }
}