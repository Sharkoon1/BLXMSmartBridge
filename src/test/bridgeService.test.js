require("dotenv").config();
const BridgeService = require("../service/BridgeService");
const constants = require("../constants");

let expect = require("chai").expect;

describe('IntegrationTests_Bridge_swaps', () => {
    beforeEach(() => {
        this.bridgeService = new BridgeService();

        this.provider_eth = new ethers.providers.StaticJsonRpcProvider(constants.PROVIDER_ETH);
        this.provider_bsc = new ethers.providers.StaticJsonRpcProvider(constants.PROVIDER_BSC);
        this.erc20_abi = require(__path.join(__dirname, "../abi/erc20_abi.json"));

        this.wallet_one = new ethers.Wallet(process.env.PRIVATE_KEY, provider_eth);
        this.wallet_one = new ethers.Wallet(process.env.PRIVATE_KEY, provider_bsc);

        this.wallet_two = new ethers.Wallet(process.env.PRIVATE_KEY_BRIDGE, provider_eth);
        this.wallet_two = new ethers.Wallet(process.env.PRIVATE_KEY_BRIDGE, provider_bsc);

        this.wallet_one_preBalance = 0;
        this.wallet_two_preBalance = 0;

        walletOneContract.balanceOf(constants.ARBITRAGE_WALLET_ADDRESS).then((balance) => {
            this.wallet_one_preBalance = balance;
        });

        walletTwoContract.balanceOf(constants.BRIDGE_WALLET_ADDRESS).then((balance) => {
            this.wallet_two_preBalance = balance;
        });
    });

    it('Should swap blxm from eth to bsc', () => {
        let swapAmount = 5;

        this.bridgeService.swapBLXMTokenEthToBsc(swapAmount);

        var walletOneContract = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, this.erc20_abi,  this.wallet_one);
        var walletTwoContract = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, this.erc20_abi,  this.wallet_two);

        walletOneContract.balanceOf(constants.ARBITRAGE_WALLET_ADDRESS).then( (balance) => {
            expect(balance).to.equal(this.wallet_one_preBalance - swapAmount);
        });

        walletTwoContract.balanceOf(constants.BRIDGE_WALLET_ADDRESS).then( (balance) => {
            expect(balance).to.equal(this.wallet_one_preBalance + swapAmount)
        });
    });  

    it('Should swap usd from bsc to eth', () => {
        let swapAmount = 5;

        this.bridgeService.swapBLXMTokenBscToEth(swapAmount);

        var walletOneContract = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, this.erc20_abi,  this.wallet_one);
        var walletTwoContract = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, this.erc20_abi,  this.wallet_two);

        walletOneContract.balanceOf(constants.ARBITRAGE_WALLET_ADDRESS).then( (balance) => {
            expect(balance).to.equal(this.wallet_one_preBalance - swapAmount);
        });

        walletTwoContract.balanceOf(constants.BRIDGE_WALLET_ADDRESS).then( (balance) => {
            expect(balance).to.equal(this.wallet_one_preBalance + swapAmount)
        });
    });  
})