// src/routes/formRoutes.ts
import { Router } from 'express';
import path from 'path';

const router = Router();

// Serve the dynamicForm.html for any form route
router.get("/form/:formType", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'dynamicForm.html'));
});

router.get("/entry", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'entry.html'))
})

export default router;