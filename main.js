var net = require('net');
var TextDecoder = require('text-encoding').TextDecoder;
var client = new net.Socket();
const FromPgn = require('@canboat/canboatjs').FromPgn;
const parser = new FromPgn();
const fs = require('fs');
parser.on('warning', (pgn, warning) => {
    console.log(`[warning] ${pgn.pgn} ${warning}`);
})
client.connect(60002, "192.168.4.1");

let dataJson=[];

client.on('data', (data) => {
    try {
        console.log("-----MESSAGE-----")
        let str = uint8ToString(data);
        let pgn = parsePgnPgns(str);
        console.log("PGN--" + pgn +"--")
        try {
            let json = parser.parseString(reFormatPgn(pgn));
            if(json){
                console.log(JSON.stringify(json))
                json["originalPgn"] = pgn;
                dataJson.push(json)
            }
        } catch (error) {
            console.error(pgn)
            dataJson.push({"originalPgn":pgn})
        }
    } catch (error) {
        console.log(error)
    }
})

function uint8ToString(uint8Array) {
    return new TextDecoder('utf-8').decode(uint8Array);
}

function getJson(str) {
    try {
        let json = parser.parseString(str);
        if (json) {
            return json
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}

//pgns are sent as split to multible lines, data is merged here to form one pgn
function parsePgnPgns(rawStr) {
    let arr = rawStr.split("\r");
    if (arr) {
        let filteredArr = arr.filter(val => val !== "" ? true : false);
        if (filteredArr) {
            let beginnig = arr[0].split(" ").slice(0, 3);
            let data = [];
            filteredArr.forEach((element, i) => {
                getDataTokens(element).forEach(token => data.push(token));
            });
            let result = beginnig.join(" ") + " " + data.join(" ");
            return result;
        }
    }
    return null;
}

//Returns data part of message
function getDataTokens(arr) {
    if (arr) {
        return sliced = arr.split(" ").slice(3)
    }
}

//Timestamp in beginning is sent as a too long string (too accurate), first part is shortened here
function reFormatPgn(pgn) {
    if (pgn) {
        let first = pgn.split(/ (.+)/)[0];
        let rest = pgn.split(/ (.+)/)[1];
        if (first) {
            first = first.substring(0, 12);
        }
        return first + " " + rest;
    }
    return null;
}

setInterval(()=>{
    fs.writeFile("test.json",JSON.stringify(dataJson),(err)=>{
        if(err){console.log(err)}
        if(!err){console.log("saved")}
    });
},3000);