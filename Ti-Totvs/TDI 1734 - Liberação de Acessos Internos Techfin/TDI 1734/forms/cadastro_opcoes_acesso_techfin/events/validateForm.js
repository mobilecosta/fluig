function validateForm(form) {

    if (form.getFormMode() != "MOD") {
        var constraint = [];
        constraint.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("cadastro_opcoes_acessos_techfin", null, constraint, null);
        if (dataset.values.length >= 1) {
            throw "Ja existe um formulario para Acessos Techfin! <br>"
        }
    }

    var tabelaAcessos = form.getChildrenIndexes("tabelaAcessos");

    for (var i = 1; i <= tabelaAcessos.length; i++) {

        if (form.getValue("acessos___" + i) == "") {
            throw "Digite o nome na linha " + i + " da tabela de Acessos ! <br>"
        }

    }
}