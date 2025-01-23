// import express from 'express';
// import multer from 'multer';
// import cors from 'cors';
// import path from 'path';
// import { promises as fs } from 'fs';
// import { DocumentProcessorServiceClient } from '@google-cloud/documentai/build/src/v1/index.js';
// import OpenAI from 'openai';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';

// dotenv.config();

// // Configuration details
// const projectId = 'dotted-lens-407303';
// const location = 'us';
// const processorId = '6681e05b97d129d4';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const imageDirectory = path.join(__dirname, 'uploaded_image');
// let extractedData = [];

// // Instantiates a client
// const client = new DocumentProcessorServiceClient();

// const app = express();
// const PORT = 3000;

// app.use(cors());

// // Set up storage engine
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     try {
//       await fs.mkdir(imageDirectory, { recursive: true });
//       cb(null, imageDirectory);
//     } catch (err) {
//       console.error('Error creating directory:', err);
//       cb(err, imageDirectory);
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Serve the HTML file
// app.get('/up', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Handle file upload
// app.post('/upload', upload.single('image'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   res.send('File uploaded successfully');
//   await quickstart(req.file.mimetype); // Pass MIME type dynamically
// });

// // API to get extracted data
// app.get('/api/extracted-data', (req, res) => {
//   res.json({
//     status: 'success',
//     extractedData,
//     lastUpdated: new Date(),
//   });
// });

// app.get('/api/analysis-result', async (req, res) => {
//   try {
//     const analysisResult = await analyzeExtractedData(extractedData);
//     res.json({
//       status: 'success',
//       analysisResult,
//       lastUpdated: new Date(),
//     });
//   } catch (error) {
//     console.error('Error fetching analysis result:', error.message || error);
//     res.status(500).json({ status: 'error', message: 'Failed to fetch analysis result' });
//   }
// });

// async function quickstart(mimeType) {
//   try {
//     const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
//     const latestImagePath = await getLatestImagePath(imageDirectory);

//     if (!latestImagePath) {
//       console.error('No image files found in the directory.');
//       return;
//     }

//     const imageFile = await fs.readFile(latestImagePath);
//     const encodedImage = Buffer.from(imageFile).toString('base64');

//     const request = {
//       name,
//       rawDocument: {
//         content: encodedImage,
//         mimeType,
//       },
//     };

//     console.log('Sending document for processing...');
//     const [result] = await client.processDocument(request);

//     console.log('Full Processor Response:', JSON.stringify(result, null, 2));

//     if (!result || !result.document) {
//       console.error('No document found in the response.');
//       return;
//     }

//     const { document } = result;
//     extractedData = extractIdentityInfo(document).entities;

//     console.log('Extracted Identity Information:', JSON.stringify(extractedData, null, 2));
//   } catch (error) {
//     console.error('Error processing document:', error.message || error);
//   }
// }

// async function getLatestImagePath(directory) {
//   try {
//     const files = await fs.readdir(directory);
//     const imageFiles = files.filter(file => file.match(/\.(png|jpg|jpeg)$/i));

//     if (imageFiles.length === 0) {
//       return null;
//     }

//     const fileStats = await Promise.all(
//       imageFiles.map(file => fs.stat(path.join(directory, file)))
//     );

//     const latestFile = imageFiles.reduce((latest, file, index) => {
//       return fileStats[index].mtimeMs > latest.mtimeMs
//         ? { file, mtimeMs: fileStats[index].mtimeMs }
//         : latest;
//     }, { file: null, mtimeMs: 0 });

//     return path.join(directory, latestFile.file);
//   } catch (error) {
//     console.error('Error reading directory:', error.message || error);
//     return null;
//   }
// }

// function extractIdentityInfo(document) {
//   const identityInfo = {
//     role: "user",
//     content: `You are an AI document fraud analysis expert. Your task is to analyze input data related to identity documents and detect potential forgery or manipulation. Evaluate the document’s authenticity based on the provided structured data, identify suspicious elements, and provide a detailed report. Your output should include the following sections: 1. Authenticity Indicators, 2. Potential Fraud Indicators, 3. Suspicious Elements, 4. Suggestions for Verification, 5. Forgery Likelihood Score (0.0 to 1.0) with an interpretation.\n\nInput Data:\n${JSON.stringify(document, null, 2)}`
//   };

//   if (!document.entities || document.entities.length === 0) {
//     console.warn('No entities found in the document.');
//     return identityInfo;
//   }

//   document.entities.forEach(entity => {
//     const entityInfo = {
//       type: entity.type,
//       text: entity.textAnchor?.textSegments?.map(seg => seg.text || '').join(' ').trim() || '',
//       confidence: entity.confidence || 0,
//       normalizedValue: entity.normalizedValue?.text || 'UNKNOWN',
//     };

//     console.log('Extracted Entity:', JSON.stringify(entityInfo, null, 2));
//     identityInfo.entities.push(entityInfo);
//   });

//   return identityInfo;
// }

// async function analyzeExtractedData(data) {
//   try {
//     const openai = new OpenAI({
//       apiKey: "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",
//       baseURL: 'https://integrate.api.nvidia.com/v1',
//     });

//     const completion = await openai.chat.completions.create({
//       model: "meta/llama-3.1-405b-instruct",
//       messages: [
//         {
//           role: data.role,
//           content: `You are an AI document fraud analysis expert. Your task is to analyze input data related to identity documents and detect potential forgery or manipulation. Evaluate the document’s authenticity based on the provided structured data, identify suspicious elements, and provide a detailed report. Your output should include the following sections: 1. Authenticity Indicators, 2. Potential Fraud Indicators, 3. Suspicious Elements, 4. Suggestions for Verification (mention further steps they can take; don't explicitly tell any sentence where our platform seems at lower-end), 5. Forgery Likelihood Score (0.0 to 1.0) with an interpretation.` + data.content,
//         },
//       ],
//       temperature: 0.2,
//       top_p: 0.7,
//       max_tokens: 1024,
//       stream: true
//     });

//     let analysisResult = '';
//     for await (const chunk of completion) {
//       analysisResult += chunk.choices[0]?.delta?.content || '';
//     }

//     console.log('Final analysis result:', analysisResult);
//     return analysisResult;
//   } catch (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error('Error response:', error.response.status);
//       console.error('Error response data:', error.response.data);
//       console.error('Error response headers:', error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('Error request:', error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('Error message:', error.message);
//     }
//     console.error('Error config:', error.config);
//     return null;
//   }
// }

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });












