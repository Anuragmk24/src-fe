import { z } from 'zod';

export const registrationSchemaWithSpouse = z
    .object({
        definition: z
            .string()
            .optional()
            .transform((val) => val?.trim()),
        bookingType: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        bringingSpouse: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        accomodation: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstNumber: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstBillingAddress: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        isStudentAffiliatedToIia: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstBill: z.boolean().optional(),

        spouse: z.object({
            spouseFirstName: z
                .string()
                .nonempty('First name is required')
                .transform((val) => val?.trim()),
            spouseLastName: z
                .string()
                .nonempty('Last name is required')
                .transform((val) => val?.trim()),
            spouseEmail: z
                .string()
                .email('Invalid email address')
                .transform((val) => val?.trim()),
            spouseMobile: z
                .string()
                .min(10, 'Mobile number should be at least 10 digits')
                .transform((val) => val?.trim()),
        }),

        group: z
            .array(
                z.object({
                    firstName: z
                        .string()
                        .nonempty('First name is required')
                        .transform((val) => val?.trim()),
                    lastName: z
                        .string()
                        .nonempty('Last name is required')
                        .transform((val) => val?.trim()),
                    email: z
                        .string()
                        .email('Invalid email address')
                        .transform((val) => val?.trim()),
                    mobile: z
                        .string()
                        .min(10, 'Mobile number should be at least 10 digits')
                        .transform((val) => val?.trim()),
                    companyName: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    designation: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    iia: z
                        .string()
                        // .min(3, 'Iia number should be at least 3 characters')
                        .optional()
                        .transform((val) => val?.trim()),
                    iiaReceipt: z.any().optional(), // Add this for file upload
                    collegeName: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    country: z
                        .string()
                        .nonempty('Country is required')
                        .transform((val) => val?.trim()),
                    state: z
                        .string()
                        .nonempty('State is required')
                        .transform((val) => val?.trim()),
                    city: z
                        .string()
                        .nonempty('City is required')
                        .transform((val) => val?.trim()),
                    pinCode: z
                        .string()
                        .min(5, 'Pin code should be at least 5 digits')
                        .transform((val) => val?.trim()),
                    center: z
                        .string()
                        .nonempty('Centre is mandatory field')
                        .transform((val) => val?.trim()),
                    coaNumber: z
                        .string()
                        .nullable()
                        .optional()
                        .transform((val) => val?.trim()),
                })
            )
            .optional(),
    })
    .refine(
        (data) => {
            // Conditionally require gstNumber and gstBillingAddress if gstBill is true
            if (data.gstBill) {
                return data.gstNumber && data.gstBillingAddress;
            }
            return true;
        },
        {
            message: 'GST number required when opting for GST bill',
            path: ['gstNumber'], // Only apply the error to gstNumber here for now
        }
    )
    .superRefine((data, ctx) => {
        if (data.gstBill && !data.gstBillingAddress) {
            ctx.addIssue({
                code: 'custom',
                message: 'GST Billing Address is required when opting for GST bill',
                path: ['gstBillingAddress'],
            });
        }
    });
export const registrationSchema = z
    .object({
        definition: z
            .string()
            .optional()
            .transform((val) => val?.trim()),
        bookingType: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        bringingSpouse: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        accomodation: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstNumber: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstBillingAddress: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        isStudentAffiliatedToIia: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstBill: z.boolean().optional(),

        spouse: z
            .object({
                spouseFirstName: z
                    .string()
                    .optional()
                    .transform((val) => val?.trim()),
                spouseLastName: z
                    .string()
                    .optional()
                    .transform((val) => val?.trim()),
                spouseEmail: z
                    .string()
                    .optional()
                    .transform((val) => val?.trim()),
                spouseMobile: z
                    .string()
                    .optional()
                    .transform((val) => val?.trim()),
            })
            .optional(),
        group: z
            .array(
                z.object({
                    firstName: z
                        .string()
                        .nonempty('First name is required')
                        .transform((val) => val?.trim()),
                    lastName: z
                        .string()
                        .nonempty('Last name is required')
                        .transform((val) => val?.trim()),
                    email: z
                        .string()
                        .email('Invalid email address')
                        .transform((val) => val?.trim()),
                    mobile: z
                        .string()
                        .min(10, 'Mobile number should be at least 10 digits')
                        .transform((val) => val?.trim()),
                    companyName: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    designation: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    iia: z
                        .string()
                        // .min(3, 'Iia number should be at least 3 characters')
                        .optional()
                        .transform((val) => val?.trim()),
                    collegeName: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    country: z
                        .string()
                        .nonempty('Country is required')
                        .transform((val) => val?.trim()),
                    state: z
                        .string()
                        .nonempty('State is required')
                        .transform((val) => val?.trim()),
                    city: z
                        .string()
                        .nonempty('City is required')
                        .transform((val) => val?.trim()),
                    pinCode: z
                        .string()
                        .min(5, 'Pin code should be at least 5 digits')
                        .transform((val) => val?.trim()),
                    center: z
                        .string()
                        .nonempty('Centre is mandatory field')
                        .transform((val) => val?.trim()),
                    coaNumber: z
                        .string()
                        .nonempty('COA number is required')
                        .transform((val) => val?.trim()),
                })
            )
            .optional(),
    })
    .refine(
        (data) => {
            // Conditionally require gstNumber and gstBillingAddress if gstBill is true
            if (data.gstBill) {
                return data.gstNumber && data.gstBillingAddress;
            }
            return true;
        },
        {
            message: 'GST number required when opting for GST bill',
            path: ['gstNumber'], // Only apply the error to gstNumber here for now
        }
    )
    .superRefine((data, ctx) => {
        if (data.gstBill && !data.gstBillingAddress) {
            ctx.addIssue({
                code: 'custom',
                message: 'GST Billing Address is required when opting for GST bill',
                path: ['gstBillingAddress'],
            });
        }
    });
