$(document).ready(function () {

    events();

});


function events() {
    enableField();
}

function enableField() {

    var AtividadeAtual = getWKNumState();

    if (AtividadeAtual == 11 || AtividadeAtual ==17) {
        $("#duvidaApoio").show();

    }
}