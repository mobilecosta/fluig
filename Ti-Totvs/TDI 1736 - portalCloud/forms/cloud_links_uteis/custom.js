$(document).ready(function () {

    $("#addLink").on("click", function () {
        wdkAddChild('linkCloud');
    });
    
    
});

function excluirLink (element) {
    fnWdkRemoveChild(element)
}