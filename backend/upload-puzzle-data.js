#!/usr/bin/env node

/**
 * Script to upload puzzle game data to MongoDB
 * Usage: node upload-puzzle-data.js
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

// Sample puzzle game data from the image
const puzzleGameData = [
  {
    username: 'test_user',
    level: 'Easy',
    pieces: 4,
    time: '00:09',
    timeTaken: 9,
    tries: 0,
    mouseSpeed: 698,
    path: 4798,
    rating: 'Excellent',
    date: new Date('2026-05-03T13:45:00Z')
  },
  {
    username: 'test_user',
    level: 'Medium',
    pieces: 9,
    time: '00:17',
    timeTaken: 17,
    tries: 1,
    mouseSpeed: 502,
    path: 5870,
    rating: 'Excellent',
    date: new Date('2026-05-03T13:46:00Z')
  }
];

async function uploadPuzzleData() {
  try {
    console.log('📤 Uploading puzzle game data to MongoDB...');
    
    const response = await fetch(`${BASE_URL}/api/puzzle-data/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameDataArray: puzzleGameData
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Puzzle game data uploaded successfully!');
      console.log(`📊 Uploaded ${result.count} records`);
      console.log('🆔 Inserted IDs:', result.insertedIds);
    } else {
      console.error('❌ Upload failed:', result.error);
    }
  } catch (err) {
    console.error('❌ Error uploading data:', err.message);
  }
}

// Get puzzle game history
async function getPuzzleHistory() {
  try {
    console.log('\n📋 Fetching puzzle game history...');
    
    const response = await fetch(`${BASE_URL}/api/puzzle-data/history?username=test_user`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Puzzle history retrieved!');
      console.log(`📊 Total records: ${result.count}`);
      console.table(result.history);
    } else {
      console.error('❌ Failed to retrieve history:', result.error);
    }
  } catch (err) {
    console.error('❌ Error retrieving history:', err.message);
  }
}

// Get statistics
async function getStatistics() {
  try {
    console.log('\n📈 Fetching puzzle game statistics...');
    
    const response = await fetch(`${BASE_URL}/api/puzzle-data/stats?username=test_user`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Statistics retrieved!');
      console.table(result.stats);
    } else {
      console.error('❌ Failed to retrieve stats:', result.error);
    }
  } catch (err) {
    console.error('❌ Error retrieving stats:', err.message);
  }
}

// Main execution
(async () => {
  await uploadPuzzleData();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a second
  await getPuzzleHistory();
  await getStatistics();
})();
