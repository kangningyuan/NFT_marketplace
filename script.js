// script.js
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.12.0/+esm";

// 全局变量定义
let walletAddress = null;
let provider, signer;
let marketplaceContract;

// 合约 ABI（关键函数部分，需要替换为完整ABI）
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ERC721EnumerableForbiddenBatchMint",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "ERC721OutOfBoundsIndex",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ProductDelisted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ProductListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ProductMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ProductSold",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "buyProduct",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "delistProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "listProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_metadataUri",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_brand",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_model",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_serial",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "mintProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productPrices",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "metadataUri",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "brand",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "model",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "serial",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// 合约地址（替换为实际部署的合约地址）
const contractAddress = "0x480e86918119E725D326D135327Ec7Dc3348Eb91";

// DOM 元素
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const walletAddressSpan = document.getElementById('walletAddress');
const loginNotice = document.getElementById('loginNotice');
const sections = {
    upload: document.getElementById('uploadSection'),
    market: document.getElementById('marketSection'),
    myItems: document.getElementById('myItemsSection'),
    myPurchases: document.getElementById('myPurchasesSection'),
    mySales: document.getElementById('mySalesSection')
};

// 初始化事件监听
document.addEventListener("DOMContentLoaded", () => {
    loginBtn.addEventListener('click', connectWallet);
    logoutBtn.addEventListener('click', handleLogout);
    document.getElementById('uploadForm').addEventListener('submit', handleUpload);
});



let isConnecting = false;

async function connectWallet() {
  if (isConnecting) return;
  isConnecting = true;
  
  if (!window.ethereum) {
    isConnecting = false;
    return alert("请安装 MetaMask!");
  }

  try {
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
    walletAddress = account;
    
    // 初始化合约相关对象
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    marketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);

    // 验证合约连通性
    await marketplaceContract.name();
    
    // 更新界面状态
    updateUI();
    
    // 加载数据和事件监听
    await loadData();
    setupEventListeners();

  } catch (error) {
    handleError("钱包连接失败", error);
    // 失败时重置状态
    walletAddress = null;
    marketplaceContract = null;
    updateUI();
  } finally {
    isConnecting = false;
  }
}

// 界面更新函数
function updateUI() {
  if (walletAddress) {
    walletAddressSpan.textContent = `👛 ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`;
    walletAddressSpan.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    loginNotice.classList.add('hidden');
    Object.values(sections).forEach(sec => sec.classList.remove('hidden'));
  } else {
    walletAddressSpan.textContent = '';
    walletAddressSpan.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    loginNotice.classList.remove('hidden');
  }
}




// // 钱包连接
// async function connectWallet() {
//     if (!window.ethereum) return alert("请安装 MetaMask!");
    
//     try {
//         const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
//         walletAddress = account;
//         updateUI();
        
//         provider = new ethers.BrowserProvider(window.ethereum);
//         signer = await provider.getSigner();
//         marketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);
        
//         await loadData();
//         setupEventListeners();
//     } catch (error) {
//         handleError("钱包连接失败", error);
//     }
// }


// // 更新界面
// function updateUI() {
//     walletAddressSpan.textContent = `👛 ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`;
//     walletAddressSpan.classList.remove('hidden');
//     logoutBtn.classList.remove('hidden');
//     loginBtn.classList.add('hidden');
//     loginNotice.classList.add('hidden');
//     Object.values(sections).forEach(sec => sec.classList.remove('hidden'));
// }





async function mintProductOnChain(ipfsHash) {
	try {
	  if (!marketplaceContract) {
		throw new Error("合约未初始化，请重新连接钱包");
	  }
  
	  // 使用明确的参数传递
	  const tx = await marketplaceContract.mintProduct(
		document.getElementById('productName').value,
		ipfsHash,
		document.getElementById('productBrand').value || "",
		document.getElementById('productModel').value || "",
		document.getElementById('productSerial').value || "",
		document.getElementById('productDesc').value || ""
	  );
  
	  const receipt = await tx.wait();
	  alert("上链成功！区块高度: " + receipt.blockNumber);
	  return receipt; // 确保返回 Promise
	} catch (err) {
	  console.error("合约调用错误:", err);
	  throw err; // 抛出错误以便外层捕获
	}
  }


// async function mintProductOnChain(ipfsHash) {
// 	try {
// 	  // 新增合约实例检查
// 	  if (!marketplaceContract) {
// 		throw new Error("合约未初始化，请重新连接钱包");
// 	  }
	  
// 	  const tx = await marketplaceContract.mintProduct(
// 		document.getElementById('productName').value,
// 		ipfsHash,
// 		document.getElementById('productBrand').value || "",
// 		document.getElementById('productModel').value || "",
// 		document.getElementById('productSerial').value || "",
// 		document.getElementById('productDesc').value || ""
// 	  );
	  
