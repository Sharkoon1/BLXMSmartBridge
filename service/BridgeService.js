const { ethers } = require("ethers");

const __path = require('path');
require('dotenv').config({ path: __path.resolve(__dirname, "..", ".env") })


// Define Provider
const provider_BSC = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_BSC);
const provider_RINK = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_RINKEBY);

// Create Wallet
const wallet_BSC = new ethers.Wallet(process.env.PRIVATE_KEY, provider_BSC);
const wallet_RINK = new ethers.Wallet(process.env.PRIVATE_KEY, provider_RINK);


const dex_contract_source = require(__path.resolve(__dirname, "..", "contracts", "dexContract.json"));
const bridge_contract_source = require(__path.resolve(__dirname, "..", "contracts", "bridgeContract.json"));
const erc20_contract_source = require(__path.resolve(__dirname, "..", "contracts", "erc20.json"));

const dex_on_bsc_testnet_address = '0xDc36D3700e90C512a3909B5a857aC488505E2f1d'
const dex_on_rinkeby_address = '0x08c437e7AAAe3e6401b0988611Ca9a52eb7FE059'
const bridge_address = '0x89262B7bd8244b01fbce9e1610bF1D9F5D97C877'
const erc20_blxm_on_bsc_testnet_address = '0x6703bB029a9B2d44f8e21Ec7f635C5A0b06743Fa'
const erc20_stable_on_bsc_testnet_address = '0x42db14a9f863f12a9265365c1901a36e58c862fc'
const erc20_blxm_on_rinkeby_address = '0xb5382dfba952a41a2f2d0b7313c3578b83d32be0'
const erc20_stable_on_rinkeby_address = '0x22853d67597b47Fb11c7569Ab507530216cA56a4'
// Our Liquidity Pools
const dex_on_bsc_testnet = new ethers.Contract(dex_on_bsc_testnet_address, dex_contract_source, wallet_BSC)
const dex_on_rinkeby = new ethers.Contract(dex_on_rinkeby_address, dex_contract_source, wallet_RINK)
// Bridges deployed 
const bridge_on_bsc_testnet = new ethers.Contract(bridge_address, bridge_contract_source, wallet_BSC)
const bridge_on_rinkeby = new ethers.Contract(bridge_address, bridge_contract_source, wallet_RINK)
// Smart contracts for tokens to be swapped
const erc20_blxm_on_bsc_testnet = new ethers.Contract(erc20_blxm_on_bsc_testnet_address, erc20_contract_source, wallet_BSC)
const erc20_stable_on_bsc_testnet = new ethers.Contract(erc20_stable_on_bsc_testnet_address, erc20_contract_source, wallet_BSC)

const erc20_blxm_on_rinkeby = new ethers.Contract(erc20_blxm_on_rinkeby_address, erc20_contract_source, wallet_RINK)
const erc20_stable_on_rinkeby = new ethers.Contract(erc20_stable_on_rinkeby_address, erc20_contract_source, wallet_RINK)

//dex_on_bsc_testnet.on
//dex_on_rinkeby.on



erc20_blxm_on_bsc_testnet.balanceOf(dex_on_bsc_testnet_address).then( (result)=>{console.log("Balance of BLXM on BSC "+result.toString())} )

erc20_stable_on_bsc_testnet.balanceOf(dex_on_bsc_testnet_address).then( (result)=>{console.log("Balance of Stable on BSC "+result.toString())} )

erc20_blxm_on_rinkeby.balanceOf(dex_on_rinkeby_address).then( (result)=>{console.log("Balance of BLXM on Rinkeby "+result.toString())} )

erc20_stable_on_rinkeby.balanceOf(dex_on_rinkeby_address).then( (result)=>{console.log("Balance of Stable on Rinkeby "+result.toString())} )

/*
filter = {
    address: "0x08c437e7AAAe3e6401b0988611Ca9a52eb7FE059",
    topics: [
        ethers.utils.id("withdraw(uint256)")
    ]
}
dex_on_rinkeby.on(filter, (log, event) => {
    console.log("Rinkeby deposit happened");
})

filter = {
    address: "0xDc36D3700e90C512a3909B5a857aC488505E2f1d",
    topics: [
        ethers.utils.id("withdraw(uint256)")
    ]
}
dex_on_bsc_testnet.on(filter, (log, event) => {
    console.log("BSC deposit happened");
})

dex_on_rinkeby.deposit(1);
dex_on_rinkeby.withdraw(1);
*/
erc20_blxm_on_bsc_testnet.balanceOf(dex_on_bsc_testnet_address).then( (result)=>{console.log("Balance of BLXM on BSC "+result.toString())} )

erc20_stable_on_bsc_testnet.balanceOf(dex_on_bsc_testnet_address).then( (result)=>{console.log("Balance of Stable on BSC "+result.toString())} )

erc20_blxm_on_rinkeby.balanceOf(dex_on_rinkeby_address).then( (result)=>{console.log("Balance of BLXM on Rinkeby "+result.toString())} )

