/*
 * 
 * Financial Server - a node.js example of a simplified financial markets real-time data server
 * Typical use case: Allow clients of an financial services firm to see the current bid and ask prices of
 * stocks in their portfolio in real time.
 *  
 */
var app = require('express')();
var path = require('path');
var events = require('events');
var math = require('mathjs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var TargetPort = 3000;

//JSON to hold a structure for a real-time price update...
var RealTimePriceTick = {
    "stock"     : "ABC",
    "LastTrade" : "101",
    "Bid"       : "101",
    "Ask"       : "101",
    "Volume"    : "101"
}; 
  
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'/Index.html'));
});

http.listen(TargetPort, function () {
    console.log('listening on:' + TargetPort);
});

io.on('connection', function (socket) {
    console.log('a user connected')
    
    //How do we check to see if a socket has actually been created?
    //So at a simple level - like in VBA "if not xxx is nothing then... else...end if?
    //Possibly just me bring my legacy coding baggage?
    //If we stick this disconnect event within the connection event code then we MUST have connected, so a socket must be here
    //I would prefer to have this piece of logic somewhere else, so we don't have much nesting of functions, again, this is probably
    //just a hang up from VBA days....
    
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
        var Ask = math.floor((100 * math.random()) + 1)
        var Bid = Ask * 1.023;
        var LastTrade = (Ask + Bid) / 2;
        RealTimePriceTick.Ask = Ask.toFixed(2);
        RealTimePriceTick.Bid = Bid.toFixed(2);
        RealTimePriceTick.LastTrade=LastTrade.toFixed(2) ;
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