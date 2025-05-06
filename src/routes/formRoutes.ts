// src/routes/formRoutes.ts
import { Router } from 'express';
import path from 'path';

const router = Router();

// Serve the dynamicForm.html for any form route
router.get("/form/:formId", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'dynamicForm.html'));
});

export default router;