erc20_stable_on_rinkeby.balanceOf(dex_on_rinkeby_address).then( (result)=>{console.log("Balance of Stable on Rinkeby "+result.toString())} )

/*
filter = {
    address: "0x08c437e7AAAe3e6401b0988611Ca9a52eb7FE059",
    topics: [
        utils.id("tokenToStables(uint256)")
    ]
}
dex_on_rinkeby.on(filter, (log, event) => {
    // Emitted whenever a DAI token transfer occurs
})

filter = {
    address: "0x08c437e7AAAe3e6401b0988611Ca9a52eb7FE059",
    topics: [
        utils.id("stablesToToken(uint256)")
    ]
}
dex_on_rinkeby.on(filter, (log, event) => {
    // Emitted whenever a DAI token transfer occurs
})

filter = {
    address: "0xDc36D3700e90C512a3909B5a857aC488505E2f1d",
    topics: [
        utils.id("tokenToStables(uint256)")
    ]
}
dex_on_bsc_testnet.on(filter, (log, event) => {
    // Emitted whenever a DAI token transfer occurs
})


filter = {
    address: "0xDc36D3700e90C512a3909B5a857aC488505E2f1d",
    topics: [
        utils.id("stablesToToken(uint256)")
    ]
}
dex_on_bsc_testnet.on(filter, (log, event) => {
    // Emitted whenever a DAI token transfer occurs
})

*/

function successCallback(result) {
    console.log("Successful swap of" + result);
  }
  
  function failureCallback(error) {
    console.error("Error during swap: " + error);
  }
  

//dex_on_rinkeby.tokenToStables(1).then(successCallback, failureCallback);
//dex_on_rinkeby.stablesToToken(1).then(successCallback, failureCallback);
//dex_on_bsc_testnet.tokenToStables(1).then(successCallback, failureCallback);
//dex_on_bsc_testnet.stablesToToken(1).then(successCallback, failureCallback);

/*
const web3Eth = new Web3('Infura Rinkeby  url');
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const adminPrivKey = '';
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['4'].address
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks['97'].address
);



bridgeEth.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { from, to, amount, date, nonce } = event.returnValues;

  const tx = bridgeBsc.methods.mint(to, amount, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});
*/
function percent_of_tokens(_a, _b) {
    let a = _a / 10 ** 18
    let b = _b / 10 ** 18
    var c = a + b;
    per_a = (a * 100) / c;
    per_b = (b * 100) / c;

    return { per_a, per_b }
}




// [2] = amount of blxm to send
// [3] = in which direction to send
// direction 1 = RINK to BSC (Send BLXM)
// direction 2 = BSC to RINK (Send BLXM)
/*
async function swap(amount, direction) {
    let result_blxm = await erc20_blxm_on_bsc_testnet.balanceOf(dex_on_bsc_testnet_address)
    console.log(result_blxm.toString() / 10 ** 18)
    let result_stables = await erc20_stable_on_bsc_testnet.balanceOf(dex_on_bsc_testnet_address)
    console.log(result_stables.toString() / 10 ** 18)

    var val = percent_of_tokens(result_blxm, result_stables)
    console.log("currnet percentage on bsc_testnet (blxm, stable_coin): ")
    console.log(val)

    let result_blxm_2 = await erc20_blxm_on_rinkeby.balanceOf(dex_on_rinkeby_address)
    console.log(result_blxm_2.toString() / 10 ** 18)
    let result_stables_2 = await erc20_stable_on_rinkeby.balanceOf(dex_on_rinkeby_address)
    console.log(result_stables_2.toString() / 10 ** 18)

    var val_2 = percent_of_tokens(result_blxm_2, result_stables_2)
    console.log("currnet percentage on rinkeby (blxm, stable_coin): ")
    console.log(val_2)

    if (direction == 1) {
        if (val.per_a < val_2.per_a) { // BSC should have less BLMX
            return true
        } else {
            false
        }
    }

    if (direction == 2) {
        if (val.per_a > val_2.per_a) { // BSC should have less BLMX
            return true
        } else {
            false
        }
    }



    if (direction == 1) {
        if (await findAllValues(1)) { // If blxm is expensive on the target network
            // perform swap
            console.log("TRYING TO SWAP!!")
            var swap = await bridge_on_rinkeby.swap(erc20_blxm_on_rinkeby_address, amount, 97, erc20_blxm_on_bsc_testnet_address)
            console.log(swap)
            // ToDo Later: Withdraw & Add deposit to target network
        } else {
            console.log("--> Not worth transferring!!")
        }
        // setTimeout(findWindow, 5000)
    }
    if (direction == 2) {
        if (await findAllValues(2)) { // If blxm is expensive on the target network
            // perform swap
            console.log("TRYING TO SWAP!!")
            var swap = await bridge_on_bsc_testnet.swap(erc20_blxm_on_bsc_testnet_address, amount, 4, erc20_blxm_on_rinkeby_address)
            console.log(swap)
            // ToDo Later: Withdraw & Add deposit to target network
        } else {
            console.log("--> Not worth transferring!!")
        }
    }

}
*/