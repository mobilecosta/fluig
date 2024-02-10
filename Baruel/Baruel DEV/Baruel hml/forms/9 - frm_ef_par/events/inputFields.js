function inputFields(form) {
	form.setValue("descricao", form.getValue("processName") + " - " + form.getValue("groupId"));
}