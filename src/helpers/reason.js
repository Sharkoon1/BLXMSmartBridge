const { ethers } = require("ethers");

async function reason(hash, provider) {
    const tx = await provider.getTransaction(hash);
    try {
      let code = await provider.call(tx, tx.blockNumber);
    } catch (err) {
      const code = err.data.replace("Reverted ","");
      console.log({err});
      let reason = ethers.utils.toUtf8String("0x" + code.substr(138));
      console.log("revert reason:", reason);
    }
}


module.exports = { reason };