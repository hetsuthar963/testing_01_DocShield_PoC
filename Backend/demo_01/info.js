// // //working

// import OpenAI from 'openai';
// import { promises as fs } from 'fs';

// const openai = new OpenAI({
//   apiKey: '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',
//   baseURL: 'https://integrate.api.nvidia.com/v1',
// });

// async function main() {
//   try {
//     // Read and parse JSON files
//     const data1 = JSON.parse(await fs.readFile('./output/extracted_data.json', 'utf8'));
//     const data2 = JSON.parse(await fs.readFile('./output/extracted_info.json', 'utf8'));

//     // Format messages correctly
//     const messages = [
//       { 
//         role: "system", 
//         content: "You are an AI document fraud analysis expert. Your task is to analyze input data related to identity documents and detect potential forgery or manipulation. Evaluate the document's authenticity based on the provided structured data, identify suspicious elements, and provide a detailed report. Your output should include the following sections: 1. Authenticity Indicators, 2. Potential Fraud Indicators, 3. Suspicious Elements, 4. Suggestions for Verification (mention further steps they can take; don't explicitly tell any sentence where our platform seems at lower-end), 5. Forgery Likelihood Score (0.0 to 1.0) with an interpretation"
//       },
//       {
//         role: "user",
//         content: `Fraud Signals: ${JSON.stringify(data1)}\nDocument Text: ${JSON.stringify(data2)}`
//       }
//     ];

//     // Get completion
//     const completion = await openai.chat.completions.create({
//       model: "meta/llama-3.1-405b-instruct",
//       messages: messages,
//       temperature: 0.2,
//       top_p: 0.7,
//       max_tokens: 1024,
//       stream: false  // Disable streaming for better error visibility
//     });

//     console.log("Analysis Result:", completion.choices[0].message.content);
    
//   } catch (error) {
//     console.error("Full Error:", error);
//   }
// }

// main();




// this is working alone

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const openai = new OpenAI({
  apiKey: '',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveAnalysisReport(content) {
  const analysisDir = path.join(__dirname, 'Analysis');
  await fs.mkdir(analysisDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `analysis-report-${timestamp}.json`;
  const filePath = path.join(analysisDir, filename);
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
  console.log(`Report saved to: ${filePath}`);
}

async function main() {
  let completion;

  try {
    const data1 = JSON.parse(await fs.readFile('./output/extracted_data.json', 'utf8'));
    const data2 = JSON.parse(await fs.readFile('./output/extracted_info.json', 'utf8'));

    const messages = [
      {
        role: "system",
        content: `You are an AI document fraud analysis expert. STRICTLY follow these rules:
1. Output ONLY valid JSON without any markdown formatting
2. Never use triple backticks or code blocks
3. Maintain proper JSON syntax:
   - Double quotes for strings
   - No trailing commas
   - Valid number formats

Required JSON structure:
{
  "title": "Document Fraud Analysis Report",
  "contents": [
       {"title": "1. Authenticity Indicators", "contents": [{
             "description": "Detailed findings of indicators supporting document authenticity. Using all types of checks an expert forgery machine do."
           }]},
       {"title": "2. Potential Fraud Indicators", "contents": [{
             "description": "Identify inconsistencies such as mismatched fonts, altered text, irregularities in formatting, missing elements, or metadata discrepancies. Include evidence or data snippets to support findings. Using all types of checks an expert forgery machine do."
           }]},
       {"title": "3. Suspicious Elements", "contents": [{
             "description": "Highlight specific elements of concern, such as unusual patterns, suspicious signatures, tampered sections, or overlaid text. Provide detailed reasoning for suspicion. Using all types of checks an expert forgery machine do."
           }]},
       {"title": "4. Suggestions for Verification", "contents": [{
             "description": "Provide actionable steps for manual verification, such as cross-checking with official databases, contacting issuing authorities, or conducting expert analysis."
           }]},
       {"title": "5. Forgery Likelihood Score", "score": 0.0, "interpretation": "Provide a numerical score (0 to 1) indicating the likelihood of forgery, along with a brief explanation of the score based on observed patterns. Using all types of checks an expert forgery machine do."}
     ]
}`
      },
      {
        role: "user",
        content: `Analyze these document insights:
        ${JSON.stringify(data1, null, 2)}
        Full Text Content:
        ${JSON.stringify(data2, null, 2)}`
      }
    ];

    completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages,
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    // Validate and clean response
    if (!completion?.choices[0]?.message?.content) {
      throw new Error('Empty response from API');
    }

    const responseContent = completion.choices[0].message.content;
    const cleanedResponse = responseContent.replace(/```/g, '').trim(); // Remove backticks
    const analysisContent = JSON.parse(cleanedResponse);

    // Validate JSON structure
    if (!analysisContent.title || !analysisContent.contents) {
      throw new Error('Invalid JSON structure in response');
    }

    await saveAnalysisReport(analysisContent);
    console.log("Analysis completed successfully!");
  } catch (error) {
    console.error("Error:", error.message);

    if (error instanceof SyntaxError) {
      console.error("Invalid JSON response:");
      console.error(completion?.choices[0]?.message?.content || 'No response content');
      const errorDir = path.join(__dirname, 'Analysis');
      await fs.mkdir(errorDir, { recursive: true });
      const errorPath = path.join(errorDir, 'last-invalid-response.txt');
      if (completion?.choices[0]?.message?.content) {
        await fs.writeFile(errorPath, completion.choices[0].message.content);
        console.log(`Saved invalid response to: ${errorPath}`);
      }
    }
  }
}

export default main();
