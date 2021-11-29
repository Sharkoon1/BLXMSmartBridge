const { ethers } = require('ethers');
const __path = require('path');
const constants = require('../constants');
const TransformationService = require('../TransformationService');

class ArbitrageService {

    constructor() {
        this.swapTransferFunctionName = 'Transfer';


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

                
        if (!this.contract_pool_bsc.deployed) {
            throw ('Contract pool in bsc has not been deployed or does not exist!')
        }
        
        if (!this.contract_pool_eth.deployed) {
            throw ('Contract pool in eth has not been deployed or does not exist!')
        }

        this.contract_blxm_token_bsc = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_BSC, erc20_abi, this.wallet_BSC); 
        this.contract_usd_token_bsc = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, erc20_abi, this.wallet_BSC); 

        this.contract_blxm_token_eth = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, erc20_abi, this.wallet_ETH); 
        this.contract_usd_token_eth = new ethers.Contract(constants.USD_TOKEN_ADRESS_ETH, erc20_abi, this.wallet_ETH); 

        this._registerSwapEvents();
    }

    _registerSwapEvents() {
        this.contract_pool_bsc.on(this.swapTransferFunctionName, (from, to, amount) => {
            await this._startArbitrageCycleBSC();
        })

        this.contract_pool_eth.on(this.swapTransferFunctionName, (from, to, amount) => {
            await this._startArbitrageCycleETH();
        })
    }

    async _startArbitrageCycleBSC() {
        let pool_price_bsc = await this.getPoolPriceBSC();
        let pool_price_eth = await this.getPoolPriceBSC();

        if(pool_price_bsc > pool_price_eth) {
            let arbitrage_balance_blxm_eth = await this.getArbitrageBalanceBlxmETH();

            let balanceBlxmBSC = await this.getPoolBalanceBlxmBSC();
            let balanceUsdcBSC = await this.getPoolBalanceUSDBSC();
            let balanceBlxmETH = await this.getPoolBalanceBlxmETH();
            let balanceUsdcETH = await this.getPoolBalanceUSDETH();

            let adjustmentValue = TransformationService.getAdjustmentValue(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);

            // is liqudity avaible ? 
            if(arbitrage_balance_blxm_eth > 0) {
                return await this._bridgeAndSwapBSC(adjustmentValue, arbitrage_balance_blxm_eth);
            }

            // provide liqudity in bsc
            // swap and bridge usd
            else {
                let arbitrage_balance_usd_bsc = await this.getArbitrageBalanceUSDBSC();
                let arbitrage_balance_usd_eth = await this.getArbitrageBalanceUSDETH();
    
                if(arbitrage_balance_usd_eth > 0) {
                    // cheap network    
                    // swap in bsc usd to blxm

                    let usd_amount = pool_price_eth * adjustmentValue;
                    let usdSwapAmount = 0;

                    if(usd_amount <= balanceUsdcETH) {
                        usdSwapAmount = usd_amount;
                    }

                    else {
                        usdSwapAmount = balanceUsdcETH;
                    }

                    await this._swapStablesToToken_BSC(usdSwapAmount);
                }
    
                else if(arbitrage_balance_usd_bsc > 0) {
                    // expensive network 
                    // bridge usdc to bsc
    
                    // swap in bsc usd to blxm
                    let usd_amount = pool_price_bsc * adjustmentValue;
                    let usdSwapAmount = 0;

                    if(usd_amount <= balanceUsdcBSC) {
                        usdSwapAmount = usd_amount;
                    }

                    else {
                        usdSwapAmount = balanceUsdcBSC;
                    }

                    await this._swapStablesToToken_ETH(usdSwapAmount);
                }
    
                arbitrage_balance_blxm_eth = this.getArbitrageBalanceBlxmBSC();
    
                return await this._bridgeAndSwapBSC(adjustmentValue, arbitrage_balance_blxm_eth);
            }
        }
    }

    async _startArbitrageCycleETH() {
        let pool_price_bsc = await this.getPoolPriceBSC();
        let pool_price_eth = await this.getPoolPriceBSC();

        if(pool_price_bsc < pool_price_eth) {
            let arbitrage_balance_blxm_bsc = await this.getArbitrageBalanceBlxmBSC();

            let balanceBlxmBSC = await this.getPoolBalanceBlxmBSC();
            let balanceUsdcBSC = await this.getPoolBalanceUSDBSC();
            let balanceBlxmETH = await this.getPoolBalanceBlxmETH();
            let balanceUsdcETH = await this.getPoolBalanceUSDETH();

            let adjustmentValue = TransformationService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);

            // is liqudity avaible ? 
            if(arbitrage_balance_blxm_bsc > 0) {
                return await this._bridgeAndSwapETH(adjustmentValue, arbitrage_balance_blxm_bsc);
            }

            // provide liqudity in bsc
            // swap and bridge usd
            else {
                let arbitrage_balance_usd_bsc = await this.getArbitrageBalanceUSDBSC();
                let arbitrage_balance_usd_eth = await this.getArbitrageBalanceUSDETH();
    
                if(arbitrage_balance_usd_bsc > 0) {
                    // cheap network    
                    // swap in bsc usd to blxm

                    let usd_amount = pool_price_bsc * adjustmentValue;
                    let usdSwapAmount = 0;

                    if(usd_amount <= balanceUsdcBSC) {
                        usdSwapAmount = usd_amount;
                    }

                    else {
                        usdSwapAmount = balanceUsdcBSC;
                    }

                    await this._swapStablesToToken_BSC(usdSwapAmount);
                }
    
                else if(arbitrage_balance_usd_eth > 0) {
                    // expensive network 
                    // bridge usdc to bsc
    
                    // swap in bsc usd to blxm
                    let usd_amount = pool_price_eth * adjustmentValue;
                    let usdSwapAmount = 0;

                    if(usd_amount <= balanceUsdcETH) {
                        usdSwapAmount = usd_amount;
                    }

                    else {
                        usdSwapAmount = balanceUsdcETH;
                    }

                    await this._swapStablesToToken_ETH(usdSwapAmount);
                }
    
                arbitrage_balance_blxm_bsc = await this.getArbitrageBalanceBlxmBSC();
    
                return await this._bridgeAndSwapETH(adjustmentValue, arbitrage_balance_blxm_bsc);
            }
        }
    }

    async _bridgeAndSwapETH(amount, abitrageBalance) {
        // bridge

        let swapAmount = 0;

        if(amount <= abitrageBalance) {
            swapAmount = amount;
        }

        else {
            swapAmount = abitrageBalance;
        }

        return await this._swapTokenToStables_ETH(swapAmount);
    }

    async _bridgeAndSwapBSC(amount, abitrageBalance) {
        // bridge

        let swapAmount = 0;

        if(amount <= abitrageBalance) {
            swapAmount = amount;
        }

        else {
            swapAmount = abitrageBalance;
        }

        return await this._swapTokenToStables_BSC(swapAmount);
    }

    async getPoolBalanceBlxmBSC() {
        return await this.contract_blxm_token_bsc.balanceOf(constants.POOL_ADDRESS_BSC);
    }
    async getPoolBalanceUSDBSC() {
        return await this.contract_usd_token_bsc.balanceOf(constants.POOL_ADDRESS_BSC);
    }
    async getPoolBalanceBlxmETH() {
        return await this.contract_blxm_token_eth.balanceOf(constants.POOL_ADDRESS_ETH);
    }
    async getPoolBalanceUSDETH() {
        return await this.contract_usd_token_eth.balanceOf(constants.POOL_ADDRESS_ETH);
    }

    async getArbitrageBalanceBlxmETH() {
        return await this.contract_blxm_token_eth.balanceOf(constants.ARBITRAGE_WALLET_ADRESS);
    }

    async getArbitrageBalanceBlxmBSC() {
        return await this.contract_blxm_token_bsc.balanceOf(constants.ARBITRAGE_WALLET_ADRESS);
    }

    async getArbitrageBalanceUSDETH() {
        return await this.contract_usd_token_eth.balanceOf(constants.ARBITRAGE_WALLET_ADRESS);
    }

    async getArbitrageBalanceUSDBSC() {
        return await this.contract_usd_token_bsc.balanceOf(constants.ARBITRAGE_WALLET_ADRESS);
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


    async getPoolPriceBSC() {
        let balanceWeiBlXM = await this.getPoolBalanceBlxmBSC();
        let balanceWeiUSD = await this.getPoolBalanceUSDBSC();

        return ethers.utils.formatEther(balanceWeiUSD) / ethers.utils.formatEther(balanceWeiBlXM);
    }

    async getPoolPriceETH() {
        let balanceWeiBlXM = await this.getPoolBalanceBlxmETH();
        let balanceWeiUSD = await this.getPoolBalanceUSDETH();

        return ethers.utils.formatEther(balanceWeiUSD) / ethers.utils.formatEther(balanceWeiBlXM);
    }
}


module.exports = ArbitrageService;
