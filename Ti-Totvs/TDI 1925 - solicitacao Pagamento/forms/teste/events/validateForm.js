function validateForm(form) {

    if (form.getFormMode() != "MOD") {
        var constraint = [];
        constraint.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("teste", null, constraint, null);
        if (dataset.values.length >= 1) {
            throw "Ja existe um formulario para Pré cadastro de Aprovadores Judiciais!"
        }
    } 

    var indexes = form.getChildrenIndexes("aprovadores");
    
    for(var i = 1; i <= indexes.length; i++){

        if(form.getValue("valorde___"+i) == "" || form.getValue("valorpara___"+i) == ""){
            throw "Digite a faixa de valores na linha "+i+ " ! <br>"
        }
        if(form.getValue("aprovador_trabalhista___"+i) == "" || form.getValue("aprovador_trabalhista___"+i) == null){
            throw "Selecione os aprovadores de acordos judiciais trabalhistas na linha "+i+ " ! <br>"
        }
        if(form.getValue("aprovador_civel___"+i) == "" || form.getValue("aprovador_civel___"+i) == null){
            throw "Selecione os aprovadores de acordos judiciais cíveis na linha "+i+ " ! <br>"
        }
        if(form.getValue("aprovador_tributario___"+i) == "" || form.getValue("aprovador_tributario___"+i) == null){
            throw "Selecione os aprovadores de acordos judiciais tributarios na linha "+i+ " ! <br>"
        }
    }
}