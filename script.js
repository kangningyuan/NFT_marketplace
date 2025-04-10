// 全局变量定义
let walletAddress = null;
let provider, signer;
let marketplaceContract;

// 请替换以下合约 ABI 与地址为实际部署后的值
const contractABI = [
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
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
	}
];
// 合约地址
const contractAddress = "0x23c95a489511C0Cfd33DB6Ab80271Cd953f9bEdB";

// DOM 元素获取
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

// 登录逻辑
loginBtn.addEventListener('click', async () => {
  if (window.ethereum) {
    try {
      // 请求钱包连接
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      walletAddress = accounts[0];
      walletAddressSpan.textContent = `👛 ${walletAddress}`;
      walletAddressSpan.classList.remove('hidden');
      logoutBtn.classList.remove('hidden');
      loginBtn.classList.add('hidden');
      loginNotice.classList.add('hidden');

      // 初始化 ethers.js 相关对象与合约实例
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      marketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);

      // 显示已登录后页面区域
      Object.values(sections).forEach(sec => sec.classList.remove('hidden'));

      // 重置动画效果
      document.querySelectorAll('.animated').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });

      // 加载链上数据（此处使用模拟数据，实际需调用合约 getter 方法）
      loadMarketItems();
      loadUserItems(walletAddress);
      loadUserPurchases(walletAddress);
      loadUserSales(walletAddress);
    } catch (err) {
      console.error("连接钱包失败：", err);
      alert("钱包连接失败，请检查控制台信息");
    }
  } else {
    alert("请安装 Metamask 扩展插件！");
  }
});

// 退出操作，重置前端状态（注意：Metamask 无法主动断开连接）
logoutBtn.addEventListener('click', () => {
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
});

// 以下为模拟数据加载函数
async function loadMarketItems() {
  const container = document.getElementById('marketList');
  // 示例调用：实际请调用合约接口查询所有上架商品
  // 这里以模拟数据为例
  const products = [
    // 示例数据格式
    // { tokenId: 1, name: "二手相机", ipfsHash: "QmXXXX", brand: "Canon", model: "X100", price: ethers.utils.parseEther("0.05") }
  ];

  if (products.length > 0) {
    container.innerHTML = products.map(item => {
      return `
      <div class="product-card">
        <h3>${item.name}</h3>
        <img src="https://ipfs.io/ipfs/${item.ipfsHash}" alt="${item.name}" />
        <p>品牌：${item.brand}</p>
        <p>型号：${item.model}</p>
        <p>价格：${ethers.utils.formatEther(item.price)} ETH</p>
        <button onclick="buyProduct(${item.tokenId}, '${item.price}')">购买</button>
      </div>
      `;
    }).join('');
  } else {
    container.innerHTML = `<p class="centered">暂无商品上架。</p>`;
  }
}

async function loadUserItems(address) {
  const container = document.getElementById('myItemsList');
  // 示例调用：实际请调用合约接口查询用户拥有的商品
  const items = []; // 模拟空数据
  container.innerHTML = items.length > 0
    ? items.map(item => `<div class="product-card"><h3>${item.name}</h3></div>`).join('')
    : `<p class="centered">您暂时没有拥有的商品。</p>`;
}

async function loadUserPurchases(address) {
  const container = document.getElementById('myPurchasesList');
  // 示例调用：实际请调用合约或后端接口获取购买记录
  const records = []; // 模拟空数据
  container.innerHTML = records.length > 0
    ? records.map(tx => `<div>购买：${tx.item}，时间：${tx.date}</div>`).join('')
    : `<p class="centered">暂无购买记录。</p>`;
}

async function loadUserSales(address) {
  const container = document.getElementById('mySalesList');
  // 示例调用：实际请调用合约或后端接口获取出售记录
  const records = []; // 模拟空数据
  container.innerHTML = records.length > 0
    ? records.map(tx => `<div>出售：${tx.item}，时间：${tx.date}</div>`).join('')
    : `<p class="centered">暂无出售记录。</p>`;
}

// 处理商品上传并上链
const uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const productName = document.getElementById('productName').value;
  const productImageInput = document.getElementById('productImage');
  const productBrand = document.getElementById('productBrand').value || "";
  const productModel = document.getElementById('productModel').value || "";
  const productSerial = document.getElementById('productSerial').value || "";
  const productDesc = document.getElementById('productDesc').value || "";

  if (productImageInput.files.length === 0) {
    alert("请选择商品图片！");
    return;
  }
  const file = productImageInput.files[0];

  // 上传图片到 Pinata 或其他 IPFS 服务（此处仅为示例，实际应调用你部署的云函数）
  const formData = new FormData();
  formData.append('file', file);
  formData.append('productName', productName);
  formData.append('productBrand', productBrand);
  formData.append('productModel', productModel);
  formData.append('productSerial', productSerial);
  formData.append('productDesc', productDesc);

  try {
    const response = await fetch('/.netlify/functions/pinata', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      // 调用合约方法 mintProduct 上链商品信息
      await mintProductOnChain(data.ipfsHash);
    } else {
      alert("上传失败：" + data.error);
    }
  } catch (err) {
    console.error("上传错误：", err);
    alert("上传出现异常！");
  }
});

// 调用合约 mintProduct 方法上链商品信息
async function mintProductOnChain(ipfsHash) {
  try {
    const tx = await marketplaceContract.mintProduct(
      document.getElementById('productName').value,
      ipfsHash, // IPFS 地址
      document.getElementById('productBrand').value || "",
      document.getElementById('productModel').value || "",
      document.getElementById('productSerial').value || "",
      document.getElementById('productDesc').value || ""
    );
    await tx.wait();
    alert("商品上链成功！交易哈希：" + tx.hash);
    // 上链成功后刷新数据
    loadMarketItems();
    loadUserItems(walletAddress);
  } catch (err) {
    console.error("上链错误：", err);
    alert("商品上链失败，请检查控制台信息");
  }
}

// 示例购买函数，注意 price 参数为字符串形式的 wei 数值
async function buyProduct(tokenId, price) {
  try {
    const tx = await marketplaceContract.buyProduct(tokenId, { value: price });
    await tx.wait();
    alert("购买成功，交易哈希：" + tx.hash);
    // 刷新数据更新页面
    loadMarketItems();
    loadUserItems(walletAddress);
    loadUserPurchases(walletAddress);
    loadUserSales(walletAddress);
  } catch (err) {
    console.error("购买失败：", err);
    alert("购买失败，请检查控制台信息");
  }
}
