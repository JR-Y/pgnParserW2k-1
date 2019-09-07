var net = require('net');
var TextDecoder = require('text-encoding').TextDecoder;
// Permission was granted
var client = new net.Socket();
const FromPgn = require('@canboat/canboatjs').FromPgn;
const parser = new FromPgn();
client.connect(60001, "192.168.4.1");

client.on('data', (data) => {
    console.log(new TextDecoder('utf-8').decode(data))
    try {
        let json = parser.parse(uint8ToString(data));
        console.log(JSON.stringify(json))

    } catch (error) {
        console.log(error)

    }

})

function uint8ToString(uint8Array) {
    return new TextDecoder('utf-8').decode(uint8Array);
}