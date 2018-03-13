const path = require('path'); // gives cross platform compatibility compared to direct path
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// input: source code and number of contracts
// to compile. In this case, its just one.
module.exports = solc.compile(source, 1).contracts[':Inbox']; // direct access to inbox contract