// 	  const receipt = await tx.wait();
// 	  console.log("交易详情:", receipt);
// 	  alert("上链成功！区块高度: " + receipt.blockNumber);
// 	} catch (err) {
// 	  console.error("完整错误日志:", {
// 		error: err,
// 		message: err.message,
// 		stack: err.stack
// 	  });
// 	  alert(`上链失败：${err.reason || err.message}`);
// 	}
// }




// 数据加载
async function loadData() {
    await Promise.all([
        loadMarketItems(),
        loadUserItems(),
        loadTransactionHistory()
    ]);
}

// 加载市场商品
async function loadMarketItems() {
    const container = document.getElementById('marketList');
    try {
      const total = await marketplaceContract.totalSupply();
      const items = [];
      
      for (let tokenId = 1; tokenId <= total; tokenId++) {
        const price = await marketplaceContract.productPrices(tokenId);
        if (price > 0) {
          // 获取合约中的元数据哈希
          const product = await marketplaceContract.products(tokenId);
          
          // 从 IPFS 加载元数据 JSON
          const metadataRes = await fetch(`https://ipfs.io/ipfs/${product.metadataUri}`);
          const metadata = await metadataRes.json();
          
          items.push({ 
            tokenId, 
            ...metadata,
            price 
          });
        }
      }
      
      container.innerHTML = items.map(item => `
        <div class="product-card">
          <h3>${item.name}</h3>
          <img src="https://ipfs.io/ipfs/${item.image.split('//')[1]}" />
          <p>品牌: ${item.brand || '无'}</p>
          <p>型号: ${item.model || '无'}</p>
          <p>价格: ${ethers.formatEther(item.price)} ETH</p>
          <button onclick="handleBuy(${item.tokenId}, ${item.price})">购买</button>
        </div>
      `).join('') || "<p>暂无商品</p>";
    } catch (error) {
      handleError("加载市场商品失败", error, container);
    }
}



// script.js - 加载用户商品
async function loadUserItems() {
    const container = document.getElementById('myItemsList');
    try {
      const balance = await marketplaceContract.balanceOf(walletAddress);
      const items = [];
      
      for (let i = 0; i < balance; i++) {
        const tokenId = await marketplaceContract.tokenOfOwnerByIndex(walletAddress, i);
        const product = await marketplaceContract.products(tokenId);
        const price = await marketplaceContract.productPrices(tokenId);
        
        // 从 IPFS 加载元数据 JSON
        const metadataRes = await fetch(`https://ipfs.io/ipfs/${product.metadataUri}`);
        const metadata = await metadataRes.json();
        
        items.push({ 
          tokenId, 
          ...metadata,
          price 
        });
      }
      
      container.innerHTML = items.map(item => `
        <div class="product-card">
          <h3>${item.name}</h3>
          <img src="https://ipfs.io/ipfs/${item.image.split('//')[1]}" />
          <p>品牌: ${item.brand || '无'}</p>
          <p>型号: ${item.model || '无'}</p>
          <div class="item-actions">
            ${item.price > 0 ? `
              <button onclick="handleDelist(${item.tokenId})">下架</button>
            ` : `
              <input type="number" id="price-${item.tokenId}" placeholder="价格 (ETH)" step="0.01" />
              <button onclick="handleList(${item.tokenId})">上架</button>
            `}
          </div>
        </div>
      `).join('') || "<p>暂无商品</p>";
    } catch (error) {
      handleError("加载用户商品失败", error, container);
    }
}



// // 加载用户商品
// async function loadUserItems() {
//     const container = document.getElementById('myItemsList');
//     try {
//         const balance = await marketplaceContract.balanceOf(walletAddress);
//         const items = [];
        
//         for (let i = 0; i < balance; i++) {
//             const tokenId = await marketplaceContract.tokenOfOwnerByIndex(walletAddress, i);
//             const product = await marketplaceContract.products(tokenId);
//             const price = await marketplaceContract.productPrices(tokenId);
//             items.push({ tokenId, ...product, price });
//         }
        
//         container.innerHTML = items.map(item => `
//             <div class="product-card">
//                 <h3>${item.name}</h3>
//                 <img src="https://ipfs.io/ipfs/${item.metadataUri}" />
//                 <div class="item-actions">
//                     ${item.price > 0 ? `
//                         <button onclick="handleDelist(${item.tokenId})">下架</button>
//                     ` : `
//                         <input type="number" id="price-${item.tokenId}" placeholder="价格 (ETH)" step="0.01" />
//                         <button onclick="handleList(${item.tokenId})">上架</button>
//                     `}
//                 </div>
//             </div>
//         `).join('') || "<p>暂无商品</p>";
//     } catch (error) {
//         handleError("加载用户商品失败", error, container);
//     }
// }




// 交易历史（示例）
async function loadTransactionHistory() {
    // 需要后端支持或使用 TheGraph 索引事件
}

