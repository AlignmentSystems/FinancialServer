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
var fs = require('fs');
var math = require('mathjs');
var primus = require('primus');
var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
var TargetPort = 1337;
var events = require('events');

//Add mongoose
var mongoose = require('mongoose');


//Why use eval here?
//Simply put, we do this to get the code into this index.js. 
//There are other ways to do this such as using require.js but this way is clean and simple
//clearly using eval on scripts is potentially dangerous on the client but on the server, under our control
//this is not so bad...
//Get the clientlibrary code into here...
eval(fs.readFileSync(path.join(__dirname,'/public/Scripts/clientlibrary.js'))+' ');

//Get the serverlibrary code into here...

eval(fs.readFileSync(path.join(__dirname, '/public/Scripts/serverlibrary.js')) + ' ');

//Create webserver
var http = http.createServer(app);
//Create primus server instance...
var primus = new primus(http, { transformer: 'socket.io', parser: 'JSON'});

//Connect to mongodb instance running locally
mongoose.connect(MONGOTESTINSTANCE);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('db open');
 
});

//var io = require('socket.io')(http);

var clientConnectionCount = 0;

var Check = new Boolean(false);
//primus.save(__dirname + '/Public/Scripts/primus.js');

//use express to serve up the scripts needed...
app.get('/public/Scripts/primus.js', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Scripts/primus.js');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//smoothie.js
app.get('/public/Scripts/smoothie.js', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Scripts/smoothie.js');
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

//then clientlibrary.js
app.get('/public/Scripts/clientlibrary.js', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Scripts/clientlibrary.js');
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

//then StockGraph...
app.get('/public/Pages/StockGraph.html', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Pages/StockGraph.html');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//then StockGraph...
app.get('/public/Pages/StockText.html', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Pages/StockText.html');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});


//then css...
app.get('/public/css/FinancialServer.css', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/css/FinancialServer.css');
    res.sendFile(FileToServe);
    console.log('Serving up: ' + FileToServe);
});

//then angular...
app.get('/public/scripts/Angular.min.js', function (req, res) {
    var FileToServe = path.join(__dirname, '/Public/Scripts/angular.min.js');
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
   // console.log(JSON.stringify(RealTimePriceTick));
}).increment();


primus.on('initialised', function () {
    console.log('server initialised');
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
    ++clientConnectionCount;
    //console.log('a user connected, count is ' + clientConnectionCount);
    //console.log('connection has the following headers', spark.headers);
    //console.log('connection was made from', spark.address);
    //console.log('connection id', spark.id);
    spark.on('data', function message(data) {
        // we have received data from one of the connected sparks.
        //Yet, we don't know where the spark is located.  We would like to know where
        //the spark is, so we can ask the StockGraph iframe to show the specifics for this... 
        //Note that within this section of spark.on, if we call primus.write we write back to the spark
        //that called spark.on...
        //This way we know that we are talking to one client...
        //
        // console.log('connection was made from', spark.address);
        //console.log('connection id', spark.id);
        console.log('data received: ', data);
        var MessageFromClient = JSON.parse(data);
     
        switch (MessageFromClient.Verb) {
            case VERBCLOSING:
                console.log('Switch to Closing');
                break;
            case VERBOPENING:
                console.log('Switch to Opening');
                break;
            case VERBSHOWCHART:
                var ReceivedInstrumentId = MessageFromClient.ObjectId ;
                console.log('Switch to ShowChart ' + ReceivedInstrumentId);
                MessageBetweenClientAndServer.ClientSessionGuid = '';
                MessageBetweenClientAndServer.comalignmentsystemsjsontype = NAMEMESSAGEBETWEENCLIENTANDSERVER;
                MessageBetweenClientAndServer.ObjectId = ReceivedInstrumentId;
                MessageBetweenClientAndServer.Payload = GetTextOnThisInstrument(ReceivedInstrumentId);
                primus.write(JSON.stringify(MessageBetweenClientAndServer));
                break;
            default:
                console.log('Switch to default');
                break;
        };
        //Here we really need to think of a way to create a key/value collection. so we can manage the case of multiple client connections
        //each of multiple iframes within a group. This is something to think about...
        //This is the heart of the matter of the relationship between the clients and the server...
        //The server must understand the state...
    });
    

});






primus.on('disconnection', function () {
    --clientConnectionCount;
    console.log('a user disconnected, count is  ' + clientConnectionCount);
});
