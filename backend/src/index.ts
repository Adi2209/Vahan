import bodyParser from "body-parser";
import express, { Application } from "express";
import entityRoutes from "./routes/entityRoutes"; // Import entityRoutes
import { testConnection } from "./configuration/database";

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

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
