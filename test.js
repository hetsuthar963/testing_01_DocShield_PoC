

// For Identity



// const projectId = 'dotted-lens-407303';
// const location = 'us'; // Format is 'us' or 'eu'
// const processorId = '6681e05b97d129d4'; // Create processor in Cloud Console
// //const humanReviewConfig = 'projects/YOUR_PROJECT_ID/locations/YOUR_LOCATION/humanReviewConfigs/YOUR_HUMAN_REVIEW_CONFIG_ID'; // Replace with your Human Review Config name
// const filePath = '../test-f-img.jpg'; // Update this to the correct path

// const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

// // Instantiates a client
// const client = new DocumentProcessorServiceClient();

// async function quickstart() {
//   try {
//     // The full resource name of the processor, e.g.:
//     // projects/project-id/locations/location/processor/processor-id
//     // You must create new processors in the Cloud Console first
//     const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

//     // Read the file into memory.
//     const fs = require('fs').promises;
//     const imageFile = await fs.readFile(filePath);

//     // Convert the image data to a Buffer and base64 encode it.
//     const encodedImage = Buffer.from(imageFile).toString('base64');

//     const request = {
//       name,
//       rawDocument: {
//         content: encodedImage,
//         mimeType: 'image/jpeg', // Ensure this matches the file type
//       },
//     };

//     //console.log('Request payload:', request);

//     // Recognizes text entities in the PDF document
//     const [result] = await client.processDocument(request);
//     console.log('Response from Document AI:', result);

//     const { document } = result;

//     // Extract identity information
//     const identityInfo = extractIdentityInfo(document);

//     // Output the identity information in JSON format
//     console.log('Identity Information:', JSON.stringify(identityInfo, null, 2));
//   } catch (error) {
//     console.error('Error processing document:', error);
//   }
// }

// function extractIdentityInfo(document) {
//   const identityInfo = {
//     entities: []
//   };

//   document.entities.forEach(entity => {
//     const entityInfo = {
//       type: entity.type,
//       text: '',
//       confidence: entity.confidence || 0, // Default to 0 if confidence is not provided
//       normalizedValue: entity.normalizedValue ? entity.normalizedValue.text : null
//     };

//     if (entity.textAnchor && entity.textAnchor.textSegments && entity.textAnchor.textSegments.length > 0) {
//       entityInfo.text = entity.textAnchor.textSegments.map(segment => segment.text).join(' ');
//     }

//     identityInfo.entities.push(entityInfo);
//   });

//   return identityInfo;
// }

// quickstart();






const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

// Configuration details
const projectId = 'dotted-lens-407303';
const location = 'us'; // Format is 'us' or 'eu'
const processorId = '6681e05b97d129d4';
const filePath = '../image.png'; // Update to the correct file path

// Instantiates a client
const client = new DocumentProcessorServiceClient();

async function quickstart() {
  try {
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

    // Read the file into memory
    const fs = require('fs').promises;
    const imageFile = await fs.readFile(filePath);

    // Convert the image data to a Buffer and base64 encode it
    const encodedImage = Buffer.from(imageFile).toString('base64');

    // Define the request payload
    const request = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType: 'image/png', // Ensure this matches the file type
      },
    };

    console.log('Sending document for processing...');
    // Send the document for processing
    const [result] = await client.processDocument(request);

    // Debug full processor response
    console.log('Full Processor Response:', JSON.stringify(result, null, 2));

    if (!result || !result.document) {
      console.error('No document found in the response.');
      return;
    }

    const { document } = result;

    // Extract identity information with confidence scores
    const identityInfo = extractIdentityInfo(document);

    // Log the structured output
    console.log('Extracted Identity Information:', JSON.stringify(identityInfo, null, 2));

    // Check for entities with zero confidence
    const zeroConfidenceEntities = identityInfo.entities.filter(
      (entity) => entity.confidence === 0
    );
    if (zeroConfidenceEntities.length > 0) {
      console.warn(
        `Entities with zero confidence: ${JSON.stringify(zeroConfidenceEntities, null, 2)}`
      );
    }
  } catch (error) {
    console.error('Error processing document:', error.message || error);
  }
}

// Extract identity information from the Document object
function extractIdentityInfo(document) {
  const identityInfo = {
    entities: [],
  };

  if (!document.entities || document.entities.length === 0) {
    console.warn('No entities found in the document.');
    return identityInfo;
  }

  document.entities.forEach((entity) => {
    const entityInfo = {
      type: entity.type,
      text: '',
      confidence: entity.confidence || 0, // Default to 0 if confidence is missing
      normalizedValue: entity.normalizedValue ? entity.normalizedValue.text : 'UNKNOWN',
    };

    if (entity.textAnchor && entity.textAnchor.textSegments) {
      entityInfo.text = entity.textAnchor.textSegments
        .map((segment) => segment.text || '')
        .join(' ')
        .trim();
    }

    // Log entity extraction for debugging
    console.log('Extracted Entity:', JSON.stringify(entityInfo, null, 2));

    identityInfo.entities.push(entityInfo);
  });

  return identityInfo;
}

// Run the main function
quickstart();