// src/routes/qrRoutes.ts
import { Router } from "express";
import path from 'path';

const router = Router();

router.get('/qr=:formType-:formId', (req, res) => {
    const { formType, formId } = req.params;
    console.log(`Form Type: ${parseInt(formType, 16)}, Form ID: ${parseInt(formId, 16)}`);
    
    res.send(`Processing form type: ${formType} with ID: ${formId}`);
});

// Forward to qr-code generation page.
router.get('/qr-generate', (req, res) => {
    if (!(req.session as any).loggedIn) {
        return res.redirect('/admin');  // If not logged in, redirect to login page
    }

    res.sendFile(path.join(__dirname, '../public', 'requestNewQR.html'))
})

export default router;