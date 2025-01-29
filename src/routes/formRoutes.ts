// src/routes/formRoutes.ts
import { Router } from 'express';
import { getFormById, submitForm } from '../controllers/formController';
import path from 'path';
import { getRepository } from 'typeorm';
import { FormEntry } from '../entity/FormEntry';

const router = Router();

// Serve the dynamicForm.html for any form route
router.get("/form/:formId", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'dynamicForm.html'));
});

// Serve form data (JSON) based on formId
router.get("/api/form/:formId", getFormById);

// POST route for form submission
router.post("/api/form/:formId/submit", submitForm);

// Get entries webpage
router.get('/entries', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'entries.html'))
});

// GET route for form* retrieval 
router.get('/api/entries', async (req, res) => {
    try {
        const formEntryRepo = getRepository(FormEntry);
        const formEntries = await formEntryRepo.find();

        res.json({ formEntries });
    } catch (error) {
        console.error("Error fetching entries: ", error);
        res.status(500).json({ message: "Error fetching entries." });
    }
})

// GET route to retrieve a specific entry by ID
router.get('/api/entries/:id', async (req, res) => {
    const entryID = Number(req.params.id);  // Get the entry ID from the URL parameter

    try {
        const formEntryRepo = getRepository(FormEntry);
        const entry = await formEntryRepo.findOne({ where: { id: entryID } });  // Use object format with 'where' clause

        // Check if the entry was found
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        res.json(entry);  // Send the entry data as JSON
    } catch (error) {
        console.error("Error fetching entry: ", error);
        res.status(500).json({ message: "Error fetching entry." });
    }
});

// QR code handling
router.get('/qr', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'requestNewQR.html'))
})

export default router;