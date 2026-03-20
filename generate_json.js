import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

async function processData() {
  const csvFilePath = path.join(process.cwd(), 'data.csv');
  const outputJsonPath = path.join(process.cwd(), 'src', 'data', 'missing_persons.json');

  if (!fs.existsSync(path.dirname(outputJsonPath))) {
    fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  const processedData = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const regNo = record['Registration Number'];
    const imageUrl = record['Person Image web Link'];
    
    if (!imageUrl || !imageUrl.startsWith('http')) {
      continue;
    }

    processedData.push({
      id: regNo,
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
      personImageWebLink: `/missing_images/${regNo}.jpg`,
      originalImageLink: imageUrl,
      status: 'missing'
    });
  }

  fs.writeFileSync(outputJsonPath, JSON.stringify(processedData, null, 2));
  console.log(`Successfully processed and saved ${processedData.length} records to ${outputJsonPath}`);
}

processData().catch(console.error);
