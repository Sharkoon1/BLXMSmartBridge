import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import TxListPending from "./TxListPending";
import UrlHandler from "./UrlHandler";

const startPayment = async ({ setConfirmed, setError, setTxs, ether, address }) => {
	try {
		console.log("Account " + address);
		const BLXM_TOKEN_ADDRESS_BSC = "0x6703bB029a9B2d44f8e21Ec7f635C5A0b06743Fa";
		const BLXM_TOKEN_ADDRESS_ETH = "0xb5382dfba952a41a2f2d0b7313c3578b83d32be0";
		const ArbitrageWallet = "0x626FB960A26681F7B0FD3E0c19D09fC440d2FF74";
		console.log(ArbitrageWallet);

		const genericErc20Abi = require("./abi/erc20_abi.json");

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log("Provider ");

		const networkName = await (await provider.getNetwork()).name;
		console.log(networkName);
		let tokenContractAddress;
		if (networkName === "bnbt") {
			tokenContractAddress = BLXM_TOKEN_ADDRESS_BSC;
		} else if (networkName === "rinkeby") {
			tokenContractAddress = BLXM_TOKEN_ADDRESS_ETH;
		} else {
			console.log("Network not defined!");
		}
		const contract = new ethers.Contract(tokenContractAddress, genericErc20Abi, provider.getSigner());
		console.log("Contract " + contract);
		const tx = await contract.transfer(ArbitrageWallet, ethers.utils.parseEther(ether));
		console.log({ ether, addr: address });
		console.log("tx", tx);
		setTxs([tx]);
		setConfirmed(false);
		let url = UrlHandler();
		fetch(url + "api/transfer",
			{
				method: "post",
				headers: new Headers({ "content-type": "application/json" }),
				body: JSON.stringify(tx)
			}).then(function (res) {
				setConfirmed(true);
			});

	} catch (err) {
		setError(err.message);
	}
};

export default function App() {
	const [error, setError] = useState();
	const [txs, setTxs] = useState([]);
	const [confirmed, setConfirmed] = useState();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		setError();
		await startPayment({
			setConfirmed,
			setError,
			setTxs,
			ether: data.get("ether"),
			address: data.get("addr")
		});
	};


	return (
		//Form swap BLXM Token 
		<form className="handleSumbit" onSubmit={handleSubmit}>
			<div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
				<main className="mt-4 p-4">
					<h1 className="textheading">
						Swap BLXM tokens across chains
					</h1>

					<div className="">
						<div className="my-3">
							<input
								name="ether"
								type="text"
								className="input input-bordered block w-full focus:ring focus:outline-none"
								placeholder="Amount in BLXM"
							/>
						</div>
					</div>

				</main>


				<footer className="p-4">
					<button
						id="submitSwap"
						type="submit"
						className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
					>
						Swap now
					</button>
					<ErrorMessage message={error} />
					{confirmed ? <TxList txs={txs} /> : <TxListPending txs={txs} />}
				</footer>


			</div>
		</form>
	);
}
