// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();
// const { spawn } = require('child_process');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_development_key"; // Put this in your .env later!

// // --- Middleware ---
// app.use(cors()); // Enable CORS
// app.use(express.json()); // Body parser

// // Logger to see requests
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });

// // --- Database Connection ---
// mongoose
//   .connect(process.env.MONGO_URI) // Removed deprecated options (useNewUrlParser/useUnifiedTopology are default in new Mongoose)
//   .then(() => console.log("MongoDB connected successfully."))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // --- Mongoose User Schema (Replaces data.json) ---
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // In production, you should hash this!
//   age: { type: Number },
//   score: { type: Number, default: 0 },
//   // Memory Game Specific Stats
//   memoryright: { type: Number, default: 0 },
//   memorywrong: { type: Number, default: 0 },
//   memorytime: { type: Number, default: 0 },
// });

// const User = mongoose.model("User", userSchema);

// // 2. GameSession Schema (For ML Data Storage)
// // This stores the raw event logs separate from the user profile
// const gameSessionSchema = new mongoose.Schema({
//   username: { type: String, required: true }, // Links to the user
//   gameType: { type: String, default: "memory_game" },
//   level: { type: Number }, // <--- NEW: Stores 1, 2, or 3
//   difficulty: { type: String }, // <--- NEW: Stores 'easy', 'medium', 'hard', or 'standard'
//   inhibitoryFailures: { type: Number, default: 0 },
//   playedAt: { type: Date, default: Date.now },
//   score: Number,
//   duration: Number,
//   events: [], // <--- This stores the big array of click events for ML
// });

// const GameSession = mongoose.model("GameSession", gameSessionSchema);

// // --- Global State for "Session" (Matches your old logic) ---
// // Note: Ideally use tokens (JWT) for this, but keeping it simple as requested.
// // let username_logged = "TestKid";

// // --- Helper Middleware ---
// function isAuthenticated(req, res, next) {
//   const authHeader = req.headers.authorization;
  
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     const token = authHeader.split(" ")[1]; // Extract the token
    
//     jwt.verify(token, JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
//       }
//       req.user = decoded; // Attach the decoded user data (like username) to the request!
//       next();
//     });
//   } else {
//     res.status(401).json({ success: false, message: "Unauthorized: Please login first." });
//   }
// }

// // --- API Routes ---

// // 1. Test Route
// app.get("/", (req, res) => {
//   res.json({ message: "Memory Game Backend Running!" });
// });

// // 2. Register
// app.post("/api/register", async (req, res) => {
//   const { username, password, age } = req.body;

//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Username Already Exists" });
//     }

//     const newUser = new User({ username, password, age });
//     await newUser.save();

//     res.json({ success: true, message: "User Registered Successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// // 3. Login
// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
    
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid Username" });
//     }
//     if (user.password !== password) {
//       return res.status(401).json({ success: false, message: "Invalid Password" });
//     }

//     const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '24h' });
//     // username_logged = username; // Set global session
//     res.json({ success: true, message: "Authentication Successful!", token: token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// // 4. Logout
// // With JWT, logout is handled by the frontend deleting the token.
// // We keep this route just to send a friendly confirmation back to React.
// app.post("/logout", (req, res) => {
//   res.json({ success: true, message: "Logged out successfully!" });
// });

// // 5. Get Profile
// app.get("/profile", isAuthenticated, async (req, res) => {
//   try {
//    const user = await User.findOne({ username: req.user.username });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     res.json({
//       message: "Why fit in when you were born to stand out!",
//       username: user.username,
//       age: user.age,
//       score: user.score,
//       memoryright: user.memoryright,
//       memorywrong: user.memorywrong,
//       memorytime: user.memorytime,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// // 6. Save Memory Game Data (The route your frontend calls)
// // We changed the route to /api/memorygame to match the vite config fix
// // 6. Save Memory Game Data (Updated for ML)
// app.post("/api/memorygame", isAuthenticated, async (req, res) => {
//   // Extract events from the request
//   const { rightMatches, wrongMatches, timetaken, events, level, difficulty, inhibitoryFailures } = req.body;

//   try {
//     // A. Update User Profile (Summary Stats)
//     const user = await User.findOneAndUpdate(
//       { username: req.user.username },
//       {
//         $inc: { 
//           memoryright: rightMatches,
//           memorywrong: wrongMatches,
//           memorytime: timetaken,
//           score: rightMatches * 10 // Give them 10 points per right match!
//         }
//       },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).send({ error: "User not found" });
//     }

