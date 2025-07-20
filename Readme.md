# NFT Valuation Engine - JuliaOS Bounty Submission

This is a fully functional decentralized application (dApp) that provides AI-powered valuations for NFTs. It is built using an agent-based architecture to demonstrate the core capabilities of the JuliaOS framework.

## How This Project Uses JuliaOS

This project is designed to showcase the versatility and power of JuliaOS for building intelligent, on-chain applications.

* **Agent-Based Architecture**: The core logic is split into two distinct, simulated JuliaOS agents:
    * **Data Collection Agent**: Fetches and aggregates NFT data from multiple external sources (Alchemy and Etherscan APIs).
    * **Valuation Agent**: Processes the collected data to calculate a valuation metric.
* **Swarm Integration (Simulated)**: The `juliaos-service.ts` acts as an orchestrator, coordinating the sequential execution of the agents, demonstrating a simple data pipeline swarm.
* **On-Chain Functions**: The dApp interacts directly with a custom smart contract deployed on the Sepolia testnet. After calculating a valuation, the service sends a transaction to the `Valuation.sol` contract to store the result, creating an immutable on-chain record of the agent's work.

This project serves as a powerful example of how developers can leverage JuliaOS to build sophisticated dApps that go beyond simple transactions, integrating off-chain data and on-chain logic.

---

## How it Works

1.  A user inputs an NFT contract address and token ID via the React frontend.
2.  The request is sent to a Node.js/Express backend.
3.  The backend's **Orchestration Service** invokes the **Data Collection Agent**.
4.  The agent fetches NFT metadata from the **Alchemy API** and contract data from the **Etherscan API**.
5.  The **Orchestration Service** then passes this data to the **Valuation Agent**.
6.  The Valuation Agent calculates a valuation based on the NFT's total supply.
7.  The final valuation is sent in a transaction to the `Valuation.sol` smart contract on the Sepolia testnet.
8.  The result is returned to the frontend and displayed to the user.

---

## How to Run

### Prerequisites

* Node.js and npm
* Git
* A wallet (e.g., MetaMask) with some **Sepolia test ETH**.

### Setup

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/your-username/nft-valuation-engine.git](https://github.com/your-username/nft-valuation-engine.git)
    cd nft-valuation-engine
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:
    Create a `.env` file in **both** the `hardhat` and `backend` directories. Add the following content, filling in your own secret keys:
    ```env
    # Wallet private key for deploying and sending transactions
    PRIVATE_KEY=your_wallet_private_key

    # Infura or Alchemy key for connecting to the blockchain
    INFURA_API_KEY=your_infura_api_key
    ALCHEMY_API_KEY=your_alchemy_api_key
    ETHERSCAN_API_KEY=your_etherscan_api_key

    # This will be filled in after deployment
    DEPLOYED_CONTRACT_ADDRESS=
    ```

### Deployment

1.  **Deploy the Smart Contract**:
    ```bash
    npm run deploy
    ```
    This will deploy `Valuation.sol` to the Sepolia testnet.

2.  **Update Environment Variable**:
    * Copy the contract address from the deployment output.
    * Paste this address into the `DEPLOYED_CONTRACT_ADDRESS` variable in your `backend/.env` file.

### Running the dApp

1.  **Start the Backend** (in one terminal):
    ```bash
    npm run start
    ```

2.  **Start the Frontend** (in a second terminal):
    ```bash
    npm run start:frontend
    ```

3.  Open your browser to `http://localhost:3000`.

---

## License

This project is licensed under the MIT License.