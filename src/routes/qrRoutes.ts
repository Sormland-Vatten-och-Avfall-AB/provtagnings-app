// src/routes/qrRoutes.ts
import { Router } from "express";
import path from 'path';
import { TypedEntries } from "../entity/TypedEntries";
import { getRepository } from "typeorm";
import { FormTypes } from "../entity/FormTypes";

const router = Router();

router.get('/qr=:formType-:formId', async (req, res) => {
    try {
        const { formType, formId } = req.params;
        const typeId = parseInt(formType, 16);
        const uniqueId = parseInt(formId, 16);
        if (isNaN(typeId) || isNaN(uniqueId)) {
            return res.status(400).send("Ogiltigt ID.");
        }
        
        const typedEntriesRepository = getRepository(TypedEntries);
        const entry = await typedEntriesRepository.findOne({ where: { typeId, uniqueId } }); 
        if (!entry) {
            return res.status(404).send("Ogiltigt ID.");
        }

        const formTypesRepository = getRepository(FormTypes);
        const formTypeTemplate = await formTypesRepository.findOne({ where: { id: typeId }});

        if (entry.formComplete === true) {
            return res.redirect(`/form/${formTypeTemplate?.formType}?id=${typeId}-${uniqueId}`);
        } else {
            return res.redirect(`/form/${formTypeTemplate?.formType}?id=${typeId}-${uniqueId}`);
        }
    } catch (error) {
        console.error("Error fetching entry:", error);
        res.status(500).send("Internal server error.");
    }
});

// Forward to qr-code generation page.
router.get('/qr-generate', (req, res) => {
    if (!(req.session as any).loggedIn) {
        return res.redirect('/admin');  // If not logged in, redirect to login page
    }

    res.sendFile(path.join(__dirname, '../public', 'requestNewQR.html'))
})

export default router;