//     // B. Save Raw Game Session (Detailed Logs for ML)
//     if (events && events.length > 0) {
//         const newSession = new GameSession({
//             username: req.user.username,
//             gameType: `memory_game_level_${level || 'unknown'}`,
//             level: level,            // <--- NEW
//             difficulty: difficulty,
//             inhibitoryFailures: inhibitoryFailures,
//             score: rightMatches, // Assuming score is based on matches
//             duration: timetaken,
//             events: events // <--- The crucial array for your ADHD analysis
//         });
//         await newSession.save();
//         console.log(`Detailed session saved for ${req.user.username} with ${events.length} events.`);
//    // --- NEW: TRIGGER PYTHON SCRIPT ---
        
//         // spawn('python', ['filename', 'argument'])
//         // Note: Use 'python3' instead of 'python' if you are on Mac/Linux
//         const pythonProcess = spawn('python', ['../adhd_ml_project/predict.py', req.user.username]);

//         let reportData = "";

//         // Collect data from script output
//         pythonProcess.stdout.on('data', (data) => {
//             reportData += data.toString();
//         });

//         // Handle errors
//         pythonProcess.stderr.on('data', (data) => {
//             console.error(`Python Error: ${data}`);
//         });

//         // When script finishes, send response to React
//         pythonProcess.on('close', (code) => {
//             console.log(`Analysis complete with code ${code}`);
            
//             // Send back the score AND the Python report
//             res.status(200).send({ 
//                 score: user.score, 
//                 report: reportData 
//             }); 
//         });
//       }else {
//         // Fallback if no events (shouldn't happen in real game)
//         res.status(200).send({ score: user.score, report: "No events to analyze." }); 
//     }

//     console.log(`User profile updated for ${req.user.username}`);
//     // res.status(200).send({ score: user.score }); 
//   } catch (err) {
//     console.error("Error saving game data:", err);
//     res.status(500).send({ error: "Internal server error" });
//   }
// });

// // --- Start Server ---
// app.listen(PORT, () => {
//   console.log(`Backend server running on http://localhost:${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { spawn } = require('child_process');
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_development_key"; // Put this in your .env later!

// --- Middleware ---
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser

// Logger to see requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Mongoose Schemas ---
// 1. User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, you should hash this!
  age: { type: Number },
  score: { type: Number, default: 0 },
  childName: { type: String },   // <-- NEW
  role: { type: String },        // <-- NEW
  parentName: { type: String },  // <-- NEW
  parentPhone: { type: String }, // <-- NEW
  // Memory Game Specific Stats
  memoryright: { type: Number, default: 0 },
  memorywrong: { type: Number, default: 0 },
  memorytime: { type: Number, default: 0 },
  mlReports: [{
        date: { type: Date, default: Date.now },
        reportText: String,
        level: Number
    }]
});

const User = mongoose.model("User", userSchema);

// 2. GameSession Schema (For ML Data Storage)
const gameSessionSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Links to the user
  gameType: { type: String, default: "memory_game" },
  level: { type: Number }, // Stores 1, 2, or 3
  difficulty: { type: String }, // Stores 'easy', 'medium', 'hard', or 'standard'
  inhibitoryFailures: { type: Number, default: 0 },
  playedAt: { type: Date, default: Date.now },
  score: Number,
  duration: Number,
  events: [], // Stores the big array of click events for ML
  mlReport: { type: String }
});

// 3. Trial Data Schema (Flexible for NOGO/Fish game)
const trialSchema = new mongoose.Schema({}, { strict: false });
const Trial = mongoose.model("Trial", trialSchema, "trial_by_trial_performance");

// 4. Session Summary Schema (Flexible for NOGO/Fish game)
const sessionSummarySchema = new mongoose.Schema({}, { strict: false });
const SessionSummary = mongoose.model("SessionSummary", sessionSummarySchema, "session_performance");

const GameSession = mongoose.model("GameSession", gameSessionSchema);

