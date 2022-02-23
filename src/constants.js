module.exports = Object.freeze({
    PROVIDER_BSC_TEST: `https://bsc.getblock.io/testnet/?api_key=${process.env.JSON_RPC_API_KEY}` , //Testnet
    PROVIDER_ETH_TEST: `https://eth.getblock.io/rinkeby/?api_key=${process.env.JSON_RPC_API_KEY}`, //Testnet
    PROVIDER_BSC: `https://bsc.getblock.io/mainnet/?api_key=${process.env.JSON_RPC_API_KEY}` , //Mainnet
    PROVIDER_ETH: `https://eth.getblock.io/mainnet/?api_key=${process.env.JSON_RPC_API_KEY}`, //Mainnet
    
    ARBITRAGE_CONTRACT_ADDRESS_ETH: "0xC50c71F6B2C454def7d7c7DB94952ae6d5Fae844", // * new deployed arbitrage contract ETH mainnet
    ARBITRAGE_CONTRACT_ADDRESS_BSC: "0x5fB36e5A813b8F6fb8efb06f88526B0999D033C4", // * new deployed arbitrage contract BSC mainnet
    
    WRAPPED_TOKEN_ADDRESS_BSC: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // * WBNB address in BSC mainnet
    WRAPPED_TOKEN_ADDRESS_ETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // * WETH address in ETH mainnet
    
    USD_TOKEN_ADDRESS_ETH: "0xdac17f958d2ee523a2206206994597c13d831ec7", // * USDT address in ETH mainnet
    USD_TOKEN_ADDRESS_BSC: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // * BUSD address in BSC mainnet
    
    ROUTER_ETH: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // * Router address in ETH mainnet
    ROUTER_BSC: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // * Router address in BSC mainnet

    ROUTER_ETH_TESTNET: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // * Router address in BSC testnet
    ROUTER_BSC_TESTNET: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", // * Router address in ETH testnet
    
    ARBITRAGE_CONTRACT_ADDRESS_ETH_TESTNET: "0xeC0BB4a9159F9878cE4adA5BD3F0B1e7cF729C56", // * arbitrage contract ETH testnet
    ARBITRAGE_CONTRACT_ADDRESS_BSC_TESTNET: "0x6ea9ddf184C1481F3E8Cc10A3427998649fFD680", // * arbitrage contract BSC testnet
    
    HUSD_BSC_TESTNET: "0x42db14A9f863F12A9265365C1901A36e58c862fC", // * HUSD Address BSC testnet
    HUSD_ETH_TESTNET: "0x22853d67597b47Fb11c7569Ab507530216cA56a4", // * HUSD Address ETH testnet
    
    ARBITRAGE_WALLET_ADDRESS: "0x626FB960A26681F7B0FD3E0c19D09fC440d2FF74", // * current testnet wallet with testnet ETH & BNB
    
    UNISWAP_FEES: "0.997",
    PANCAKESWAP_FEES: "0.9975",
    UNISWAP_FEES_TESTNET: "0.997",
    PANCAKESWAP_FEES_TESTNET: "0.998"
});