var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var soap = require('soap');
var parser = require('xml2json');

var args = {};


var url = 'http://45.118.182.64/Boardmeeting/BMmeeting.asmx?wsdl';


app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());



router.get('/meetings', function (req, res) {



    soap.createClient(url, function (err, client) {
        if (err) {
            console.log(err);
        } else {
            console.log('success');
            //console.log(client);

            client.GetMeetingList(args, function (err, result) {


                if (err) {
                    console.log(err);
                } else {

                    // console.log(result);
                    var json = parser.toJson(result.GetMeetingListResult.toString());

                    var obj = JSON.parse(json);

                    console.log(obj.DataSet['diffgr:diffgram'].NewDataSet);
                    var response = obj.DataSet['diffgr:diffgram'].NewDataSet;
                    res.end(JSON.stringify(response));
                }
            });

        }


    });

});

router.post('/meeting', function (req, res) {


    if (req.body.id) {


        soap.createClient(url, function (err, client) {
            if (err) {
                console.log(err);
            } else {
                console.log('success');
                // console.log(client);

                // TODO: Make this thing right
                args = {
                    MeetingCode: req.body.id
                };

                client.GetMeetingByMeetingCode(args, function (err, result) {


                    if (err) {
                        console.log(err);
                    } else {
                        console.log('\n\n\n\n\n');
                        //console.log(result);
                        var json = parser.toJson(result.GetMeetingByMeetingCodeResult.toString());

                        var obj = JSON.parse(json);



                        if (JSON.stringify(obj.DataSet['diffgr:diffgram'].NewDataSet))
                            res.end(JSON.stringify(obj.DataSet['diffgr:diffgram'].NewDataSet));
                        else {
                            var response = {
                                error: true,
                                message: "invalid value for id"
                            };
                            res.end(JSON.stringify(response));
                        }

                    }
                });

            }


        });

    } else {

        var response = {
            error: true,
            message: "id Parameter required"
        };

        res.end(JSON.stringify(response));
    }



});


module.exports = router;
