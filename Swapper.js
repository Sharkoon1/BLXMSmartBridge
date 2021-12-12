require("dotenv").config();
const SwapService = require("./service/SwapService");
const http = require('http'),
	fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });
const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const locateChrome = require('locate-chrome');
const getAppDataPath = require("appdata-path");

console.log("Choose service to call:\n");
console.log("Swap: Swap tokens directly.\n");
console.log("ArbitrageCycle: Start a single arbitrage cycle to equilibrate both liquidity pools. \n");
console.log("WebJob: Continuously swap tokens until equilibrium in both liquidity pools is reached.\n");

let service = prompt("Which service would you like to utilize? ");



switch (service) {
	case "Swap":
		console.log(`${service} will be executed, you will be asked to provide the following parameters:\n`);
		console.log("Network: The destination network BLXM tokens should end up in.");
		console.log("Amount: The number of BLXM tokens you would like to swap.");
		console.log("Public Address: The destination network BLXM tokens should end up in.");
		let network = prompt("Which network would you like to transfer to?");
		let amount = prompt("How many tokens would you like to transfer?");
		let PublicAddress = prompt("What is the public address on the target network you would like the tokens to be transferred to?", (PublicAddress) => { PublicAddress = PublicAddress });

		const filepath = 'file://' + __dirname + '/Transfer.html';
		(async () => {
			//const browser = await dappeteer.launch(puppeteer, { headless: false, slowMo: 100, metamaskVersion: 'latest' });
			//const metamask = await dappeteer.setupMetamask(browser);
			let chrome_path = "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
			const metamask_extension_id = "nkbihfbeogaeaoehlefnkodbefgpgknn\\10.6.4_0"
			let appDataPath = getAppDataPath().split("\\");
			appDataPath.pop();
			appDataPath = appDataPath.join("\\");
			let extensionPath = appDataPath + "\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\" + metamask_extension_id;
			const customArgs = [
				`--start-maximized`,
				`--load-extension=${extensionPath}`
			];
			chrome_path = await locateChrome();
			const browser = await puppeteer.launch({ executablePath: chrome_path, headless: false, slowMo: 100, ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"], args: customArgs });
			const page = await browser.newPage();


			await page.goto(filepath);
			//await metamask.confirmTransaction();
			await page.waitForNavigation({
				waitUntil: 'networkidle0',
			});
			await browser.close();
		})();

		break;
	case "ArbitrageCycle":
		console.log("Network: The destination network BLXM tokens should end up in.");
		break;
	case "WebJob":
		console.log("Network: The destination network BLXM tokens should end up in.");
		break;
	default:
		console.log('Please choose one of the provided services.');
}
/*
prompt.get(['public address', 'private key'], function (err, result) {
	//
	// Log the results.
	//
	console.log('Command-line input received:');
	console.log('  username: ' + result['public address']);
	console.log('  email: ' + result['private key']);
});
*/
/*
const clear = require('clear');
const figlet = require('figlet');
const CLI = require('clui');
const fs = require('fs');
const Spinner = CLI.Spinner;
const inquirer = require('inquirer');


clear();

console.log(
	chalk.yellow(
		figlet.textSync('Ginit', { horizontalLayout: 'full' })
	)
);
const status = new Spinner('Creating remote repository...');
status.start();
*/
/*
const run = async () => {
	const credentials = await () => {
	const questions = [
		{
			name: 'username',
			type: 'input',
			message: 'Enter your GitHub username or e-mail address:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter your username or e-mail address.';
				}
			}
		},
		{
			name: 'password',
			type: 'password',
			message: 'Enter your password:',
			validate: function (value) {
				if (value.length) {
					return true;
				} else {
					return 'Please enter your password.';
				}
			}
		}
	];
	return inquirer.prompt(questions);
};
console.log(credentials);
};


run();




module.exports = {
	askGithubCredentials: ,
};
*/