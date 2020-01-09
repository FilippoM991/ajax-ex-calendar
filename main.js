$(document).ready(function() {
    var template_html= $("#giorno-template").html();
    var template_function= Handlebars.compile(template_html);

    var data_iniziale = "2018-01-01";
    var moment_iniziale = moment(data_iniziale);
    // visualizzo già il titolo iniziale con gennaio
    stampa_mese(moment_iniziale);
    stampa_festivita(moment_iniziale);


    $("#successivo").click(function(){
        // devo aggiungere un mese alla data da visualizzare
        moment_iniziale.add(1, "months");
        // visualizzo il calendario aggiornato
        stampa_mese(moment_iniziale);
        stampa_festivita(moment_iniziale);
    })
    $("#precedente").click(function(){
        // devo aggiungere un mese alla data da visualizzare
        moment_iniziale.subtract(1, "months");
        // visualizzo il calendario aggiornato
        stampa_mese(moment_iniziale);
        stampa_festivita(moment_iniziale);
    })


    function stampa_mese(data_mese) {
        // resetto il calendario
        $("#calendario").empty();
        // clonoclono la data del mese cosi posso aumentarla senza problemi dovendo aumentare man mano il data nell html che serve per individualizzare ogni giorno e poterlo confrontare con le festività dateci dalla chiamata ajax
        var data_mese_giorno= moment(data_mese);
        // quanti giorni ci sono in questo mese?
        var giorni_mese = data_mese.daysInMonth();
        // come si chiama questo mese?
        var mese_testuale = data_mese.format("MMMM");

        // imposto il titolo con il mese corrente
        $("#mese-corrente").text(mese_testuale);
        // aggiungo i giorni in pagina con un ciclo for
        for (var i = 1; i <= giorni_mese; i++) {
            // invece di fare come sopra, creando un clone con data_mese_giorno così da poterlo cambiare senza problemi, avrei potuto creare una variabile, con il format di anno e mese richiesti e il giorno dato dalla i,però in quel caso è necessario inserire uno 0 davanti le singole cifre, facendolo grazie a una funzione esterna che ritorna un valore o 0+valore a seconda che la i in quel momento sia o no inferiore a 10..
            // var giorno_standard = data_mese.format("YYYY-MM-") + formatta_giorno(i)

            var placeholder = {
                day: i + " " + mese_testuale,
                // sopra ho clonato la data cosi posso usarla qui
                standard_day: data_mese_giorno.format("YYYY-MM-DD")
            };
            var html_finale= template_function(placeholder);
            $("#calendario").append(html_finale);
            // aumento di uno il giorno del clone apposta per inserire l attributo data corretto al ciclo successivo
            data_mese_giorno.add(1, "days");
        };
    };
    function stampa_festivita(data_mese){
        $.ajax({
            "url": "https://flynn.boolean.careers/exercises/api/holidays",
            "data":{
                "year": 2018,
                "month": data_mese.month()
            },
            "method": "get",
            "success": function(data) {
                var festivita = data.response;
                // console.log(festivita);
                // alert("ciao");
                for (var i = 0; i < festivita.length; i++) {
                    var festivita_corrente = festivita[i];
                    var data_festa = festivita_corrente.date;
                    var nome_festa = festivita_corrente.name;
                    // qui ho due opzioni, o uso un each per scorrere i giorni e trovare quelli che hanno il data uguale al giorno di festa oppure uso il selettore avanzato che mi permette proprio di selezionare i giorni che hanno il data che mi serve
                    var giorno_festa_calendario = $('#calendario li[data-giorno="' + data_festa + '"]');
                    giorno_festa_calendario.addClass("festa");
                    giorno_festa_calendario.append(" - " + nome_festa);
                }
            },
            "error": function(){
                alert("errore");
            }
        })
    }
    // function formatta_giorno(giorno){
    //     if (giorno < 10) {
    //         return "0" + giorno;
    //     } else {
    //         return giorno
    //     }
    // }

});
