// src/routes/apiRoutes.ts
import { Router } from 'express';
import { getFormById, submitForm } from '../controllers/formController';
import { getRepository } from 'typeorm';
import { FormEntry } from '../entity/FormEntry';
import { FormTypes } from '../entity/FormTypes';
import { TypedEntries } from '../entity/TypedEntries';

const router = Router();

// Serve form data (JSON) based on formId
router.get("/api/form/:formId", getFormById);

// POST route for form submission
router.post("/api/form/:formId/submit", submitForm);

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
});

// GET route to retrieve a specific entry by ID
router.get('/api/entries/:id', async (req, res) => {
    const entryID = Number(req.params.id); 
    try {
        const formEntryRepo = getRepository(FormEntry);
        const entry = await formEntryRepo.findOne({ where: { id: entryID } });

        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        res.json(entry);
    } catch (error) {
        console.error("Error fetching entry: ", error);
        res.status(500).json({ message: "Error fetching entry." });
    }
});

router.get("/api/formDeclarations", async (req, res) => {
    try {
        const formTypesRepo = getRepository(FormTypes);
        const formTypes = await formTypesRepo.find({
            select: ["id", "formType", "formPosition", "formName"], 
        });
        res.json(formTypes);
    } catch (error) {
        console.log('Error fetching form declarations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/api/typed-entry', async (req, res) => {
    try {
        const { formType } = req.body;

        const typedEntryRepo = getRepository(TypedEntries);
        
        // Find entries with matching typeId
        const matchingEntries = await typedEntryRepo.find({
            where: { typeId: formType }
        });
        
        // Initialize highest uniqueId
        let highestUniqueId = 0;
        
        // If matching entries exist, find the highest uniqueId
        if (matchingEntries.length > 0) {
            // Sort entries by uniqueId in descending order and get the highest
            matchingEntries.sort((a, b) => b.uniqueId - a.uniqueId);
            highestUniqueId = matchingEntries[0].uniqueId;
        }
        
        // Create new entry
        const newEntry = new TypedEntries();
        newEntry.typeId = formType;
        newEntry.uniqueId = highestUniqueId + 1;
        newEntry.data = {};
        newEntry.formComplete = false;

        const savedEntry = await typedEntryRepo.save(newEntry);
    
        
        res.status(200).json({ 
            success: true, 
            highestUniqueId: newEntry.uniqueId
        });
    } catch (error) {
        console.log(error);
    }
})

export default router;