const BlocknativeSdk = require('bnc-sdk');
const WebSocket = require('ws');
const configurationBsc = require('./BlocknativeSdkConfig/configurationBsc.json');
const configurationEth = require('./BlocknativeSdkConfig/configurationEth.json');
const sdkSetup = require('./BlocknativeSdkConfig/sdk-setup');

// function to handle all transaction events
function handleTransactionEventBsc(transaction) {
    console.log('Transaction event:', transaction)
  }

function handleTransactionEventEth(transaction) {
    console.log('Transaction event:', transaction)
}

const optionsBsc = {
  dappId: '578033ad-75bf-41e0-aa5d-1a3f3a7b6af8',
  networkId: 56, //ETH
  ws: WebSocket, // only neccessary in server environments 
  name: 'Instance name here', // optional, use when running multiple instances
  onerror: (error) => {console.log(error)}, //optional, use to catch errors
  transactionHandlers: [handleTransactionEventBsc]
}

const optionsEth = {
    dappId: '578033ad-75bf-41e0-aa5d-1a3f3a7b6af8',
    networkId: 1, //ETH
    ws: WebSocket, // only neccessary in server environments 
    name: 'Instance name here', // optional, use when running multiple instances
    onerror: (error) => {console.log(error)}, //optional, use to catch errors
    transactionHandlers: [handleTransactionEventEth]
  }
  
// initialize and connect to the api
const blocknativeBsc = new BlocknativeSdk(optionsBsc)
const blocknativeEth = new BlocknativeSdk(optionsEth)

sdkSetup(blocknativeBsc, configurationBsc)
sdkSetup(blocknativeEth, configurationEth)
