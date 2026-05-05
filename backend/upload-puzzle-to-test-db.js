#!/usr/bin/env node

/**
 * Direct MongoDB Upload Script for Puzzle Data
 * Connects to test database and uploads puzzle game data
 * Usage: node upload-puzzle-to-test-db.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://gameadmin:0SUWKobwyF69Vbim@cluster0.yzm6vxn.mongodb.net/test?appName=Cluster0';

// Define schema
const puzzleGameDataSchema = new mongoose.Schema({
  username: { type: String },
  date: { type: Date, default: Date.now },
  level: { type: String },
  pieces: { type: Number },
  time: { type: String },
  timeTaken: { type: Number },
  tries: { type: Number },
  mouseSpeed: { type: Number },
  path: { type: Number },
  rating: { type: String },
  gameType: { type: String, default: "puzzle_game" },
});

const PuzzleGameData = mongoose.model("PuzzleGameData", puzzleGameDataSchema, "puzzle_data");

// Sample puzzle game data from your game history image
const puzzleGameDataArray = [
  {
    username: 'test_user',
    date: new Date('2026-05-03T13:45:00Z'),
    level: 'Easy',
    pieces: 4,
    time: '00:09',
    timeTaken: 9,
    tries: 0,
    mouseSpeed: 698,
    path: 4798,
    rating: 'Excellent',
    gameType: 'puzzle_game'
  },
  {
    username: 'test_user',
    date: new Date('2026-05-03T13:46:00Z'),
    level: 'Medium',
    pieces: 9,
    time: '00:17',
    timeTaken: 17,
    tries: 1,
    mouseSpeed: 502,
    path: 5870,
    rating: 'Excellent',
    gameType: 'puzzle_game'
  }
];

async function uploadPuzzleData() {
  try {
    console.log('🔗 Connecting to MongoDB test database...');
    console.log(`📍 URI: ${MONGO_URI}`);
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB!');
    
    console.log('\n📤 Uploading puzzle game data to test database...');
    
    // Clear existing data (optional)
    // const deleteResult = await PuzzleGameData.deleteMany({});
    // console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing records`);
    
    const results = await PuzzleGameData.insertMany(puzzleGameDataArray);
    
    console.log(`\n✅ Successfully uploaded ${results.length} puzzle game records!`);
    console.log('\n📊 Uploaded Records:');
    results.forEach((record, index) => {
      console.log(`\n  Record ${index + 1}:`);
      console.log(`    ID: ${record._id}`);
      console.log(`    User: ${record.username}`);
      console.log(`    Level: ${record.level}`);
      console.log(`    Date: ${record.date}`);
      console.log(`    Score: ${record.pieces} pieces in ${record.time}`);
      console.log(`    Rating: ${record.rating}`);
    });
    
    // Fetch and display all records
    console.log('\n\n📋 Fetching all puzzle_data records from test database...');
    const allRecords = await PuzzleGameData.find({}).sort({ date: -1 });
    
    console.log(`\n📊 Total records in puzzle_data collection: ${allRecords.length}`);
    console.table(allRecords.map(r => ({
      ID: r._id.toString().slice(-8),
      User: r.username,
      Date: r.date.toLocaleString(),
      Level: r.level,
      Pieces: r.pieces,
      Time: r.time,
      Tries: r.tries,
      Speed: r.mouseSpeed,
      Path: r.path,
      Rating: r.rating
    })));
    
    // Get statistics
    console.log('\n\n📈 Statistics by Level:');
    const stats = await PuzzleGameData.aggregate([
      {
        $group: {
          _id: '$level',
          totalGames: { $sum: 1 },
          avgPieces: { $avg: '$pieces' },
          avgTime: { $avg: '$timeTaken' },
          avgTries: { $avg: '$tries' },
          avgMouseSpeed: { $avg: '$mouseSpeed' },
          avgPath: { $avg: '$path' },
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    console.table(stats);
    
    console.log('\n✨ Upload completed successfully!');
    console.log('📍 Database: test');
    console.log('📁 Collection: puzzle_data');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the upload
uploadPuzzleData();
