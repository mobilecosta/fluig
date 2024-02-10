<style type="text/css">
    button:hover {
        transform: scale(1.05);
    }
</style>

<div id="escalonamentoCloud" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
    <div class="row" style="text-align:center;">
        <div id="passo1" class="col-md-4">
            <button class="btn-details" id="btn_passo1" data-open-passo1
                style="position: absolute;background-color:#ffffff;font-weight:bold;border:1px solid #c0c0c0; border-radius:15px;text-align:center;width:200px;margin-left:22%;margin-top:80%;height:40px;color: black;">
                VER</button>
            <img alt=""
                src="https://prefluig14.totvs.com/webdesk/streamcontrol/passo1.png?WDCompanyId=10097&WDNrDocto=11500286&WDNrVersao=1000" />
        </div>
        <div id="passo2" class="col-md-4">
            <button class="btn-details" id="btn_passo2" data-open-passo2
                style="position: absolute;background-color:#ffffff;font-weight:bold;border:1px solid #c0c0c0; border-radius:15px;text-align:center;width:200px;margin-left:22%;margin-top:80%;height:40px;color: black;">
                VER CONTATOS</button>
            <img alt=""
                src="https://prefluig14.totvs.com/webdesk/streamcontrol/passo2.png?WDCompanyId=10097&WDNrDocto=11500287&WDNrVersao=1000" />
        </div>
        <div id="passo3" class="col-md-4">
            <button class="btn-details" id="btn_passo3" data-open-passo3
                style="position: absolute;background-color:#ffffff;font-weight:bold;border:1px solid #c0c0c0; border-radius:15px;text-align:center;width:200px;margin-left:22%;margin-top:80%;height:40px;color: black;">
                VER CONTATOS</button>
            <img alt=""
                src="https://prefluig14.totvs.com/webdesk/streamcontrol/passo3.png?WDCompanyId=10097&WDNrDocto=11500289&WDNrVersao=1000" />
        </div>
    </div>
</div>

<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>

<script type="text/template" id="templatePasso1">
    <tr>
        {{#ativo}}
            <td data-open-resposta style="font-weight: bold !important;font-size: 20px; height: 100px;"><img src="/escalonamentoCloud/resources/images/element.png" alt="">{{pergunta}}</td>
        {{/ativo}}
        {{^ativo}}<td style="display: none;"></td>{{/ativo}}
        <td>{{resposta}}</td>
    </tr>
</script>

<script type="text/template" id="templatePasso2">
    <tr>
        <td>{{assuntoPriorizar}}</td>
        <td>{{areaPriorizar}}</td>
        <td>{{nomePriorizar}}</td>
        <td>{{telefonePriorizar}}</td>
        <td>{{emailPriorizar}}</td>
    </tr>
</script>

<script type="text/template" id="templatePasso3">
    <tr>
        <td>{{assuntoUrgente}}</td>
        <td>{{areaUrgente}}</td>
        <td>{{nomeUrgente}}</td>
        <td>{{telefoneUrgente}}</td>
        <td>{{emailUrgente}}</td>
    </tr>
</script>