// 5. Puzzle Data Schema
const puzzleDataSchema = new mongoose.Schema({
  username: { type: String, required: true },
  childId: { type: String },
  date: { type: Date, default: Date.now },
  level: { type: String },
  pieces: { type: Number, required: true },
  time: { type: String, required: true },
  timeTaken: { type: Number, required: true },
  tries: { type: Number, default: 0 },
  mouseSpeed: { type: Number, default: 0 },
  path: { type: Number, default: 0 },
  rating: { type: String, default: 'Excellent' },
  gameType: { type: String, default: 'puzzle_game' },
  mousePath: [
    {
      x: Number,
      y: Number,
      timestamp: Number
    }
  ]
});
const PuzzleData = mongoose.model("PuzzleData", puzzleDataSchema, "puzzle_data");

const formatTimeString = (seconds) => {
  if (seconds == null || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const getPuzzleRating = (timeSeconds, tries) => {
  if (tries <= 1 && timeSeconds <= 15) return 'Excellent';
  if (tries <= 3 && timeSeconds <= 30) return 'Good';
  if (tries <= 5) return 'Average';
  return 'Needs Practice';
};

const computeMouseMetrics = (mousePath = []) => {
  if (!Array.isArray(mousePath) || mousePath.length < 2) {
    return {
      avgSpeed: 0,
      totalPathLength: 0
    };
  }

  let totalPathLength = 0;
  const speeds = [];

  for (let i = 1; i < mousePath.length; i++) {
    const prev = mousePath[i - 1];
    const curr = mousePath[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dt = curr.timestamp - prev.timestamp;
    const distance = Math.sqrt(dx * dx + dy * dy);
    totalPathLength += distance;
    if (dt > 0) {
      speeds.push(distance / dt);
    }
  }

  const avgSpeed = speeds.length > 0
    ? speeds.reduce((a, b) => a + b, 0) / speeds.length
    : 0;

  return {
    avgSpeed: avgSpeed * 1000,
    totalPathLength
  };
};

// --- Helper Middleware ---
// --- Helper Middleware ---
function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // 1. Log exactly what the frontend sent
  console.log("🛡️ Auth Header Received:", authHeader); 

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; 
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        // 2. Log exactly WHY the token failed
        console.error("❌ JWT Verification Failed:", err.message); 
        return res.status(401).json({ success: false, message: `Token error: ${err.message}` });
      }
      req.user = decoded; 
      next();
    });
  } else {
    console.log("❌ No valid Bearer token found in header.");
    res.status(401).json({ success: false, message: "Unauthorized: Please login first." });
  }
}

// --- API Routes ---

// 1. Test Route
app.get("/", (req, res) => {
  res.json({ message: "Memory Game Backend Running!" });
});

