import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { FormEntry } from '../entity/FormEntry'; // Add other entities as needed

// Controller to fetch all entries from different tables
export const getAllEntries = async (req: Request, res: Response): Promise<Response> => {
    try {
        const formEntryRepo = getRepository(FormEntry);

        // Fetch all entries from the FormEntry table
        const formEntries = await formEntryRepo.find();

        // If you have other tables, you can do the same for each table
        // Example: const otherTableEntries = await getRepository(OtherEntity).find();

        return res.json({
            formEntries,
            // Add other table entries if needed
            // otherTableEntries,
        });
    } catch (error) {
        console.error("Error fetching entries:", error);
        return res.status(500).json({ message: "Error fetching entries" });
    }
};
