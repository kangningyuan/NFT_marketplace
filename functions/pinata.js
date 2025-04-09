// functions/pinata.js
const Busboy = require('busboy');
const axios = require('axios');
const FormData = require('form-data');

exports.handler = (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    return callback(null, {
      statusCode: 405,
      body: 'Method Not Allowed'
    });
  }
  
  // 初始化 Busboy，用于解析 multipart/form-data
  const busboy = new Busboy({ headers: event.headers });
  let fields = {};
  let fileBuffer = null;
  let fileName = 'uploadFile'; // 默认文件名
  
  // 收集普通字段
  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });
  
  // 收集文件数据
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    fileName = filename;
    const chunks = [];
    file.on('data', (data) => {
      chunks.push(data);
    });
    file.on('end', () => {
      fileBuffer = Buffer.concat(chunks);
    });
  });
  
  // 完成解析后调用 Pinata 上传接口
  busboy.on('finish', async () => {
    try {
      // 构造要提交给 Pinata 的 FormData
      const data = new FormData();
      data.append('file', fileBuffer, { filename: fileName });
      
      // 可选：将商品相关信息作为 metadata 上传，便于在 Pinata 后台查看管理
      const pinataMetadata = {
        name: fields.productName || 'Unnamed Product',
        keyvalues: {
          brand: fields.productBrand || '',
          model: fields.productModel || '',
          serial: fields.productSerial || '',
          description: fields.productDesc || ''
        }
      };
      data.append('pinataMetadata', JSON.stringify(pinataMetadata));
      
      // 调用 Pinata 的 pinFileToIPFS 接口上传文件
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data,
        {
          maxContentLength: Infinity,
          headers: {
            ...data.getHeaders(),
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
          }
        }
      );
      
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ success: true, ipfsHash: res.data.IpfsHash })
      });
    } catch (error) {
      console.error('Pinata upload error:', error);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: error.message })
      });
    }
  });
  
  // 注意：如果 event.body 是 base64 编码，需要转换为二进制数据
  busboy.end(event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body);
};
