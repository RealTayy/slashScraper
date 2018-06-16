const debug = (value, context) => {
    console.log(`TYPEOF ${typeof value}`)
    console.log(`VALUE ${JSON.stringify(value, null, 2)}`);
}

const ifCond = (arg1, arg2, options) => {
    if (arg1 === arg2) {
        return options.fn(this);
    }
    return options.inverse(this);
}

module.exports = { debug, ifCond }

