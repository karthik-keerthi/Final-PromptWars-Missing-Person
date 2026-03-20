import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { GoogleGenAI } from '@google/genai';
import https from 'https';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

const getEmbedding = async (base64Image) => {
  try {
    const result = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
      ],
    });
    return result.embeddings[0].values;
  } catch (error) {
    console.error("Error getting embedding:", error);
    return null;
  }
};

async function processData() {
  const csvFilePath = path.join(process.cwd(), 'data.csv');
  const imagesDir = path.join(process.cwd(), 'public', 'missing_images');
  const outputJsonPath = path.join(process.cwd(), 'src', 'data', 'missing_persons.json');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  if (!fs.existsSync(path.dirname(outputJsonPath))) {
    fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  const processedData = [];

  console.log(`Processing ${records.length} records...`);

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const regNo = record['Registration Number'];
    const imageUrl = record['Person Image web Link'];
    
    console.log(`[${i+1}/${records.length}] Processing ${regNo}...`);
    
    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.log(`Skipping ${regNo} - Invalid image URL`);
      continue;
    }

    const imagePath = path.join(imagesDir, `${regNo}.jpg`);
    
    try {
      // Download image
      await downloadImage(imageUrl, imagePath);
      
      // Read image as base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      // Get embedding
      const embedding = await getEmbedding(base64Image);
      
      if (embedding) {
        processedData.push({
          registrationNumber: regNo,
          name: record['Name'],
          relation: record['Relation'],
          dateMissingFrom: record['Date Missing From'],
          lastSeen: record['Last seen'],
          mobileNumbers: record['mobile numbers'],
          age: parseInt(record['age']) || 0,
          languagesKnown: record['Languages Known'],
          district: record['District'],
          policeStationArea: record['Police Station AreaArea'],
          caseRegistered: record['Case Registered'],
          mentalHealthStatus: record['Mental Health Status'],
          personImageWebLink: `/missing_images/${regNo}.jpg`, // Local path
          originalImageLink: imageUrl,
          embedding: embedding,
          status: 'missing'
        });
      }
      
      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Failed to process ${regNo}:`, error.message);
    }
  }

  fs.writeFileSync(outputJsonPath, JSON.stringify(processedData, null, 2));
  console.log(`Successfully processed and saved ${processedData.length} records to ${outputJsonPath}`);
}

processData().catch(console.error);
