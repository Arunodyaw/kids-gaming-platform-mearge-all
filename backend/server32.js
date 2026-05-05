const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
// const e = require('cors'); // <-- REMOVED (unused variable)

const app = express();

app.use(cors()); // This is fine to keep
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');
var username_logged = ""; // WARNING: See note below code

// A simple middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (username_logged !== "") {
        next(); // User is logged in, continue
    } else {
        // User is not logged in
        res.status(401).json({ success: false, message: "Unauthorized: No user is logged in." });
    }
}

app.get('/', (req, res) => {
    res.json({ message: "New Explorer!" });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error("Error reading data file:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        const userData = JSON.parse(data);

        if (!userData[username]) {
            return res.status(401).json({ success: false, message: "Invalid Username" });
        }

        if (userData[username].password !== password) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }

        username_logged = username; // User is now logged in
        res.json({ success: true, message: "Authentication Successful!" });
    });
});


app.post('/register', (req, res) => {
    const { username, password, age } = req.body;

    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error("Error reading data file:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        let userData = {};
        try {
            userData = JSON.parse(data);
        } catch (error) {
            console.error("Error parsing JSON data:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        if (userData[username]) {
            return res.status(400).json({ success: false, message: "Username Already Exists" });
        }

        userData[username] = { password, age, score:0 };

        fs.writeFile(dataFilePath, JSON.stringify(userData, null, 2), (err) => {
            if (err) {
                console.error("Error writing data to file:", err);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            res.json({ success: true, message: "User Registered Successfully!" });
        });
    });
});

app.get('/logout', isAuthenticated, (req, res) => {
    // This route is now protected by isAuthenticated
    // It will only run if username_logged is not empty
    res.json({success: true,  message: "Still Logged In."})
});

app.post('/logout', (req, res) => {
    // This route should log the user out
    username_logged = '';
    res.json({ success: true, message: "Logout Successful!" });
});

app.get('/profile', isAuthenticated, (req, res) => {
    // ADDED: isAuthenticated middleware
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error("Error reading data file:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        const userData = JSON.parse(data);
        const user = userData[username_logged];

        if (!user) {
            // This case should be rare now but good to keep
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { age, score, hanoimoves, hanoitime, eightqueen, numberpuzzlemoves, numberpuzzletime, memoryright, memorywrong, memorytime} = user;
        res.json({ message: "Why fit in when you were born to stand out!", username: username_logged, age: age, score:score, 
                                                                                hanoimoves:hanoimoves, hanoitime:hanoitime, eightqueen:eightqueen,
                                                                                numberpuzzlemoves:numberpuzzlemoves, numberpuzzletime:numberpuzzletime,
                                                                                memoryright:memoryright, memorywrong:memorywrong, memorytime:memorytime});
    });
});

app.post('/profile', isAuthenticated, (req, res) => {
    // ADDED: isAuthenticated middleware
    const { totalPoints } = req.body;

    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error("Error reading data file:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        let userData = {};
        try {
            userData = JSON.parse(data);
        } catch (error) {
            console.error("Error parsing JSON data:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        if (userData[username_logged]) {
            userData[username_logged].score = totalPoints;
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        fs.writeFile(dataFilePath, JSON.stringify(userData, null, 2), (err) => {
            if (err) {
                console.error("Error writing data to file:", err);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            res.json({ success: true, message: "User score updated successfully" });
        });
    });
});



app.post('/api/memorygame', isAuthenticated, (req, res) => {
    // ADDED: isAuthenticated middleware
    const { rightMatches, wrongMatches, timetaken } = req.body;
    const username = username_logged; 
    
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        let users = JSON.parse(data);
        if (users[username]) {
            users[username].memoryright = rightMatches;
            users[username].memorywrong = wrongMatches;
            users[username].memorytime = timetaken;
        } else {
             // This else block should technically not be reachable due to isAuthenticated
            return res.status(404).send({ error: 'User not found' });
        }
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send({ error: 'Internal server error' });
            }
            res.status(200).send({ score: users[username].score });
        });
    });
});

app.post('/numberpuzzle', isAuthenticated, (req, res) => {
    // ADDED: isAuthenticated middleware
    const { moves, timeTaken } = req.body;
    const username = username_logged; 
    
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        let users = JSON.parse(data);
        if (users[username]) {
            users[username].numberpuzzlemoves = moves; // <-- FIXED: was 'score'
            users[username].numberpuzzletime = timeTaken;
        } else {
            return res.status(404).send({ error: 'User not found' });
        }
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send({ error: 'Internal server error' });
            }
            res.status(200).send({ score: users[username].score });
        });
    });
});

app.post('/hanoi', isAuthenticated, (req, res) => {
    // ADDED: isAuthenticated middleware
    const { moves, timeTaken } = req.body;
    const username = username_logged; 
    
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        let users = JSON.parse(data);
        if (users[username]) {
            users[username].hanoimoves = moves;
            users[username].hanoitime = timeTaken;
        } else {
            return res.status(404).send({ error: 'User not found' });
        }
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send({ error: 'Internal server error' });
            }
            res.status(200).send({ score: users[username].score });
        });
    });
});

app.post('/EightQueen', isAuthenticated, (req, res) => {
    // ADDED: isAuthenticated middleware
    const { queensPlaced } = req.body;
    const username = username_logged; 
    
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }
        let users = JSON.parse(data);
        if (users[username]) {
            users[username].eightqueen = queensPlaced;
        } else {
            return res.status(404).send({ error: 'User not found' });
        }
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send({ error: 'Internal server error' });
            }
            res.status(200).send({ score: users[username].score });
        });
    });
});


app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});