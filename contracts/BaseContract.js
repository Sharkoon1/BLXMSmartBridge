const { ethers } = require("ethers");

class BaseContract {
    constructor(contractAddress, abi, signer) {
        this._contractAddress = contractAddress;
        this._abi = abi;
        this._signer = signer;

        this._contract = new ethers.Contract(contractAddress, abi, signer);

        if (!this._contract.deployed) {
			throw ("Contract pool has not been deployed or does not exist!");
		}
    }

    WeiToEther(bigNumber) {
        return ethers.utils.formatEther(bigNumber);
    }

    DecimalToWei (amount) {
        return ethers.utils.parseEther(String(amount));
    }
}

module.exports = BaseContract;
