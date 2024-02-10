var BannerSlideCloud = SuperWidget.extend({
    //variáveis da widget


    //método iniciado quando a widget é carregada
    init: function () {
        this.carregarSlide();
    },

    //BIND de eventos
    bindings: {
        local: {},
        global: {}
    },

    carregarSlide: function () {

        var settings = {
            id: 'slideBanner',
            images: this.buscaBanners(),
            indicators: true,
            interval: this.buscaSettings()
        };

        var carousel = FLUIGC.carousel('#carousel-slideBanner', settings);
    },

    buscaBanners: function () {
        let that = this
        var imagens = [];
        var constraints = [];
        constraints.push(DatasetFactory.createConstraint("tablename", "slideBanner", "slideBanner", ConstraintType.MUST));
        var resultado = DatasetFactory.getDataset("slide_banner_cloud", null, constraints, null);
        if (resultado != null && resultado.values != null && resultado.values.length > 0) {
            for (var i = 0; i <= resultado.values.length - 1; i++) {
                imagens.push(
                    {
                        src: `${that.getURL()}webdesk/streamcontrol/${resultado.values[i]["banner"]}?WDCompanyId=10097&WDNrDocto=${resultado.values[i]["idBanner"]}&WDNrVersao=${resultado.values[i]["versao"]}`,
                        alt: `${resultado.values[i]["banner"]}`,
                        linktarget: '_blank',
                        linkhref: `${resultado.values[i]["linkBanner"]}`
                    }
                )
            }
        }
        return imagens;
    },

    buscaSettings: function(){
        var constraints = [];
        constraints.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));
        var resultado = DatasetFactory.getDataset("slide_banner_cloud", null, constraints, null);
        return resultado.values[0]["intervalo"] * 1000;
    },

    getURL: function () {
        var url = window.location.href.toString();

        if (url.includes("prefluig14")) {
            return "https://prefluig14.totvs.com/"
        } else {
            return "https://fluig.totvs.com/"
        }
    }

});

