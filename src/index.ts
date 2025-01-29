import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import formRoutes from "./routes/formRoutes";
import { ormConfig } from "./ormconfig";
import path from "path";
import { submitForm } from "./controllers/formController";

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Important, all goes to shit otherwise.
app.use(express.json());

// Load routes
app.use("/", formRoutes);

app.post('/submit-form', submitForm);

// Create connection and start the server
createConnection(ormConfig)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => console.log(error));


// After setting up static files
app.use(express.static(path.join(__dirname, 'public')), (req, res, next) => {
  console.log(`Requested URL: ${req.url}`);
  next();
});