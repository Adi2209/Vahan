import bodyParser from "body-parser";
import express, { Application } from "express";
import entityRoutes from "./routes/entityRoutes"; // Import entityRoutes
import { testConnection } from "./configuration/database";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use cors middleware to enable CORS

// Routes
app.use('/api', entityRoutes);
app.get('/',(req,res) =>{
  res.send('Hello World!')
})
testConnection();
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
