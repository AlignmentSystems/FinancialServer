/*
 * 
 * Financial Server - a node.js example of a simplified financial markets real-time data server
 * Typical use case: Allow clients of an financial services firm to see the current bid and ask prices of
 * stocks in their portfolio in real time.
 * 
 * Author   :   John Greenan
 * Date     :   30th September 2014 
 * 
 * 
 */
var app = require('express')();
var math = require('mathjs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var TargetPort = 3000;
var path = require('path');

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
  
app.get('/', function (req, res) {
    console.log('Received request for ' + req.url);
    res.sendFile(path.join(__dirname,'/Index.html'));
});

http.listen(TargetPort, function () {
    console.log('listening on:' + TargetPort);
});

io.on('connection', function (socket) {
    console.log('a user connected')
        
    socket.on('disconnect', function () {
        console.log('a user disconnected');
    });
});

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
        
        if (StockSwitcher > 0.0) {
            RealTimePriceTick.stock = 'JKL';
        }
        
        if (StockSwitcher > 0.25) {
            RealTimePriceTick.stock = 'GHI';
        }
        
        if (StockSwitcher > 0.50) {
            RealTimePriceTick.stock = 'DEF';
        }
        
        if (StockSwitcher > 0.75) {
            RealTimePriceTick.stock = 'ABC';
        }
        var Bid = math.floor((100 * math.random()) + 1)
        var Ask = Bid * 1.023;
        var LastTrade = (Ask + Bid) / 2;
        RealTimePriceTick.Ask = Ask.toFixed(2);
        RealTimePriceTick.Bid = Bid.toFixed(2);
        RealTimePriceTick.LastTrade = LastTrade.toFixed(2);
        RealTimePriceTick.Timestamp = new Date().toJSON();
        RealTimePriceTick.Volume = self.count;
        self.emit('Tick',RealTimePriceTick);
        self.count++;
    }, 300);
};

var Pusher = new Inc(1);

//So, we are now generating some nice looking JSON which includes some random numbers, just so it does not look
//too much like something from "example 101"...

Pusher.on('Tick', function () { 
    io.emit('TickForClient', JSON.stringify(RealTimePriceTick));
    //console.log(JSON.stringify(RealTimePriceTick));
}).increment();