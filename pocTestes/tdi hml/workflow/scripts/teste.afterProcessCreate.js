function afterProcessCreate(processId) {

    var childData = new java.util.HashMap();
    childData.put("produto", "valor1");
    childData.put("Area","valor2");
    hAPI.addCardChild("tabelaRespostas", childData);
}