export const registrationSchemaForIiaMembers = z
    .object({
        definition: z
            .string()
            .optional()
            .transform((val) => val?.trim()),
        bookingType: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        bringingSpouse: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        accomodation: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstNumber: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstBillingAddress: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        isStudentAffiliatedToIia: z
            .string()
            .nullable()
            .optional()
            .transform((val) => val?.trim()),
        gstBill: z.boolean().optional(),
        spouse: z
            .object({
                spouseFirstName: z
                    .string()
                    .optional()
                    .transform((val) => val?.trim()),
                spouseLastName: z
                    .string()
                    .optional()
                    .transform((val) => val?.trim()),
                spouseEmail: z
                    .string()
                    .optional()
                    .transform((val) => val?.trim()),
                spouseMobile: z
                    .string()
                    .optional()
                    .transform((val) => val?.trim()),
            })
            .optional(),
        group: z
            .array(
                z.object({
                    firstName: z
                        .string()
                        .nonempty('First name is required')
                        .transform((val) => val?.trim()),
                    lastName: z
                        .string()
                        .nonempty('Last name is required')
                        .transform((val) => val?.trim()),
                    email: z
                        .string()
                        .email('Invalid email address')
                        .transform((val) => val?.trim()),
                    mobile: z
                        .string()
                        .min(10, 'Mobile number should be at least 10 digits')
                        .transform((val) => val?.trim()),
                    companyName: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    designation: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    // iia: z.string().nonempty('Iia number is required'),
                    iia: z
                        .string()
                        // .min(3, 'Iia number should be at least 3 characters')
                        .optional()
                        .transform((val) => val?.trim()),
                    iiaReceipt: z.any().optional(), // Add this for file upload

                    collegeName: z
                        .string()
                        .optional()
                        .transform((val) => val?.trim()),
                    country: z
                        .string()
                        .nonempty('Country is required')
                        .transform((val) => val?.trim()),
                    state: z
                        .string()
                        .nonempty('State is required')
                        .transform((val) => val?.trim()),
                    city: z
                        .string()
                        .nonempty('City is required')
                        .transform((val) => val?.trim()),
                    pinCode: z
                        .string()
                        .min(5, 'Pin code should be at least 5 digits')
                        .transform((val) => val?.trim()),
                    center: z
                        .string()
                        .nonempty('Centre is mandatory field')
                        .transform((val) => val?.trim()),
                    coaNumber: z
                        .string()
                        .nullable()
                        .optional()
                        .transform((val) => val?.trim()),
                })
            )
            .optional(),
    })
    .refine(
        (data) => {
            // Conditionally require gstNumber and gstBillingAddress if gstBill is true
            if (data.gstBill) {
                return data.gstNumber && data.gstBillingAddress;
            }
            return true;
        },
        {
            message: 'GST number required when opting for GST bill',
            path: ['gstNumber'], // Only apply the error to gstNumber here for now
        }
    )
    .superRefine((data, ctx) => {
        if (data.gstBill && !data.gstBillingAddress) {
            ctx.addIssue({
                code: 'custom',
                message: 'GST Billing Address is required when opting for GST bill',
                path: ['gstBillingAddress'],
            });
        }
    });
