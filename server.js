require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const authController = require("./controllers/authController");
const workspaceRoutes = require("./routes/workspaceRoutes");
const teamRoutes = require("./routes/team");
const editorRoutes = require("./routes/editor");
const { setupSocket } = require("./sockets/collaborationSocket");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_LINK,
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use("/api/auth", authController);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/editor", editorRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_LINK,
    credentials: true,
  },
});
setupSocket(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
