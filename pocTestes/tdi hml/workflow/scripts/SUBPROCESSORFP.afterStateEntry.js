function afterStateEntry(sequenceId) {
    var nome = fluigAPI.getUserService().getCurrent().getFullName();
    hAPI.setCardValue("nomeApoiador", nome);

}