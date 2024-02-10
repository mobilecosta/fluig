$(document).ready(function () {

    $("#addPriorizar").on("click", function () {
        wdkAddChild('contatosPriorizar');
    });
    $("#addUrgente").on("click", function () {
        wdkAddChild('contatosUrgente');
    });

    
    
});

function excluirContato (element) {
    fnWdkRemoveChild(element)
}