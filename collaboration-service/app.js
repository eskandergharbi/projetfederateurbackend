const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const app = express();
const upload = multer();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { authenticateToken, authorizeRole } = require('./middlewares/authMiddleware');

const server = http.createServer(app); // Create the HTTP server FIRST
const io = new Server(server, {         // Then create the Socket.IO server, using the HTTP server
    cors: {
        origin: "http://localhost:1000", // Angular port
        methods: ["GET", "POST"]
    }
});

app.use(cors()); // Use CORS for Express routes as well
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("message", (data) => {
        io.emit("message", data); 
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Express routes
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

// Google Drive upload route
const KEYFILEPATH = path.join(__dirname, "apiKeys.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

app.post("/upload", authenticateToken, upload.any(), async (req, res) => {
    try {
        const { files } = req;

        for (let f = 0; f < files.length; f += 1) {
            await uploadFile(files[f]);
        }

        res.status(200).send("Form Submitted");
    } catch (f) {
        res.status(500).send(f.message); // Send a 500 status code on error
    }
});

const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: fileObject.originalname,
            parents: ["1z6qcUWsPuN7CN3HHtaV0vxtPevFFTnJK"], // Replace with your folder ID
        },
        fields: "id,name",
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
};

// Start the server ONCE, using the HTTP server that both Express and Socket.IO are using
const port = process.env.PORT || 5050; // Use a single port variable
server.listen(port, () => {
    console.log(`Server running on port ${port}`); // Use the same port variable here
});