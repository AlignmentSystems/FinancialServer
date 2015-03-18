/*
<!-- Financial Server - a node.js example of a simplified financial markets real-time data server 
<!-- Typical use case: Allow clients of an financial services firm to see the current bid and ask prices of 
<!-- Stocks in their portfolio in real time
<!-- 
<!-- Author   :   John Greenan
<!-- Date     :   30th September 2014
*/
const DEFAULTINSTRUMENT = 'DefaultInstrument';
const CALLINGGUID = 'calling localguid';
const DISCONNECTED = 'Disconnected';
const CLIENTHASCONNECTEDTOSERVER = 'Client has connected to server';
const MAGICSTRING = 'Client_Magic_String';
const VERBOPENING = '__opening';
const VERBCLOSING = '__closing';
const VERBSHOWCHART = '__showchart';
const NAMEREALTIMEPRICETICK = 'RealTimePriceTick';
const NAMEMESSAGEBETWEENCLIENTANDSERVER = 'MessageBetweenClientAndServer';

//Cookie related variables
var TargetCookieName1 = encodeURI("TargetName");
var TargetCookieName2 = encodeURI("Domain");


//JSON to hold a structure for a real-time price update...
var RealTimePriceTick = {
    "comalignmentsystemsjsontype" : NAMEREALTIMEPRICETICK,
    "Stock": "ABC",
    "LastTrade": "101",
    "Bid": "101",
    "Ask": "101",
    "Volume": "101",
    "Timestamp": "101",
    "Side": "B",
};

//JSON to hold a structure for a message from client to server...
var MessageBetweenClientAndServer = {
    "comalignmentsystemsjsontype" : NAMEMESSAGEBETWEENCLIENTANDSERVER,
    "SendingURL": "http://example.com",
    "Verb": "Action",
    "ClientSessionGuid": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
    "ObjectType" : "DefaultObjectType",
    "ObjectId" : " DefaultObjectId",
    "Payload" : "ABCDE"
};


function GetTextOnThisInstrument(Instrument) {
    var Text = 'Here is some text on the instrument you selected (' + Instrument + ')';
    return Text;
}

function GetGuid() {
    var d  = new Date().getTime();
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d+Math.random() * 16)%16 | 0;
        d=Math.floor(d/16);
        return (c=='x'?r:(r&0x7|0x8)).toString(16);
    });
    return guid;
};


function getCookie(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}