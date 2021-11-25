const { ethers } = require('ethers');
const __path = require('path');
var constants = require('../constants');

class AbitrageService {

    constructor() {
        this.swapTransferFunctionName = 'Transfer';

        if (!this.contract.deployed) {
            throw ('Contract has not been deployed or does not exist!')
        }

        this.init();
    }

    init() {
        const pool_bsc_abi = require(__path.join(__dirname, '../abi/pool_bsc_abi.json'));
        const pool_eth_abi = require(__path.join(__dirname, '../abi/pool_eth_abi.json'));
        const erc20_abi = require(__path.join(__dirname, '../abi/erc20_abi.json'));

        this.wallet_BSC = new ethers.Wallet(process.env.PRIVATE_KEY, constants.PROVIDER_BSC);
        this.wallet_ETH = new ethers.Wallet(process.env.PRIVATE_KEY, constants.PROVIDER_ETH);

        this.contract_pool_bsc = new ethers.Contract(constants.POOL_BSC, pool_bsc_abi, this.wallet_BSC);
        this.contract_pool_eth = new ethers.Contract(constants.POOL_ETH, pool_eth_abi, this.wallet_ETH);

        this.contract_blxm_token_bsc = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_BSC, erc20_abi, this.wallet_BSC);
        this.contract_usd_token_bsc = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, erc20_abi, this.wallet_BSC);

        this.contract_blxm_token_eth = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, erc20_abi, this.wallet_ETH);
        this.contract_usd_token_eth = new ethers.Contract(constants.USD_TOKEN_ADRESS_ETH, erc20_abi, this.wallet_ETH);

        this._registerSwapEvents();
    }

    _registerSwapEvents() {
        this.contract_pool_bsc.on(this.swapTransferFunctionName, (from, to, amount) => {
            this._startAbitrageCycleBSC({ from, to, amount });
        })

        this.contract_pool_eth.on(this.swapTransferFunctionName, (from, to, amount) => {
            this._startAbitrageCycleETH({ from, to, amount });
        })
    }

    _startAbitrageCycleBSC(transferEventData) {
        let price_bsc = this.getPoolPriceBSC();
        let price_ETH = this.getPoolPriceBSC();
    }

    _startAbitrageCycleETH(transferEventData) {
    }

    async _swapTokenToStables_BSC(amount) {
        return await contract_pool_bsc.tokenToStables(amount);
    }

    async _swapStablesToToken_BSC(amount) {
        return await contract_pool_bsc.tokenToStables(amount);
    }

    async _swapTokenToStables_ETH(amount) {
        return await contract_pool_eth.tokenToStables(amount);
    }

    async _swapStablesToToken_ETH(amount) {
        return await contract_pool_eth.tokenToStables(amount);
    }


    getPoolPriceBSC() {
        let balanceWeiBlXM = await this.contract_blxm_token_bsc.balanceOf(constants.POOL_ADDRESS_BSC);
        let balanceWeiUSD = await this.contract_usd_token_bsc.balanceOf(constants.POOL_ADDRESS_BSC);

        return ethers.utils.formatEther(balanceWeiUSD) / ethers.utils.formatEther(balanceWeiBlXM);
    }

    getPoolPriceETH() {
        let balanceWeiBlXM = await this.contract_blxm_token_eth.balanceOf(constants.POOL_ADDRESS_ETH);
        let balanceWeiUSD = await this.contract_usd_token_eth.balanceOf(constants.POOL_ADDRESS_ETH);

        return ethers.utils.formatEther(balanceWeiUSD) / ethers.utils.formatEther(balanceWeiBlXM);
    }
}


module.exports = AbitrageService;