const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
const { time } = require('console');
const fs = require('fs').promises;
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

// Configuration details
const projectId = 'dotted-lens-407303';
const location = 'us';
const processorId = '6681e05b97d129d4';
const imageDirectory = path.join(__dirname, 'uploaded_image');

// Instantiates a client
const client = new DocumentProcessorServiceClient();

const app = express();
const PORT = 3000;

app.use(cors());
let extractedData = [];

// Set up storage engine
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(imageDirectory, { recursive: true });
      cb(null, imageDirectory);
    } catch (err) {
      console.error('Error creating directory:', err);
      cb(err, imageDirectory);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Serve the HTML file
app.get('/up', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully');
  await quickstart(req.file.mimetype); // Pass MIME type dynamically
});

// API to get extracted data
app.get('/api/extracted-data', (req, res) => {
  res.json({
    status: 'success',
    extractedData,
    lastUpdated: new Date(),
  });
});

app.get('/api/analysis-result', async (req, res) => {
  res.json({
    status: 'success',
    analysisResult,
    lastUpdated: new Date(),
  })
})

async function quickstart(mimeType) {
  try {
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    const latestImagePath = await getLatestImagePath(imageDirectory);

    if (!latestImagePath) {
      console.error('No image files found in the directory.');
      return;
    }

    const imageFile = await fs.readFile(latestImagePath);
    const encodedImage = Buffer.from(imageFile).toString('base64');

    const request = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType,
      },
    };

    console.log('Sending document for processing...');
    const [result] = await client.processDocument(request);

    console.log('Full Processor Response:', JSON.stringify(result, null, 2));

    if (!result || !result.document) {
      console.error('No document found in the response.');
      return;
    }

    const { document } = result;
    extractedData = extractIdentityInfo(document).entities;

    console.log('Extracted Identity Information:', JSON.stringify(extractedData, null, 2));
  } catch (error) {
    console.error('Error processing document:', error.message || error);
  }
}

async function getLatestImagePath(directory) {
  try {
    const files = await fs.readdir(directory);
    const imageFiles = files.filter(file => file.match(/\.(png|jpg|jpeg)$/i));

    if (imageFiles.length === 0) {
      return null;
    }

    const fileStats = await Promise.all(
      imageFiles.map(file => fs.stat(path.join(directory, file)))
    );

    const latestFile = imageFiles.reduce((latest, file, index) => {
      return fileStats[index].mtimeMs > latest.mtimeMs
        ? { file, mtimeMs: fileStats[index].mtimeMs }
        : latest;
    }, { file: null, mtimeMs: 0 });

    return path.join(directory, latestFile.file);
  } catch (error) {
    console.error('Error reading directory:', error.message || error);
    return null;
  }
}

function extractIdentityInfo(document) {
  const identityInfo = { entities: [] };

  if (!document.entities || document.entities.length === 0) {
    console.warn('No entities found in the document.');
    return identityInfo;
  }

  document.entities.forEach(entity => {
    const entityInfo = {
      type: entity.type,
      text: entity.textAnchor?.textSegments?.map(seg => seg.text || '').join(' ').trim() || '',
      confidence: entity.confidence || 0,
      normalizedValue: entity.normalizedValue?.text || 'UNKNOWN',
    };

    console.log('Extracted Entity:', JSON.stringify(entityInfo, null, 2));
    identityInfo.entities.push(entityInfo);
  });

  return identityInfo;
}


// async function analysisForData(data) {
//   const openai = new OpenAI({
//     apiKey: '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',
//     baseURL: 'https://integrate.api.nvidia.com/v1',
//   })
  
//   const completion = await openai.chat.completion.create({
//     model: "meta/llama-3.1-405b-instruct",
//     messages: [
//       {
//         role: data.role,
//         content: `You are an AI document fraud analysis expert. Your task is to analyze input data related to identity documents and detect potential forgery or manipulation. Evaluate the document’s authenticity based on the provided structured data, identify suspicious elements, and provide a detailed report. Your output should include the following sections: 1. Authenticity Indicators, 2. Potential Fraud Indicators, 3. Suspicious Elements, 4. Suggestions for Verification (mention further steps they can take; don't explicitly tell any sentence where our platform seems at lower-end), 5. Forgery Likelihood Score (0.0 to 1.0) with an interpretation.` + data.content,
//       },
//     ],
//     temperature: 0.2,
//     top_p: 0.7,
//     max_tokens: 1024,
//     stream: true
//   });
// }


//   let analysisResult = '';
//   for await (const chunk of completion) {
//     if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta) {
//       analysisResult += chunk.choices[0].delta.content || '';
//       //console.log('Chunk received:', chunk.choices[0].delta.content); // Log the received chunk
//     }
//   }

//   //console.log('Final analysis result:', analysisResult); // Log the final analysis result
//   return analysisResult;



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
