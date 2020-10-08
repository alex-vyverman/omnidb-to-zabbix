'use strict';

const tabletojson = require('tabletojson').Tabletojson;
const dburl = 'http://10.32.221.1/DPG/status';
const ZabbixSender = require('node-zabbix-sender');
var Sender = new ZabbixSender({
    host: '10.32.193.169',
    port: 10051,
    timeout: 5000,
    with_ns: false,
    with_timestamps: false,


});
const sendHost = 'omnidb1';

tabletojson.convertUrl(
    dburl,
    { useFirstRowForHeadings: true })
    .then(function (js) {
        var tableList1 = js[0];
        var tableList2 = tableList1[1];

        //mirror role:
        var mirrorRole = tableList2['MirrorRole'];
        Sender.addItem(sendHost, 'mirror.role', mirrorRole)

        //mirror state
        var mirrorState = tableList2['MirrorState'];
        Sender.addItem(sendHost, 'mirror.state', mirrorState)

        //Partner state
        var partnerState = tableList2['PartnerState'];
        Sender.addItem(sendHost, 'partner.state', partnerState)

        //Arbiter state
        var arbiterState = tableList2['ArbiterState'];
        Sender.addItem(sendHost, 'arbiter.state', arbiterState)

        //stuur naar Zabbix
        Sender.send(function (err, res) {
            if (err) {
                throw err;
            }

            // print the response object
            console.dir(res);
        });
    }
    );



