const FromPgn = require('@canboat/canboatjs').FromPgn;
//const {parseN2kString} = require('@canboat/canboatjs');
const parser = new FromPgn();
parser.on('warning', (pgn, warning) => {
    console.log(`[warning] ${pgn.pgn} ${warning}`);
})


try {
    let json = parser.parseString("16:29:27.08243 R 09F8017F 50 C3 B8 13 47 D8 2B C6");
    console.log(json)
    if (json) {
        console.log(JSON.stringify(json))
    }
} catch (error) {
    console.log(error)
}
