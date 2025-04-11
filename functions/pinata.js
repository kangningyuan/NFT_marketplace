// functions/pinata.js
const Busboy = require('busboy');
const axios = require('axios');
const FormData = require('form-data');

exports.handler = async (event) => { // 改用 async 函数
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: event.headers });
    let fields = {};
    let fileBuffer = null;
    let fileName = 'uploadFile';

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filename) => {
      fileName = filename;
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => (fileBuffer = Buffer.concat(chunks)));
    });

    busboy.on('finish', async () => {
      try {
        if (!fileBuffer) {
          throw new Error("未上传文件");
        }

        const data = new FormData();
        data.append('file', fileBuffer, { filename: fileName });

        const pinataMetadata = {
          name: fields.productName || 'Unnamed Product',
          keyvalues: { ...fields }
        };
        data.append('pinataMetadata', JSON.stringify(pinataMetadata));

        const res = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          data,
          {
            headers: {
              ...data.getHeaders(),
              pinata_api_key: process.env.PINATA_API_KEY,
              pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
            }
          }
        );

        resolve({
          statusCode: 200,
          body: JSON.stringify({ ipfsHash: res.data.IpfsHash })
        });
      } catch (error) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: error.message })
        });
      }
    });

    busboy.end(event.isBase64Encoded ? 
      Buffer.from(event.body, 'base64') : event.body
    );
  });
};