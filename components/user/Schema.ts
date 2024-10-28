import { z } from 'zod';

export const registrationSchemaWithSpouse = z
    .object({
        definition: z.string().optional(),
        bookingType: z.string().nullable().optional(),
        bringingSpouse: z.string().nullable().optional(),
        accomodation: z.string().nullable().optional(),
        gstNumber: z.string().nullable().optional(),
        gstBillingAddress: z.string().nullable().optional(),
        isStudentAffiliatedToIia: z.string().nullable().optional(),
        gstBill: z.boolean().optional(),

        spouse: z.object({
            spouseFirstName: z.string().nonempty('First name is required'),
            spouseLastName: z.string().nonempty('Last name is required'),
            spouseEmail: z.string().email('Invalid email address'),
            spouseMobile: z.string().min(10, 'Mobile number should be at least 10 digits'),
        }),

        group: z
            .array(
                z.object({
                    firstName: z.string().nonempty('First name is required'),
                    lastName: z.string().nonempty('Last name is required'),
                    email: z.string().email('Invalid email address'),
                    mobile: z.string().min(10, 'Mobile number should be at least 10 digits'),
                    companyName: z.string().optional(),
                    designation: z.string().optional(),
                    iia: z.string().optional(),
                    iiaReceipt: z.any().optional(), // Add this for file upload
                    collegeName: z.string().optional(),
                    country: z.string().nonempty('Country is required'),
                    state: z.string().nonempty('State is required'),
                    city: z.string().nonempty('City is required'),
                    pinCode: z.string().min(5, 'Pin code should be at least 5 digits'),
                    center: z.string().optional(),
                    coaNumber: z.string().nullable().optional(),
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
        definition: z.string().optional(),
        bookingType: z.string().nullable().optional(),
        bringingSpouse: z.string().nullable().optional(),
        accomodation: z.string().nullable().optional(),
        gstNumber: z.string().nullable().optional(),
        gstBillingAddress: z.string().nullable().optional(),
        isStudentAffiliatedToIia: z.string().nullable().optional(),
        gstBill: z.boolean().optional(),

        spouse: z
            .object({
                spouseFirstName: z.string().optional(),
                spouseLastName: z.string().optional(),
                spouseEmail: z.string().optional(),
                spouseMobile: z.string().optional(),
            })
            .optional(),
        group: z
            .array(
                z.object({
                    firstName: z.string().nonempty('First name is required'),
                    lastName: z.string().nonempty('Last name is required'),
                    email: z.string().email('Invalid email address'),
                    mobile: z.string().min(10, 'Mobile number should be at least 10 digits'),
                    companyName: z.string().optional(),
                    designation: z.string().optional(),
                    iia: z.string().optional(),
                    collegeName: z.string().optional(),
                    country: z.string().nonempty('Country is required'),
                    state: z.string().nonempty('State is required'),
                    city: z.string().nonempty('City is required'),
                    pinCode: z.string().min(5, 'Pin code should be at least 5 digits'),
                    center: z.string().optional(),
                    coaNumber: z.string().nullable().optional(),
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
        definition: z.string().optional(),
        bookingType: z.string().nullable().optional(),
        bringingSpouse: z.string().nullable().optional(),
        accomodation: z.string().nullable().optional(),
        gstNumber: z.string().nullable().optional(),
        gstBillingAddress: z.string().nullable().optional(),
        isStudentAffiliatedToIia: z.string().nullable().optional(),
        gstBill: z.boolean().optional(),
        spouse: z
            .object({
                spouseFirstName: z.string().optional(),
                spouseLastName: z.string().optional(),
                spouseEmail: z.string().optional(),
                spouseMobile: z.string().optional(),
            })
            .optional(),
        group: z
            .array(
                z.object({
                    firstName: z.string().nonempty('First name is required'),
                    lastName: z.string().nonempty('Last name is required'),
                    email: z.string().email('Invalid email address'),
                    mobile: z.string().min(10, 'Mobile number should be at least 10 digits'),
                    companyName: z.string().optional(),
                    designation: z.string().optional(),
                    // iia: z.string().nonempty('Iia number is required'),
                    iia: z.string().optional(),
                    iiaReceipt: z.any().optional(), // Add this for file upload

                    collegeName: z.string().optional(),
                    country: z.string().nonempty('Country is required'),
                    state: z.string().nonempty('State is required'),
                    city: z.string().nonempty('City is required'),
                    pinCode: z.string().min(5, 'Pin code should be at least 5 digits'),
                    center: z.string().optional(),
                    coaNumber: z.string().nullable().optional(),
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