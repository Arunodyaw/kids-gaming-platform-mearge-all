const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://gameadmin:0SUWKobwyF69Vbim@cluster0.yzm6vxn.mongodb.net/?appName=Cluster0";

async function clearDB() {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully!");

        const db = mongoose.connection.db;

        // Dropping the collections that use up space
        console.log("Cleaning up database collections to free space...");

        try {
            await db.collection('gazesamples').drop();
            console.log("✅ Successfully dropped 'gazesamples' collection (This was taking up the most space).");
        } catch (e) {
            console.log("Info: 'gazesamples' collection already empty or not found.");
        }

        try {
            await db.collection('gameevents').drop();
            console.log("✅ Successfully dropped 'gameevents' collection.");
        } catch (e) {
            console.log("Info: 'gameevents' collection already empty or not found.");
        }

        try {
            await db.collection('sessions').drop();
            console.log("✅ Successfully dropped 'sessions' collection.");
        } catch (e) {
            console.log("Info: 'sessions' collection already empty or not found.");
        }

        console.log("\n🎉 Database cleared successfully! The 512MB quota has been freed.");

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

clearDB();
