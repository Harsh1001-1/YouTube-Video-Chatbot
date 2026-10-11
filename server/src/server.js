import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import axios from "axios";
import connectDB from "./config/db.js";
import Chat from "./models/Chat.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "./models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
// import { YoutubeTranscript } from "youtube-transcript";
import { Supadata } from "@supadata/js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const supadata = new Supadata({
    apiKey: process.env.SUPADATA_API_KEY,
});


const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
    res.send("Server Running");
});

app.post("/api/video/validate", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^?&]+)/
        );

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid YouTube URL",
            });
        }

        const videoId = match[1];

        //call youtube datab api
        const youtubeResponse = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet",
                    id: videoId,
                    key: process.env.YOUTUBE_API_KEY,
                },
            }
        );

        //check if video exists
        if (!youtubeResponse.data.items || youtubeResponse.data.items.length === 0) {
            return res.json({
                success: false,
                message: "Video not found",
            });
        }

        const video = youtubeResponse.data.items[0];

        return res.json({
            success: true,
            message: "Video found",
            video: {
                videoId,
                title: video.snippet.title,
                channelTitle: video.snippet.channelTitle,
                thumbnail: video.snippet.thumbnails.high.url,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

app.post("/api/video/transcript", async (req, res) => {
    try {
        const { videoId } = req.body;

        if (!videoId) {
            return res.status(400).json({
                success: false,
                message: "Video ID is required",
            });
        }

        const result = await supadata.transcript({
            url: `https://www.youtube.com/watch?v=${videoId}`,
        });

        return res.json({
            success: true,
            transcript: result.content,
        });

    } catch (error) {
        console.error("Supadata Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch transcript.",
        });
    }
});

app.post("/api/video/summary", async (req, res) => {
    try {
        const { transcript } = req.body;

        if (!transcript) {
            return res.status(400).json({
                success: false,
                message: "Transcript is required",
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
        Summarize the following YouTube transcript.
        
        Give:
        - A concise summary
        - Key points in bullet form
        
        Transcript:
        ${transcript}
        `;

        const result = await model.generateContent(prompt);

        const summary = result.response.text();

        return res.json({
            success: true,
            summary,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate summary",
        });
    }
});

app.post("/api/video/notes", async (req, res) => {
    try {

        const { transcript } = req.body;

        if (!transcript) {
            return res.status(400).json({
                success: false,
                message: "Transcript is required"
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
        Create detailed study notes from the following YouTube transcript.
        
        Format:
        #Main Concepts
        #Detailed Notes
        #Important Takeaways
        #Quick Revision Points
        
        Transcript:
        ${transcript}
        `;

        const result = await model.generateContent(prompt);
        const notes = result.response.text();
        return res.json({
            success: true,
            notes,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate notes",
        });
    }
});

app.post("/api/video/chat", authMiddleware, async (req, res) => {
    try {

        const { videoId, transcript, question } = req.body;

        if (!videoId || !transcript || !question) {
            return res.status(400).json({
                success: false,
                message: "Transcript and question are required",
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });


        const prompt = `
        You are an AI assistant.
        
        Answer ONLY using the information present in the transcript.
        
        Transcript:
        ${transcript}
        
        Question:
        ${question}
        `;

        const result = await model.generateContent(prompt);

        const answer = result.response.text();

        let chat = await Chat.findOne({
            userId: req.userId,
            videoId
        });

        if (!chat) {
            chat = new Chat({
                userId: req.userId,
                videoId,
                messages: []
            });
        }

        chat.messages.push({
            role: "user",
            text: question
        });

        chat.messages.push({
            role: "assistant",
            text: answer
        });

        await chat.save();

        return res.json({
            success: true,
            answer,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate answer",
        });
    }
});

app.get("/api/video/chat/:videoId", authMiddleware, async (req, res) => {
    try {
        const chat = await Chat.findOne({
            userId: req.userId,
            videoId: req.params.videoId
        });

        return res.json({
            success: true,
            messages: chat?.messages || []
        });
    } catch (error) {
        console.error("Chat history error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch chat history"
        });
    }
});

app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 8 characters long"
            })
        }

        const existingUser = await User.findOne({
            email,
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        const user = await User.findOne({
            email,
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

app.get("/api/dashboard/recent-chats", authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({
            userId: req.userId
        })
            .sort({ updatedAt: -1 })
            .limit(10)

        return res.json({
            success: true,
            chats
        });
    } catch (error) {
        console.error("Recent chats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent chats"
        });
    }
})

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`);
});