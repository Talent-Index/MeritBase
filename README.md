# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running the Application Locally

To run the full MeritBase application on your local machine, you will need three separate terminal windows.

### 1. Start the Local Blockchain

In your first terminal, start the local Hardhat blockchain node. This will simulate a local Ethereum environment.

```bash
yarn chain
```
or
```bash
npm run chain
```

### 2. Deploy Smart Contracts

Once the blockchain is running, open a second terminal to deploy the smart contracts to your local node.

```bash
yarn deploy
```
or
```bash
npm run deploy
```

### 3. Run the Frontend Application

Finally, in a third terminal, start the Next.js development server to run the web application.

```bash
yarn dev
```
or
```bash
npm run dev
```

Your application will be available at `http://localhost:9002`.
