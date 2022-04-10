Running the BLXM Smartbridge
===========================================



### 1. Create .env file at /src
---------------------------
An .env file is needed otherwise the application won’t start. The .env file is placed in /src (in the backend). The logic and structure of the .env file is described in the following:

```
PRIVATE_KEY_BSC=<PrivateKeyForBSCAdress>
PRIVATE_KEY_ETH=<PrivateKeyForETHAdress>
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

### 4. Create .env file for production mode at /frontend
---------------------------
An .env file is needed in the frontend to set the production api url, otherwise it will be set to http://localhost:8080/ by default for development mode:

```
REACT_APP_API_URL=http://<API_URL>/
```

### 5. Frontend Production Build 
---------------------------
Run the following commands at /frontend:

```
npm run build
```

To Serve the production build run at /frontend: 

```
serve -s build

... 

Serving!           

   │                                                   │
   │   - Local:            http://localhost:3000       │
   │   - On Your Network:  http://192.168.2.100:3000   │
   │                                                   │
   │   Copied local address to clipboard!              │
                                                  
```

### 6. Backend Production Build 
---------------------------
Run the following commands at /src to create a docker image:

```
docker build -t production .
```

To run the docker image as a container the exposed 

```
docker run -p 8080:8080 production
... 

App is running ...

Press CTRL + C to stop the process.                                               
```

To map the containers port to a host port use the -p command, so the container is accessible from outside the container. (https://docs.docker.com/engine/reference/commandline/run/) 

License
-------

MIT License.
