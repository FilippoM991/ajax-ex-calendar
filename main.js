$(document).ready(function() {
    // moment.locale('It');
    var template_html= $("#giorno-template").html();
    var template_function= Handlebars.compile(template_html);

    var data_iniziale = "2018-01-01";
    var moment_data = moment(data_iniziale);

    var inizio_calendario = moment("2018-01-01");
    // imposto il giorno 1 e non il 31 perchè poi posso usare isSameorAfter aggiungendo solo 1 mese alla data iniziale, arrivando proprio al 1 dicembre, mettendo il 31 non verrebbe rispettata la regola e permetterebbe di avanzare ancora di 1
    var fine_calendario = moment("2018-12-01");
    // visualizzo già il titolo iniziale con gennaio
    stampa_mese(moment_data);
    stampa_festivita(moment_data);
    $("#precedente").prop("disabled", true);


    $("#successivo").click(function(){
        // devo aggiungere un mese alla data da visualizzare
        moment_data.add(1, "months");
        // visualizzo il calendario aggiornato
        stampa_mese(moment_data);
        stampa_festivita(moment_data);
        $("#precedente").prop("disabled", false);
        if (moment_data.isSameOrAfter(fine_calendario)) {
            $(this).prop("disabled", true);
        }
    })
    $("#precedente").click(function(){
        // devo aggiungere un mese alla data da visualizzare
        moment_data.subtract(1, "months");
        // visualizzo il calendario aggiornato
        stampa_mese(moment_data);
        stampa_festivita(moment_data);
        $("#successivo").prop("disabled", false);
        if (moment_data.isSameOrBefore(inizio_calendario)) {
            $(this).prop("disabled", true);
        }
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
        mese_testuale = mese_testuale.charAt(0).toUpperCase() + mese_testuale.slice(1);

        // imposto il titolo con il mese corrente
        $("#mese-corrente").text(mese_testuale);
        // aggiungo i giorni in pagina con un ciclo for
        for (var i = 1; i <= giorni_mese; i++) {
            // invece di fare come sopra, creando un clone con data_mese_giorno così da poterlo cambiare senza problemi, avrei potuto creare una variabile, con il format di anno e mese richiesti e il giorno dato dalla i,però in quel caso è necessario inserire uno 0 davanti le singole cifre, facendolo grazie a una funzione esterna che ritorna un valore o 0+valore a seconda che la i in quel momento sia o no inferiore a 10..
            // var giorno_standard = data_mese.format("YYYY-MM-") + formatta_giorno(i)

            var placeholder = {
                day: i + " " + data_mese_giorno.format("ddd"),
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
