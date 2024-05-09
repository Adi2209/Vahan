import bodyParser = require("body-parser");
import { Application } from "express";
import express = require("express");
import entityRoutes from "./routes/entityRoutes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', entityRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
