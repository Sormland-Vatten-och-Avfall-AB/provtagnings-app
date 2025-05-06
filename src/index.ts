import "reflect-metadata";
import express from "express";
import session from "express-session";
import { createConnection } from "typeorm";
import { ormConfig } from "./ormconfig";
import path from "path";
import { submitForm } from "./controllers/formController";
import formRoutes from "./routes/formRoutes";
import adminRoutes from "./routes/adminRoutes";
import qrRoutes from "./routes/qrRoutes";
import apiRoutes from "./routes/apiRoutes";

const app = express();

declare module 'express-session' {
  interface SessionData {
    loggedIn?: boolean;
    username?: string;
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`Requested URL: ${req.url}`);
  next();
});

// Session management
app.use(
  session({
    secret: 'your-secret-key',  // Replace this with a stronger secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,   // Ensures the cookie cannot be accessed via JavaScript
      secure: false,    // Set to true in production (ensure HTTPS is used)
      maxAge: 24 * 60 * 60 * 1000, // Session expires in 1 day
    },
  })
);

// Middleware to parse incoming JSON data (needed for form submission)
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Load routes
app.use("/", formRoutes, adminRoutes, apiRoutes, qrRoutes);

// Handle form submission (if needed as a separate route)
app.post('/submit-form', submitForm);

// Create a connection to the database and start the server
createConnection(ormConfig)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => console.error("Database connection error:", error));