// 商品上架
window.handleList = async (tokenId) => {
    const priceInput = document.getElementById(`price-${tokenId}`);
    const priceEth = parseFloat(priceInput.value);
    
    if (!priceEth || priceEth <= 0) return alert("无效价格");
    
    try {
        const tx = await marketplaceContract.listProduct(tokenId, ethers.parseEther(priceEth.toString()));
        await tx.wait();
        loadData();
    } catch (error) {
        handleError("上架失败", error);
    }
};

// 商品下架
window.handleDelist = async (tokenId) => {
    try {
        const tx = await marketplaceContract.delistProduct(tokenId);
        await tx.wait();
        loadData();
    } catch (error) {
        handleError("下架失败", error);
    }
};

// 商品购买
window.handleBuy = async (tokenId, priceWei) => {
    try {
        const tx = await marketplaceContract.buyProduct(tokenId, { value: priceWei });
        await tx.wait();
        alert(`购买成功！TX: ${tx.hash}`);
        loadData();
    } catch (error) {
        handleError("购买失败", error);
    }
};



// 上传物品到IPFS并上链
async function handleUpload(e) {
	e.preventDefault();
	if (!walletAddress) return alert("请先连接钱包");
  
	const form = e.target;
	const formData = new FormData(form);
	const fileInput = document.getElementById('productImage');
	const file = fileInput.files[0];
  
	try {
	  // 1. 上传图片文件到 IPFS
	  const imageFormData = new FormData();
	  imageFormData.append('productImage', file);
	  const imageRes = await fetch('/.netlify/functions/pinata', {
		method: 'POST',
		body: imageFormData,
	  });
	  const { ipfsHash: imageHash } = await imageRes.json();
  
	  // 2. 构造元数据 JSON
	  const metadata = {
		name: formData.get('productName'),
		image: `ipfs://${imageHash}`,
		brand: formData.get('productBrand') || '',
		model: formData.get('productModel') || '',
		description: formData.get('productDesc') || '',
	  };
  
	  // 3. 上传元数据 JSON 到 IPFS
	  const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
	  const jsonFormData = new FormData();
	  jsonFormData.append('productImage', jsonBlob, 'metadata.json');
	  const jsonRes = await fetch('/.netlify/functions/pinata', {
		method: 'POST',
		body: jsonFormData,
	  });
	  const { ipfsHash: metadataHash } = await jsonRes.json();
  
	  // 4. 调用合约，存入 metadataHash
	  await mintProductOnChain(metadataHash);
	  await loadData();
	  alert("商品上传成功！");
	} catch (error) {
	  console.error("全流程错误:", error);
	  alert(`上传失败: ${error.message}`);
	}
  }



// async function handleUpload(e) {
// 	e.preventDefault();
// 	if (!walletAddress) return alert("请先连接钱包");
  
// 	const formData = new FormData(e.target); // 直接使用表单的 FormData
// 	const fileInput = document.getElementById('productImage');
// 	formData.append('productImage', fileInput.files[0]); // 确保字段名与云函数一致
  
// 	try {
// 	  const uploadStatus = document.createElement('div');
// 	  uploadStatus.textContent = "开始上传图片到IPFS...";
// 	  document.body.appendChild(uploadStatus);
  
// 	  // 调用云函数
// 	  const response = await fetch('/.netlify/functions/pinata', {
// 		method: 'POST',
// 		body: formData, // 不需要手动设置 Content-Type，浏览器会自动处理
// 	  });
  
// 	  if (!response.ok) {
// 		const errorData = await response.json();
// 		throw new Error(errorData.error || '上传失败');
// 	  }
  
// 	  const { ipfsHash } = await response.json();
// 	  uploadStatus.textContent = "IPFS上传成功，开始上链...";
  
// 	  // 调用合约
// 	  await mintProductOnChain(ipfsHash);
// 	  uploadStatus.textContent = "全流程完成！";
// 	  await loadData();
// 	} catch (error) {
// 	  console.error("全流程错误:", error);
// 	  alert(`失败: ${error.message}`);
// 	}
//   }





// 事件监听
function setupEventListeners() {
    marketplaceContract.on("ProductListed", (tokenId) => loadMarketItems());
    marketplaceContract.on("ProductSold", (tokenId) => loadData());
    marketplaceContract.on("ProductDelisted", (tokenId) => loadMarketItems());
}

function handleLogout() {
    walletAddress = null;
    provider = null;
    signer = null;
    marketplaceContract = null;
    walletAddressSpan.textContent = '';
    walletAddressSpan.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    loginNotice.classList.remove('hidden');
}

function handleError(context, error, element = null) {
    console.error(`${context}:`, error);
    if (element) element.innerHTML = `<p class="error">${context}</p>`;
    alert(`${context}: ${error.message}`);
}