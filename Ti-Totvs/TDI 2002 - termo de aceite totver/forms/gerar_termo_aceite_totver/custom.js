$(document).ready(function () {

    $("#addUsuario").on("click", function () {
        wdkAddChild('tabelaUsuarios');
    });
    $("#usuario").on("click", function () {
        setCSV("usuario");
    });
    $("#csv").on("click", function () {
        setCSV("csv");
    });

});

function excluirUsuario(element) {
    fnWdkRemoveChild(element)
}

function setCSV(radio) {

    if (radio == "usuario") {
        $("#addUsuario").show();
        $("#importarCSV").hide();
    }
    if (radio == "csv") {
        $("#addUsuario").hide();
        $("#importarCSV").show();
    }
}

function setSelectedZoomItem(selectedItem) {
    let index = selectedItem["inputId"].slice(-1);
    $("#emailTotver___" + index).val(selectedItem['email']);
    $("#matriculaTotver___" + index).val(selectedItem['matricula']);
}

function removedZoomItem(removedItem) {
    let index = removedItem["inputId"].slice(-1);
    $("#emailTotver___" + index).val('');
    $("#matriculaTotver___" + index).val('');
}
