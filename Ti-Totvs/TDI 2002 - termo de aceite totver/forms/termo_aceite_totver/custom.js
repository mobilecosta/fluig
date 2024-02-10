$(document).ready(function () {

    if (getWKNumState() == 5) {
        window.parent.$(".btn-group").hide();
    }

});


function customEnviar() {
    window.parent.$('button[data-send]').first().click();
}

function setSelectedZoomItem(selectedItem) {
    $("#emailTotver").val(selectedItem['email']);
    $("#matriculaTotver").val(selectedItem['matricula']);
}

function removedZoomItem(removedItem) {
    $("#emailTotver").val('');
    $("#matriculaTotver").val('');
}