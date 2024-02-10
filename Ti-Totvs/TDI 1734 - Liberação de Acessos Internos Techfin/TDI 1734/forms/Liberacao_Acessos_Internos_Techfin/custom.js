$(document).ready(function () {
    selectAcessos();
    document.querySelector("#acesso").addEventListener("change", function () {
        setConditionOthers();
    });

});

function selectAcessos() {
    var constraint = [];
    constraint.push(DatasetFactory.createConstraint("tablename", "tabelaAcessos", "tabelaAcessos", ConstraintType.MUST));
    var dataset = DatasetFactory.getDataset("cadastro_opcoes_acessos_techfin", null, constraint, null);
    if (dataset.values.length >= 1) {
        var result = dataset.values
        for (var i = 0; i <= dataset.values.length - 1; i++) {
            $("#acesso").append(`<option value="${result[i]['acessos']}">${result[i]['acessos']}</option>`)
        }
        $("#acesso").append(`<option value="Outro">Outro</option>`)
        let selected = $("#acessoSelected").val();
        document.querySelector("#acesso").value = selected;
        setConditionOthers();
        $("#_acesso").append(`<option value="${selected}">${selected}</option>`);
        $("#_acesso").val(selected);
    }
};

function setSelectedZoomItem(selectedItem) {
    $("#email").val(selectedItem['email']);
}

function removedZoomItem(removedItem) {
    $("#email").val('');
}

function setConditionOthers() {

    let select = $("#acesso").val();
    $("#acessoSelected").val(select);

    if (select == "Outro") {
        $("#outrosAcessos").show();
    } else {
        $("#outrosAcessos").hide();
    }
}