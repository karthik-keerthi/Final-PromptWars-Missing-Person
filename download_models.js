import fs from 'fs';
import path from 'path';
import https from 'https';

const modelsDir = path.join(process.cwd(), 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
const files = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1'
];

const downloadFile = (filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(modelsDir, filename);
    const url = baseUrl + filename;
    console.log(`Downloading ${filename}...`);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (res2) => {
          if (res2.statusCode === 200) {
            res2.pipe(fs.createWriteStream(filepath))
               .on('error', reject)
               .once('close', () => resolve(filepath));
          } else {
            res2.resume();
            reject(new Error(`Failed to download ${filename}: ${res2.statusCode}`));
          }
        }).on('error', reject);
      } else {
        res.resume();
        reject(new Error(`Failed to download ${filename}: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

async function downloadAll() {
  for (const file of files) {
    try {
      await downloadFile(file);
    } catch (e) {
      console.error(e);
    }
  }
  console.log('Done downloading models.');
}

downloadAll();