// 2. Register
app.post("/api/register", async (req, res) => {
  // Grab the exact fields the React frontend sends
  const { email, password, childAge, childName, role, parentName, parentPhone } = req.body;
  
  // Map email to username to keep your Python scripts and older games happy
  const username = email; 

  try {
    if (!username) return res.status(400).json({ success: false, message: "Email is required" });

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email Already Exists" });
    }

    const newUser = new User({ 
      username, 
      password, 
      age: childAge, 
      childName, 
      role, 
      parentName, 
      parentPhone 
    });
    
    await newUser.save();
    res.json({ success: true, message: "User Registered Successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 3. Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const username = email; // Map frontend email to backend username

  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email Address" });
    }
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    // React expects the token inside a 'data' object
    res.json({ 
      success: true, 
      message: "Authentication Successful!", 
      data: { 
        token: token,
        username: user.username,
        role: user.role
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 4. Logout
app.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully!" });
});

// 5. Get Profile
app.get("/profile", isAuthenticated, async (req, res) => {
  try {
   const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      message: "Why fit in when you were born to stand out!",
      username: user.username,
      age: user.age,
      score: user.score,
      memoryright: user.memoryright,
      memorywrong: user.memorywrong,
      memorytime: user.memorytime,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// 6. Save Jigsaw Puzzle Data to puzzle_data
app.post("/api/games/save", isAuthenticated, async (req, res) => {
  const { childId, difficulty, pieces, timeCompleted, tryAgainCount, mouseData, rating } = req.body;

  if (!difficulty || pieces == null || timeCompleted == null) {
    return res.status(400).json({
      success: false,
      message: 'difficulty, pieces, and timeCompleted are required'
    });
  }

  try {
    const mousePath = Array.isArray(mouseData?.mousePath) ? mouseData.mousePath : [];
    const mouseMetrics = computeMouseMetrics(mousePath);
    const saved = await PuzzleData.create({
      username: req.user.username,
      childId,
      level: difficulty,
      pieces,
      time: formatTimeString(timeCompleted),
      timeTaken: timeCompleted,
      tries: tryAgainCount ?? 0,
      mouseSpeed: Math.round(mouseMetrics.avgSpeed),
      path: Math.round(mouseMetrics.totalPathLength),
      rating: rating || getPuzzleRating(timeCompleted, tryAgainCount ?? 0),
      gameType: 'puzzle_game',
      mousePath
    });

    console.log(`✅ puzzle_data saved for ${req.user.username} with id ${saved._id}`);

    res.status(201).json({
      success: true,
      message: 'Puzzle game data saved successfully',
      insertedId: saved._id,
      data: saved
    });
  } catch (err) {
    console.error('❌ Error saving puzzle game data:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save puzzle game data',
      error: err.message
    });
  }
});

// 7. Save Memory Game Data & Trigger ML
app.post("/api/memorygame", isAuthenticated, async (req, res) => {
  const { rightMatches, wrongMatches, timetaken, events, level, difficulty, inhibitoryFailures } = req.body;

  try {
    // A. Update User Profile (Summary Stats)
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      {
        $inc: { 
          memoryright: rightMatches,
          memorywrong: wrongMatches,
          memorytime: timetaken,
          score: rightMatches * 10 // Give them 10 points per right match!
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // B. Save Raw Game Session (Detailed Logs for ML)
    if (events && events.length > 0) {
        const newSession = new GameSession({
            username: req.user.username,
            gameType: `memory_game_level_${level || 'unknown'}`,
            level: level,            
            difficulty: difficulty,
            inhibitoryFailures: inhibitoryFailures,
            score: rightMatches,
            duration: timetaken,
            events: events 
        });
        await newSession.save();
        console.log(`Detailed session saved for ${req.user.username} with ${events.length} events.`);
        
        // --- TRIGGER PYTHON SCRIPT ---
        const pythonProcess = spawn('python', ['../adhd_ml_project/predict.py', req.user.username]);

        let reportData = "";

        // Collect data from script output
        pythonProcess.stdout.on('data', (data) => {
            reportData += data.toString();
        });

        // Handle errors
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        // When script finishes, send response to React
        pythonProcess.on('close', async (code) => {
            console.log(`Analysis complete with code ${code}`);
            if (code === 0 && reportData) {
                try {
                    // 1. Attach the report to the specific Game Session we just created
                    await GameSession.findByIdAndUpdate(newSession._id, { 
                        mlReport: reportData 
                    });

                    // 2. Add the report to the User's permanent profile history
                    await User.findOneAndUpdate(
                        { username: req.user.username },
                        { 
                            $push: { 
                                mlReports: { 
                                    reportText: reportData, 
                                    level: level 
                                } 
                            } 
                        }
                    );
                    console.log(`✅ ML Report saved to database for ${req.user.username}`);
                } catch (dbError) {
                    console.error("❌ Error saving ML report to database:", dbError);
                }
            }
            res.status(200).send({ 
                score: user.score, 
                report: reportData 
            }); 
        });
      } else {
        // Fallback if no events
        res.status(200).send({ score: user.score, report: "No events to analyze." }); 
    }

    console.log(`User profile updated for ${req.user.username}`);
  } catch (err) {
    console.error("Error saving game data:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Insert a single trial
app.post("/api/trials", async (req, res) => {
  try {
    const trial = new Trial(req.body);
    const result = await trial.save();
    console.log("Trial inserted with ID:", result._id);
    res.json({ success: true, insertedId: result._id });
  } catch (err) {
    console.error("Error inserting trial:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Insert session summary
app.post("/api/gameplay_summaries", async (req, res) => {
  try {
    const summary = new SessionSummary(req.body);
    const result = await summary.save();
    console.log("Summary inserted with ID:", result._id);
    res.json({ success: true, insertedId: result._id });
  } catch (err) {
    console.error("Error inserting summary:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Server Startup & Process Management ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🔑 Auth endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/register`);
  console.log(`   POST http://localhost:${PORT}/api/login`);
  console.log(`   GET  http://localhost:${PORT}/profile`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('❌ Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});