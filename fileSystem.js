import fs from 'fs';

// Save data to the data.json file
export default function saveData(data) {
    const dataString = JSON.stringify(data);
    fs.writeFile('data.json', dataString, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
// Load data from the data.json file
export function loadData() {
    return new Promise((resolve, reject) => {
      fs.readFile('data.json', (err, data) => {
        if (err) {
          reject(err);
        }
        if (!data || data.length === 0) {    
          resolve([]);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }