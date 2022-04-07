const constants = require("../constants");
const { ethers } = require("ethers");


function validateMainNetProvider() {
    if(!process.env.JSON_RPC_API_KEY) { 
        throw new Error(`Mainnet JSON RPC node provider api key is not set in the enviroment file. 
                         Please set the api key. 
                        [For testing in the Testnet the mainnet rpc api keys must also be set to retrive real eth and bnb prices.]`);
    }

    let ethProvider = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_ETH"]);
    ethProvider.getNetwork().catch(error => {
        if(error.event === "noNetwork") {
            throw new Error("ETH JSON RPC node could not detect network. Api key could be invalid or node ran out of requests.");
        }

    });

    let bscProvider = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_BSC"]);
        bscProvider.getNetwork().catch(error => {
            if(error.event === "noNetwork") {
                throw new Error("BSC JSON RPC node could not detect network. Api key could be invalid or node ran out of requests.");
            }

        });
}

function validateTestNetProvider() {
     // Testnet
    if(process.env.NODE_ENV !== "production" && !process.env.JSON_RPC_API_KEY_TESTNET) { 
        throw new Error("Testnet JSON RPC node provider api key is not set in the enviroment file. Please set the api key.");
    }

    let ethProviderTestnet = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_ETH_TEST"]);
    ethProviderTestnet.getNetwork().catch(error => {
        if(error.event === "noNetwork") {
            throw new Error("Testnet ETH JSON RPC node could not detect network. Api key could be invalid or node ran out of requests.");
        }

    });

    let bscProviderTestnet = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_BSC_TEST"]);
    bscProviderTestnet.getNetwork().catch(error => {
            if(error.event === "noNetwork") {
                throw new Error("Testnet BSC JSON RPC node could not detect network. Api key could be invalid or node ran out of requests.");
            }

        });
}

module.exports = { validateMainNetProvider,  validateTestNetProvider };