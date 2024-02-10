$(document).ready(function () {

    enableFields();

    $("#addBanner").on("click", function () {
        wdkAddChild('slideBanner');
    });
});

function excluirLinha(element) {
    fnWdkRemoveChild(element);
}

function enableFields() {

    if (getFormMode() == "VIEW") {
        $("#addBanner").hide();

        var rows = $('#slideBanner tbody tr:not(:first-child)')
        rows.each((index, element) => {

            $($(element).find('.fluigicon-trash')[0]).hide();

        });

    };

}

function setSelectedZoomItem(selectedItem) {

    let index = selectedItem['inputName'].substr(9);
    $("#idBanner___" + index).val(selectedItem['documentId']);
    $("#versao___" + index).val(selectedItem['version']);
    
}

function removedZoomItem(removedItem) {

    let index = removedItem['inputName'].substr(9);
    $("#idBanner___" + index).val('');
    $("#versao___" + index).val('');

}





