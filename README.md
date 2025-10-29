# ZecureFunds

ZecureFunds is a privacy-preserving crowdfunding smart contract powered by Fully Homomorphic Encryption (FHE) through the Zama FHEVM framework.
It enables users to launch and support fundraising campaigns without exposing how much anyone contributes, ensuring complete confidentiality and trust throughout the process.

### 📜 Smart Contract Overview

License: BSD-3-Clause-Clear

Solidity Version: ^0.8.27

Encryption Engine: Zama FHEVM

Token Used: ERC7984 (Confidential Token Standard)

### 🌐 Deployment Information
```

Contract Name:	ZecureFunds
Network: Sepolia	
Contract Address: 0xd55aa3C34a6327686489E221f6C0C8D37fbb382E
```
### ⚙️ Main Features
- Launch a Campaign

  - Users can easily create new fundraising campaigns by specifying: The funding goal, Start and end times.

```
function createCampaign(uint256 _goal, uint256 _startAt, uint256 _endAt)
```
- Make a Confidential Pledge

  - Contributors can pledge privately using encrypted amounts.
The pledged value is computed on-chain but never publicly revealed, maintaining donor privacy.
```
function pledge(uint256 _id, externalEuint64 encryptedAmount, bytes calldata proof)
```


- Reveal Pledged Total

  - Campaign creators can request to decrypt and view the total amount pledged once the campaign has ended or verification is needed.
```
function decryptPledged(uint256 _id)
```

The decryption result is handled by:
```
function resolveZecureFundsCallback(uint256 requestId, bytes memory cleartexts, bytes memory decryptionProof)
```

- Claim Raised Funds

  - If the campaign reaches its funding goal, the creator can securely claim the pledged funds.
```
function claim(uint256 _id)
```


### 🔒 Privacy & Security

ZecureFunds integrates Zama’s FHEVM technology to provide:

- Full encryption of financial data such as pledges and balances.
- Secure computation on encrypted values (no exposure on-chain).
- Controlled decryption requests for transparency only when required.
- Confidential token transfers through ERC7984Token.

### 📊 Data Structure
Campaign Struct
```
struct Campaign {
    address creator;
    uint256 goal;
    euint64 pledged;          // Encrypted pledged total
    uint64 revealedPledged;   // Decrypted pledged total (for verification)
    uint256 startAt;
    uint256 endAt;
    bool claimed;
}
```

### 🧠 How It Works

- The campaign creator starts a confidential crowdfunding campaign.
- Contributors privately pledge funds using encrypted transactions.
- The contract securely tracks the total amount pledged.
- After the campaign, the creator can decrypt and verify total pledges.



## 🌍 Connect With Us

🐙 **GitHub Org:** [ZecureFunds Repository](https://github.com/ZecureFunds)  

Team Member 1

Discord Username: ojombo

Email: ojombolo1@gmail.com



Team Member 2

Discord Username: ediekkhan

Email:  eddychristantus@gmail.com


