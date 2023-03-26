const { LogDescription } = require('ethers/lib/utils');
const fs = require('fs');

let PRTs_lotery = `${fs.readFileSync('./output/PRTs_lotery.json')}`;
PRTs_lotery = PRTs_lotery.match(/\d+/gi)

console.log({PRTs_lotery})


let win_address = [];

let PRTs_generated = `${fs.readFileSync('./output/PRTs_generated.json')}`;


PRTs_generated = PRTs_generated.match(/\[(\"?\w+\"?\,?)+\]/gi)

const count_address = PRTs_generated.length;

let winners = []

const logs = PRTs_generated.map(i => {

    const [address,data] = JSON.parse(i);
    const prts = data.split(',');

    const result = prts.reduce((_acc, prt) => {
        _acc[`${address}`] = PRTs_lotery.includes(prt);
        return _acc
    }, {})

    return result;
})

console.log({logs});

const wins = logs.filter(object => Object.keys(object).find(key => object[key] === true))

console.log({wins, length: wins.length, percentage: wins.length/count_address})
