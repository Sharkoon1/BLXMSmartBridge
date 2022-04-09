Running the BLXM Smartbridge
===========================================



### 1. Create .env file at /src
---------------------------
An .env file is needed otherwise the application won’t start. The .env file is placed in /src (in the backend). The logic and structure of the .env file is described in the following:

```
PRIVATE_KEY_BSC=<PrivateKeyForBSCAdress>
PRIVATE_KEY_ETH=<PrivateKeyForETHAdress>
PRIVATE_KEY_BRIDGE=<BridgePrivateKey>
MONGODB_URL=<DatabaseURL>
TOKEN_SECRET=<JWTTokenSecret>
JSON_RPC_API_KEY=<JSONRPCKeyMainnet>
JSON_RPC_API_KEY_TESTNET=<JSONRPCKeyTestnet>
NODE_ENV=production
```
When NODE_ENV=production is set the Smartbridge operates in BSC/ETH mainnet. 

### 2. Installing and Importing
------------------------

Install npm dependencies:

```bash
cd src
npm install

cd frontend
npm install
```

### 3. Start the api and frontend locally
---------------------------

Two different processes

**Backend:** 

```bash
cd src
npm run dev

App is running ...
Press CTRL + C to stop the process.
```

**Frontend:** 
```bash 
cd frontend
npm run dev

Compiled successfully!

You can now view frontend in the browser.        

  Local:            http://localhost:3000        
  On Your Network:  http://172.24.192.1:3000 
```

License
-------

MIT License.
