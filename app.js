const mongoose = require("mongoose");
const express = require("express");
const User = require("./backend/models/userModel");
const Todo = require("./backend/models/todoModel");
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'backend', 'public')));

mongoose.connect("mongodb://localhost:27017/myapp")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'backend', 'public', 'index.html'));
});

// Auth routes
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Name or email already exists." });
        }
        res.status(400).json({ message: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "24h" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Auth middleware
const auth = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Todo routes
app.post("/todos", auth, async (req, res) => {
    try {
        const { title } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const todo = new Todo({ email: user.email, userId: req.userId, title });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get("/todos", auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.userId });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put("/todos/:id", auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(todo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete("/todos/:id", auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
