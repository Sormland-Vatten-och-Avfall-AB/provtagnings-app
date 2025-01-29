import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FormEntry } from "../entity/FormEntry";
import path from "path";
import { promises as fs } from 'fs';

type FormField = {
    label: string;
    type: string;
    name: string;
    options?: string[];
    required: boolean;
};

type FormConfig = {
    fields: FormField[];
    formPosition?: string;
    formType?: string;
    formName?: string;
};

async function loadTemplateForm(formType: string) {
    const templateFormFilePath = path.join(__dirname, '..', 'data', 'templates', `${formType}.json`);
    const templateFormData = await fs.readFile(templateFormFilePath, 'utf-8');
    return JSON.parse(templateFormData);
}

function getTemplateFormType(formID: string): string | null {
    const formIDSplit = formID.split('-');
    switch (formIDSplit[0]) {
        case 'dv':
            return 'dricksvatten';

        case 'gp':
            return `givarprov-${formIDSplit[2].replace(/\d+/g, '')}`;

        default:
            return null;
    }
}

function getFormTypeString(prefix: string): string {
    switch (prefix) {
        case 'dv':
            return 'Dricksvatten';
        
        case 'gp':
            return 'Givarprov';
        
        default:
            return 'undefined';
    }
}

// Load forms dynamically from JSON
async function loadForms(): Promise<{ [key: string]: FormConfig }> {
    const filePath = path.join(__dirname, '..', 'data', 'forms.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const formsData = JSON.parse(data);

    const forms: { [key: string]: FormConfig } = {};


    // Load each base form from its respective JSON file
    for (const form of formsData.forms) {
        console.log(form.formId);
        const formIDSplit = form.formId.split('-');
        const templateFormType = getTemplateFormType(form.formId);
        //console.log(templateFormType);

        if (templateFormType) {
            const templateForm = await loadTemplateForm(templateFormType);
            const formTypeString = getFormTypeString(formIDSplit[0]);

            let formName = form.formName;
            if (/^[A-Za-z]/.test(formIDSplit[2])) {
                formName = `${formIDSplit[2].toUpperCase()} - ${form.formName}`;
            }

            forms[form.formId] = {
                fields: templateForm.fields,
                formPosition: form.formPosition,
                formType: formTypeString,
                formName: formName
            }
        }
    }

    return forms;
}

// Get form configuration by ID
export const getFormById = async (req: Request, res: Response) => {
    const { formId } = req.params;

    try {
        const forms = await loadForms();
        const formConfig = forms[formId];

        if (formConfig) {
            res.json(formConfig);
        } else {
            return res.status(404).send("Form not found");
        }
    } catch (err) {
        console.error("Error loading form configurations:", err);
        res.status(500).json({ message: "Error loading form configuration." });
    }
};

// Helper function to validate form input dynamically
async function validateFormData(formId: string, formData: any): Promise<{ valid: boolean, errors: string[] }> {
    const forms = await loadForms();
    const formConfig = forms[formId];

    if (!formConfig || !formConfig.fields) {
        return { valid: false, errors: ["Form configuration not found."] };
    }

    const errors: string[] = [];

    // Loop through each field in the form configuration and validate the corresponding input
    formConfig.fields.forEach(field => {
        const value = formData[field.name];

        // Check if the field is missing & required

        if (!value && field.required) {
            errors.push(`${field.label} är obligatoriskt att fylla i.`);
            return;
        }

        if (field.required) {
            // Type-specific validation
            if (field.type === "email") {
                // Simple email format validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push(`${field.label} måste vara en giltig email.`);
                    return;
                }
            } else if (field.type === "number") {
                if (isNaN(Number(value))) {
                    errors.push(`${field.label} måste vara ett giltigt nummer.`);
                    return;
                }
            } else if (field.type === "text") {

                if (typeof value !== "string" || value.trim() === "") {
                    errors.push(`${field.label} måste vara giltig text.`);
                    return;
                }

            } else if (field.type === "time") {
                // Validate time format (HH:MM)
                const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
                if (!timeRegex.test(value)) {
                    errors.push(`${field.label} måste vara i HH:MM format.`);
                    return;
                }
            }
        }
    });

    return { valid: errors.length === 0, errors };
}


export const submitForm = async (req: Request, res: Response): Promise<Response> => {
    const { formId, ...formData } = req.body;

    console.log("Received form submission:", req.body);

    // Validate input based on form configuration
    const validation = await validateFormData(formId, formData);
    if (!validation.valid) {
        return res.status(400).json({ message: `${validation.errors[0]}` });
    }

    try {
        const formEntryRepo = getRepository(FormEntry);
        const formEntry = new FormEntry();
        formEntry.formId = formId;

        // Save the validated data as JSON
        formEntry.data = formData;

        await formEntryRepo.save(formEntry);

        return res.json({ message: "Din provdata har tagit emot, tack!" });
    } catch (error) {
        console.error("Error saving form data:", error);
        return res.status(500).json({ message: "Error saving form data" });
    }
};