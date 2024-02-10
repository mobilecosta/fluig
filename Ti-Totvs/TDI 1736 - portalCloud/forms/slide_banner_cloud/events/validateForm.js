function validateForm(form) {

    if (form.getFormMode() != "MOD") {
        var constraint = [];
        constraint.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
        var dataset = DatasetFactory.getDataset("slide_banner_cloud", null, constraint, null);
        if (dataset.values.length >= 1) {
            throw "Ja existe um formulario para Banners Cloud! <br>"
        }
    }

    var links = form.getChildrenIndexes("slideBanner");

    if(links.length <= 0) {
        throw "Selecione pelo menos 1 banner"
    }

    for (var i = 1; i <= links.length; i++) {

        if (form.getValue("idBanner___" + i) == "") {
            throw "faça o upload do Banner na linha " + i + " da tabela de Banners ! <br>"
        }

    }

}