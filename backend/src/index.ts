import bodyParser from "body-parser";
import express, { Application } from "express";
import entityRoutes from "./routes/entityRoutes"; // Import entityRoutes
import { testConnection } from "./configuration/database";
import cors from "cors";

const app: Application = express();

// Define the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json()); // Parse request bodies as JSON
app.use(cors());

// Routes
app.use('/api', entityRoutes); // Use entity routes under /api prefix
app.get('/',(req,res) =>{
  res.send('Hello World!')
});

// Test the database connection
testConnection();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
