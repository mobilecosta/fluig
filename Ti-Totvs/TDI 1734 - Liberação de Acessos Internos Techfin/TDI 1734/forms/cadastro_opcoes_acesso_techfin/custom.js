$(document).ready(function () {

    enableFields();

    $("#addAcessos").on("click", function () {
        wdkAddChild('tabelaAcessos');
    });

    
    
});

function excluirAcessos (element) {
    fnWdkRemoveChild(element)
}

function enableFields() {

    if (getFormMode() == "VIEW") {
        $("#addAcessos").hide();

        var rows = $('#tabelaAcessos tbody tr')
        rows.each((index, element) => {

            $($(element).find('.fluigicon-trash')[0]).hide();

        });

    };

}