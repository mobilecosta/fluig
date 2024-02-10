function validateForm(form) {

    if (form.getFormMode() != "MOD") {
        var constraint = [];
        constraint.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("cloud_links_uteis", null, constraint, null);
        if (dataset.values.length >= 1) {
            throw "Ja existe um formulario para Links Cloud! <br>"
        }
    }

    var links = form.getChildrenIndexes("linkCloud");

    for (var i = 1; i <= links.length; i++) {

        if (form.getValue("tituloLink___" + i) == "") {
            throw "Digite o Título na linha " + i + " da tabela de Links ! <br>"
        }
        if (form.getValue("linkTitulo___" + i) == "") {
            throw "Digite o Link na linha " + i + " da tabela de Links ! <br>"
        }

    }

}