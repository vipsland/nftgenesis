//https://www.codegrepper.com/code-examples/javascript/convert+number+to+hexadecimal+in+javascript
const { toChecksumAddress } = require('ethereum-checksum-address')


const [, , num] = process.argv
function main () {
const number = num || 0
let  h = parseInt(number, 10).toString(16) // hexadecimal
// Result: "ff"

// Add Padding
h = h.padStart(64, "0")

// It should be 0x followed by a 64-character hexadecimal string. E.g. 0x7465737400000000000000000000000000000000000000000000000000000000
console.log({h, num, length: h?.length, eth_h: `0x${h}`})

// Result: "0000ff"
}

main()
