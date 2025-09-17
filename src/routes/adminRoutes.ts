// src/routes/adminRoutes.ts
import { Router } from "express";
import path from 'path';
import { User } from '../entity/User';
import { getRepository } from 'typeorm';

const router = Router();

// Admin login page
router.get('/admin', (req, res) => {
    // Serve the admin login page
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

// Handle login request (POST)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username in the database
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { username } });

        // If the user is not found
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        // Direct password comparison (no hashing)
        if (user.password === password) {
            // Passwords match, proceed with login
            (req.session as any).loggedIn = true;
            (req.session as any).username = username;
            return res.status(200).send('Login successful');
        } else {
            // Password does not match
            return res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send('Internal server error');
    }
});

// Protect the dashboard route
router.get('/dashboard', (req, res) => {
    if (!(req.session as any).loggedIn) {
        return res.redirect('/admin');  // If not logged in, redirect to login page
    }
    
    // If logged in, serve the dashboard
    res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
    });
  
    // Logout and destroy session
    router.get('/logout', (req, res) => {
        req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out');
        }
        res.clearCookie('connect.sid');  // Clear the session cookie
        res.redirect('/admin');
    });
});

// Get entries webpage
router.get('/entries', (req, res) => {
    if (!(req.session as any).loggedIn) {
        return res.redirect('/admin');  // If not logged in, redirect to login page
    }
    
    res.sendFile(path.join(__dirname, '../public', 'entries.html'))
});

export default router;