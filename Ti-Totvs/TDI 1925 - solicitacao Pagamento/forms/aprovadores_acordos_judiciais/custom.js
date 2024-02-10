$(document).ready(function () {

    if (getFormMode() == "ADD") {
        for (let i = 1; i < 6; i++) {
            wdkAddChild('aprovadores');
         
            $("#valorde___1").val('0,01');
            $("#valorpara___1").val('375.000,00');
            $("#valorde___2").val('375.000,01');
            $("#valorpara___2").val('1.000.000,00');
            $("#valorde___3").val('1.000.000,01');
            $("#valorpara___3").val('3.500.000,00');
            $("#valorde___4").val('3.500.000,01');
            $("#valorpara___4").val('25.000.000,00');
            $("#valorde___5").val('0');
            $("#valorpara___5").val('25.000.000,00');
          
        }
    }

    $('#valorde___5').hide();
    document.querySelector("#aprovadores > tbody > tr:nth-child(6) > td.col-md-4 > div > label").innerHTML = "Acima de "


    for (let i = 1; i < 6; i++) {

        $("#valorde___" + i).on("input", function (event) {
            mascaraMoeda(this);
        });
        $("#valorpara___" + i).on("input", function (event) {
            mascaraMoeda(this);
        });

    }

});



const mascaraMoeda = (field) => {
    valor = field.value;
    valor = valor.replace(/\D/g, ""); 					    /**Substitui o que não é dígito por "", /g é [Global][1]*/
    valor = valor.replace(/(\d{1})(\d{14})$/, "$1.$2");     // Ponto antes dos últimos dígitos.
    valor = valor.replace(/(\d{1})(\d{11})$/, "$1.$2");     // Ponto antes dos últimos 11 dígitos.
    valor = valor.replace(/(\d{1})(\d{8})$/, "$1.$2");      // Ponto antes dos últimos 8 dígitos.
    valor = valor.replace(/(\d{1})(\d{5})$/, "$1.$2");      // Ponto antes dos últimos 5 dígitos.
    valor = valor.replace(/(\d{1})(\d{1,2})$/, "$1,$2");    // Virgula antes dos últimos 2 dígitos.
    field.value = valor;
};

