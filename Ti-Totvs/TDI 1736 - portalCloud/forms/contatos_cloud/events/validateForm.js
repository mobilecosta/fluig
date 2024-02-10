function validateForm(form) {

    if (form.getFormMode() != "MOD") {
        var constraint = [];
        constraint.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("contatos_cloud", null, constraint, null);
        if (dataset.values.length >= 1) {
            throw "Ja existe um formulario para Contatos Cloud! <br>"
        }
    }

    var priorizar = form.getChildrenIndexes("contatosPriorizar");

    for (var i = 1; i <= priorizar.length; i++) {

        if (form.getValue("assuntoPriorizar___" + i) == "") {
            throw "Digite o assunto na linha " + i + " da tabela de contatos(Priorizar) ! <br>"
        }
        if (form.getValue("areaPriorizar___" + i) == "") {
            throw "Digite a Área na linha " + i + " da tabela de contatos(Priorizar) ! <br>"
        }
        if (form.getValue("nomePriorizar___" + i) == "") {
            throw "Digite o Nome na linha " + i + " da tabela de contatos(Priorizar) ! <br>"
        }
        if (form.getValue("telefonePriorizar___" + i) == "") {
            throw "Digite o Telefone na linha " + i + " da tabela de contatos(Priorizar) ! <br>"
        }
        if (form.getValue("emailPriorizar___" + i) == "") {
            throw "Digite o E-mail na linha " + i + " da tabela de contatos(Priorizar) ! <br>"
        }

    }

    var urgente = form.getChildrenIndexes("contatosUrgente");

    for (var i = 1; i <= urgente.length; i++) {

        if (form.getValue("assuntoUrgente___" + i) == "") {
            throw "Digite o assunto na linha " + i + " da tabela de contatos(Urgente) ! <br>"
        }
        if (form.getValue("areaUrgente___" + i) == "") {
            throw "Digite a Área na linha " + i + " da tabela de contatos(Urgente) ! <br>"
        }
        if (form.getValue("nomeUrgente___" + i) == "") {
            throw "Digite o Nome na linha " + i + " da tabela de contatos(Urgente) ! <br>"
        }
        if (form.getValue("telefoneUrgente___" + i) == "") {
            throw "Digite o Telefone na linha " + i + " da tabela de contatos(Urgente) ! <br>"
        }
        if (form.getValue("emailUrgente___" + i) == "") {
            throw "Digite o E-mail na linha " + i + " da tabela de contatos(Urgente) ! <br>"
        }

    }
}