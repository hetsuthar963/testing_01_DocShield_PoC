// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs').promises;
// const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

// // Configuration details
// const projectId = 'dotted-lens-407303';
// const location = 'us'; // Format is 'us' or 'eu'
// const processorId = '6681e05b97d129d4';
// const imageDirectory = path.join(__dirname, 'uploaded_image'); // Correct relative path

// // Instantiates a client
// const client = new DocumentProcessorServiceClient();

// const app = express();
// const PORT = 3000;

// app.use(cors({
//   // origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both backend and frontend origins
//   // methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   // credentials: true, // Allow cookies if needed
// }));

// let extractedData = [];

// // Set up storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     fs.mkdir(imageDirectory, { recursive: true }).then(() => {
//       cb(null, imageDirectory);
//     }).catch(err => {
//       console.error('Error creating directory:', err);
//       cb(err, imageDirectory);
//     });
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// // Serve the HTML file (if needed)
// app.get('/up', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Handle file upload
// app.post('/upload', upload.single('image'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   res.send('File uploaded successfully');
//   await quickstart(); // Process the latest image after upload
// });

// // To get latest json data extracted from image
// app.get('/api/extracted-data', (req, res) => {
//   if (!extractedData || extractedData.length === 0) {
//     return res.status(204).send({ message: 'No data available' });
//   }
//   res.json({ entities: extractedData });
// });


// async function quickstart() {
//   try {
//     const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

//     // Find the latest image file in the directory
//     const latestImagePath = await getLatestImagePath(imageDirectory);
//     if (!latestImagePath) {
//       console.error('No image files found in the directory.');
//       return;
//     }

//     // Read the file into memory
//     const imageFile = await fs.readFile(latestImagePath);

//     // Convert the image data to a Buffer and base64 encode it
//     const encodedImage = Buffer.from(imageFile).toString('base64');

//     // Define the request payload
//     const request = {
//       name,
//       rawDocument: {
//         content: encodedImage,
//         mimeType: 'image/png', // Ensure this matches the file type
//       },
//     };

//     console.log('Sending document for processing...');
//     // Send the document for processing
//     const [result] = await client.processDocument(request);

//     // Debug full processor response
//     console.log('Full Processor Response:', JSON.stringify(result, null, 2));

//     if (!result || !result.document) {
//       console.error('No document found in the response.');
//       return;
//     }

//     const { document } = result;

//     // Extract identity information with confidence scores
//     extractedData = extractIdentityInfo(document).entities;

//     // Log the structured output
//     console.log('Extracted Identity Information:', JSON.stringify(identityInfo, null, 2));
//     //console.log(document.text);

//     // Check for entities with zero confidence
//     const zeroConfidenceEntities = identityInfo.entities.filter(
//       (entity) => entity.confidence === 0
//     );
//     if (zeroConfidenceEntities.length > 0) {
//       console.warn(
//         `Entities with zero confidence: ${JSON.stringify(zeroConfidenceEntities, null, 2)}`
//       );
//     }
//   } catch (error) {
//     console.error('Error processing document:', error.message || error);
//   }
// }

// // Function to get the path of the latest image file in the directory
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
//       return fileStats[index].mtimeMs > latest.mtimeMs ? { file, mtimeMs: fileStats[index].mtimeMs } : latest;
//     }, { file: null, mtimeMs: 0 });

//     return path.join(directory, latestFile.file);
//   } catch (error) {
//     console.error('Error reading directory:', error.message || error);
//     return null;
//   }
// }

// // Extract identity information from the Document object
// function extractIdentityInfo(document) {
//   const identityInfo = {
//     entities: [],
//   };

//   if (!document.entities || document.entities.length === 0) {
//     console.warn('No entities found in the document.');
//     return identityInfo;
//   }

//   document.entities.forEach((entity) => {
//     const entityInfo = {
//       type: entity.type,
//       text: '',
//       confidence: entity.confidence || 0, // Default to 0 if confidence is missing
//       normalizedValue: entity.normalizedValue ? entity.normalizedValue.text : 'UNKNOWN',
//     };

//     if (entity.textAnchor && entity.textAnchor.textSegments) {
//       entityInfo.text = entity.textAnchor.textSegments
//         .map((segment) => segment.text || '')
//         .join(' ')
//         .trim();
//     }

//     // Log entity extraction for debugging
//     console.log('Extracted Entity:', JSON.stringify(entityInfo, null, 2));

    
//     identityInfo.entities.push(entityInfo);
//   });
//   console.log(document.text);

//   return identityInfo;
// }

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
















const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
