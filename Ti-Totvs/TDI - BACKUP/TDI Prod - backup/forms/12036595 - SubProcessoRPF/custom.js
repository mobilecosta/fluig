$(document).ready(function () {

    events();

});


function events() {
    enableField();

}



function enableField() {

    var AtividadeAtual = getWKNumState();


    if(AtividadeAtual == 11){
        $('#ESN').show();
    }
   
    if($('#RepostaESN').val() != ''){
        $('#ESN').show();
    }

}



