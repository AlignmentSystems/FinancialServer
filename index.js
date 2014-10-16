/*
 * 
 * Financial Server - a node.js example of a simplified financial markets real-time data server
 * Typical use case: Allow clients of an financial services firm to see the current bid and ask prices of
 * Stocks in their portfolio in real time.
 * 
 * Author   :   John Greenan
 * Date     :   30th September 2014 
 * 
 * Author   :   John Greenan
 * Date     :   16th October 2014 
 * Note     :   Replace socket.io with primus.io (wrapper for socket.io)
 * 
 */
'use strict';
var math = require('mathjs');

var primus = require('primus');
var http = require('http');
var express = require('express');

var app = express();
var http = http.createServer(app);
var primus = new primus(http, { transformer: 'socket.io', parser: 'JSON'});

//var io = require('socket.io')(http);
var TargetPort = 1337;
var path = require('path');
var events = require('events');

//JSON to hold a structure for a real-time price update...
var RealTimePriceTick = {
    "Stock"     : "ABC",
    "LastTrade" : "101",
    "Bid"       : "101",
    "Ask"       : "101",
    "Volume"    : "101",
    "Timestamp" : "101",
    "Side"      : "B",
}; 

//primus.save(__dirname + '/Public/Scripts/primus.js');

//use express to serve up the scripts needed);
app.get('/public/Scripts/primus.js', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Scripts/primus.js');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//d3.js
app.get('/public/Scripts/d3.js', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Scripts/d3.js');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//then sortable.js
app.get('/public/Scripts/sorttable.js', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Scripts/sorttable.js');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//then tickdata
app.get('/public/Pages/TickData.html', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Pages/TickData.html');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//then timeand sales...
app.get('/public/Pages/TimeAndSales.html', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Pages/TimeAndSales.html');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//then css...
app.get('/public/css/FinancialServer.css', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/css/FinancialServer.css');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//now serve up index.html...
app.get('/', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Pages/Index.html');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});


//now listen...

http.listen(TargetPort, function () {
    console.log('listening on:' + TargetPort);
});


//Add the socket.io events which interest us...
/*
 * io.on('connection', function (socket) {
    console.log('a user connected')
        
    socket.on('disconnect', function () {
        console.log('a user disconnected');
    });
});
 * */
//Replace socket.io with primus...
primus.on('connection', function (spark) {
    console.log('a user connected')
   
    primus.on('disconnect', function () {
        console.log('a user disconnected');
    });
});


 
//This is the part to generate false/simulator data for the application...

    var Inc = function (startnumber) {
        this.count = startnumber;
    };
    
    Inc.prototype = new events.EventEmitter;
    
    Inc.prototype.increment = function () {
        var self = this;
        
        setInterval(function () {
            
            var StockSwitcher = math.random();
            
            if (StockSwitcher > 0.0) {
                RealTimePriceTick.Side = 'B';
            }
            
            if (StockSwitcher > 0.5) {
                RealTimePriceTick.Side = 'S';
            }
            
            var StockSwitcher = math.random();
            
            if (StockSwitcher > 0.0) {
                RealTimePriceTick.Stock = 'JKL';
            }
            
            if (StockSwitcher > 0.25) {
                RealTimePriceTick.Stock = 'GHI';
            }
            
            if (StockSwitcher > 0.50) {
                RealTimePriceTick.Stock = 'DEF';
            }
            
            if (StockSwitcher > 0.75) {
                RealTimePriceTick.Stock = 'ABC';
            }
            var Bid = math.floor((100 * math.random()) + 1)
            var Ask = Bid * 1.023;
            var LastTrade = (Ask + Bid) / 2;
            RealTimePriceTick.Ask = Ask.toFixed(2);
            RealTimePriceTick.Bid = Bid.toFixed(2);
            RealTimePriceTick.LastTrade = LastTrade.toFixed(2);
            RealTimePriceTick.Timestamp = new Date().toJSON();
            RealTimePriceTick.Volume = self.count;
            self.emit('Tick', RealTimePriceTick);
            self.count++;
        }, 300);
    };
    
    var Pusher = new Inc(1);
    
    //So, we are now generating some nice looking JSON which includes some random numbers, 
    //just so it does not look
    //too much like something from "example 101"...
    
    Pusher.on('Tick', function () {
        primus.write(JSON.stringify(RealTimePriceTick))
        //io.emit('TickForClient', JSON.stringify(RealTimePriceTick));
        console.log(JSON.stringify(RealTimePriceTick));
    }).increment();
