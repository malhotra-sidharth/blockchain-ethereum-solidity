const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// delete entire build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// read campaign.sol file from contracts dir
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

// recreate build folder if not exists
fs.ensureDirSync(buildPath);

// create compiled ABI files for each contract
for(let contract in output) {
    let fileName = contract.replace(':', '');
    fs.outputJsonSync(
        path.resolve(buildPath, fileName + '.json'),
        output[contract]
    );
}