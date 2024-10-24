'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Select from 'react-select';
import { SlCalender } from 'react-icons/sl';
import { CiLocationOn } from 'react-icons/ci';
import { CountrySelect, StateSelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import PriceDetails from './PriceDetails';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { booking, payment } from '@/data/users/register';

function RegistrationForm() {
    const [countryid, setCountryid] = useState(0);
    const [stateid, setstateid] = useState(0);
    const { control, handleSubmit, register, watch, reset, setValue } = useForm();
    const bookingType = watch('bookingType'); // Watching for booking type
    const groupSize = watch('groupSize'); // Watching for group size
    const isBringingSpouse = watch('bringingSpouse');
    const memberType = watch('definition');
    const router = useRouter();

    const samplePaymentData = {
        address_line_1: 'asdfasdfasf',
        address_line_2: 'ADDRESS',
        amount: '455',
        api_key: 'fb6bca86-b429-4abf-a42f-824bdd29022e',
        city: 'adfadf',
        country: 'India',
        currency: 'INR',
        description: 'fasdf',
        email: 'anu@gmail.com',
        hash: '',
        mode: 'TEST',
        name: 'asdfadf rthwrgsfd',
        order_id: 'asdfdasd',
        phone: '23442353452',
        return_url: 'http://localhost:3000/payment',
        state: 'Northern Territory',
        udf1: '',
        udf2: '',
        udf3: '',
        udf4: '',
        udf5: '',
        zip_code: '234234',
    };

    //   const { mutate, isError, isPending } = useMutation({
    //     mutationFn: async (data) => {
    //         try {
    //             // First, execute booking
    //             const bookingResult = await booking(data);
    //             console.log('Booking result:', bookingResult);

    //             // Only if booking succeeds, proceed with payment
    //             const paymentResult = await payment(samplePaymentData);
    //             console.log('Payment result:', paymentResult);

    //             // Return combined result if needed
    //             return { bookingResult, paymentResult };

    //         } catch (error) {
    //             throw new Error('Error while processing booking and payment');
    //         }
    //     },
    //     onSuccess: (data) => {
    //         console.log('Booking and payment successful', data);
    //         // Optionally navigate to another page after success
    //         // router.push('/accomodation');
    //     },
    //     onError: (error) => {
    //         console.log('Error when creating booking and payment:', error);
    //     },
    // });
    // const { mutate, isError, isPending } = useMutation({
    //     mutationFn: async (data) => {
    //         try {
    //             const bookingResult = await booking(data);
    //             console.log('Booking result:', bookingResult);

    //             const paymentResult = await payment(samplePaymentData);
    //             console.log('Payment result:', paymentResult);

    //             if (paymentResult.hash) {
    //                 const paymentForm = document.createElement('form');
    //                 paymentForm.method = 'POST';
    //                 paymentForm.action = 'https://pgbiz.omniware.in/v2/paymentrequest'; // Omniware payment URL

    //                 const hashInput = document.createElement('input');
    //                 hashInput.type = 'hidden';
    //                 hashInput.name = 'hash';
    //                 hashInput.value = paymentResult.data;

    //                 const apikeyInput = document.createElement('input');
    //                 apikeyInput.type = 'hidden';
    //                 apikeyInput.name = 'api_key';
    //                 apikeyInput.value = 'fb6bca86-b429-4abf-a42f-824bdd29022e';

    //                 paymentForm.appendChild(hashInput);
    //                 paymentForm.appendChild(apikeyInput);

    //                 const amountInput = document.createElement('input');
    //                 amountInput.type = 'hidden';
    //                 amountInput.name = 'amount';
    //                 amountInput.value = '450';

    //                 paymentForm.appendChild(amountInput);
    //                 document.body.appendChild(paymentForm);
    //                 paymentForm.submit();

    //                 return { bookingResult, paymentResult };
    //             } else {
    //                 throw new Error('Payment failed');
    //             }
    //             // } else {
    //             //     throw new Error('Booking failed');
    //             // }
    //         } catch (error) {
    //             console.error('Error while processing booking and payment:', error);
    //             throw error;
    //         }
    //     },
    //     onSuccess: (data) => {
    //         console.log('Booking and payment successful', data);

    //         // Optionally navigate to another page after success
    //         // router.push('/accomodation');  // If needed, navigate to another page
    //     },
    //     onError: (error) => {
    //         console.log('Error when creating booking and payment:', error);
    //         alert('Something went wrong while processing your booking and payment. Please try again.');
    //     },
    // });

    //need to create submit data type
    const onSubmits = async (data: any) => {
        // mutate(data);
        try {
            const response = await fetch('http://localhost:8080/api/v1/payment/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(samplePaymentData),
            });
            const result = await response.json();

            console.log('result ', result);
            if (result.hash) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://pgbiz.omniware.in/v2/paymentrequest';

                const inputs = [
                    { name: 'hash', value: result.hash },
                    { name: 'address_line_1', value: 'asdfasdfasf' },
                    { name: 'address_line_2', value: 'ADDRESS' },
                    { name: 'amount', value: '455' },
                    { name: 'api_key', value: 'fb6bca86-b429-4abf-a42f-824bdd29022e' },
                    { name: 'city', value: 'adfadf' },
                    { name: 'country', value: 'India' },
                    { name: 'currency', value: 'INR' },
                    { name: 'description', value: 'fasdf' },
                    { name: 'email', value: 'anu@gmail.com' },
                    { name: 'mode', value: 'TEST' },
                    { name: 'name', value: 'asdfadf rthwrgsfd' },
                    { name: 'order_id', value: 'asdfdasd' }, // Example order id, can be dynamic
                    { name: 'phone', value: '23442353452' },
                    { name: 'return_url', value: 'http://localhost:3000/payment' },
                    { name: 'state', value: 'Northern Territory' },
                    { name: 'udf1', value: '' },
                    { name: 'udf2', value: '' },
                    { name: 'udf3', value: '' },
                    { name: 'udf4', value: '' },
                    { name: 'udf5', value: '' },
                    { name: 'zip_code', value: '234234' },
                ];

                // Loop through the inputs array and append each input to the form
                inputs.forEach((inputData) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = inputData.name;
                    input.value = inputData.value;
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            } else {
                console.error('Hash generation failed');
            }
        } catch (error) {
            console.error('Error during payment request:', error);
        }
        // router.push('/accomodation');
    };

    // Dynamically create contact info sections based on group size
    const renderContactInfoFields = (size: number) => {
        return Array.from({ length: size }, (_, i) => (
            <div key={i}>
                <h2 className="text-lg font-semibold mb-2">{i === 0 ? 'Contact Info' : `Contact Info  ${i + 1}`}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">First Name</label>
                        <input type="text" {...register(`group[${i}].firstName`)} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                        <label className="block mb-1">Last Name</label>
                        <input type="text" {...register(`group[${i}].lastName`)} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                        <label className="block mb-1">Email</label>
                        <input type="email" {...register(`group[${i}].email`)} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                        <label className="block mb-1">Mobile</label>
                        <input type="tel" {...register(`group[${i}].mobile`)} className="border rounded px-2 py-1 w-full" />
                    </div>
                    {memberType === 'IIA Member - INR 5000 (Incl. GST)' && (
                        <div>
                            <label className="block mb-1">IIA Number</label>
                            <input type="tel" {...register(`group[${i}].iia`)} className="border rounded px-2 py-1 w-full" />
                        </div>
                    )}
                    <div>
                        <label className="block mb-1">Company Name</label>
                        <input type="text" {...register(`group[${i}].companyName`)} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                        <label className="block mb-1">Designation</label>
                        <input type="text" {...register(`group[${i}].designation`)} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                        <label className="block mb-1">Country</label>
                        <Controller
                            name={`group[${i}].country`}
                            control={control}
                            render={({ field }) => (
                                <CountrySelect
                                    {...field}
                                    onChange={(e: any) => {
                                        setCountryid(e.id);
                                        setValue(`group[${i}].country`, e.name); // Set country name in form data
                                    }}
                                    placeHolder="Select Country"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-1">State</label>
                        <Controller
                            name={`group[${i}].state`}
                            control={control}
                            render={({ field }) => (
                                <StateSelect
                                    {...field}
                                    countryid={countryid}
                                    onChange={(e: any) => {
                                        setstateid(e.id);
                                        setValue(`group[${i}].state`, e.name); // Set state name in form data
                                    }}
                                    placeHolder="Select State"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-1">City</label>
                        <input type="text" {...register(`group[${i}].city`)} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                        <label className="block mb-1">Pin Code</label>
                        <input type="text" {...register(`group[${i}].pinCode`)} className="border rounded px-2 py-1 w-full" />
                    </div>
                </div>
            </div>
        ));
    };

    console.log('member type ', memberType);
    // IIA Member - INR 5000 (Incl. GST)
    // Non IIA Member - INR 7500 (Incl. GST)
    // Student - INR 1000 (Incl. GST)
    return (
        <div className="max-w-5xl mx-auto p-4 mt-5 panel px-8 md:px-12">
            <h1 className="text-2xl font-bold mb-4 text-3xl text-center mt-4">Southern Regional Conference</h1>
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center  gap-x-4 text-[#16616E] sm:text-xl mb-8">
                <div className="flex items-center gap-x-2">
                    <SlCalender />
                    <h3>29, 30 NOVEMBER 2024</h3>
                </div>
                <button onClick={onSubmits}>click to pay </button>
                <div className="flex items-center gap-x-2">
                    <CiLocationOn />
                    <h3>Vythiri Village Resort, Wayanad</h3>
                </div>
            </div>
            <form
                // onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {/* Best Defines You */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">What best defines you? *</h2>
                    <div className="flex gap-y-2 flex flex-col">
                        <label>
                            <input type="radio" {...register('definition', { required: true })} value="IIA Member - INR 5000 (Incl. GST)" className="mr-2" />
                            IIA Member - INR 5000 (Incl. GST)
                        </label>
                        <label>
                            <input type="radio" {...register('definition', { required: true })} value="Non IIA Member - INR 7500 (Incl. GST)" className="mr-2" />
                            Non IIA Member - INR 7500 (Incl. GST)
                        </label>
                        <label>
                            <input type="radio" {...register('definition', { required: true })} value="Student - INR 1000 (Incl. GST)" className="mr-2" />
                            Student - INR 1000 (Incl. GST)
                        </label>
                    </div>
                </div>
                {/* <Country/> */}
                {/* spouse asking */}
                {memberType === 'IIA Member - INR 5000 (Incl. GST)' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Are you bringing your spouse?</h2>
                        <div className="flex gap-y-2 flex-col">
                            <label>
                                <input type="radio" {...register('bringingSpouse', { required: true })} value="Yes" className="mr-2" />
                                Yes
                            </label>
                            <label>
                                <input type="radio" {...register('bringingSpouse', { required: true })} value="No" className="mr-2" />
                                No
                            </label>
                        </div>
                        {isBringingSpouse === 'Yes' ? (
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Booking Type *</h2>
                                <div className="flex gap-y-2 flex-col">
                                    <label className="line-through">
                                        <input disabled type="radio" {...register('bookingType', { required: true })} value="Individual" className="mr-2  line-through" />
                                        Individual
                                    </label>
                                    <label>
                                        <input type="radio" {...register('bookingType', { required: true })} value="Group" className="mr-2" />
                                        Group
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Booking Type *</h2>
                                <div className="flex gap-y-2 flex-col">
                                    <label>
                                        <input type="radio" {...register('bookingType', { required: true })} value="Individual" className="mr-2" />
                                        Individual
                                    </label>
                                    <label>
                                        <input type="radio" {...register('bookingType', { required: true })} value="Group" className="mr-2" />
                                        Group
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Booking Type */}

                {/* Group Size */}
                {bookingType === 'Group' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Select Group Size</h2>
                        <Controller
                            name="groupSize"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={
                                        isBringingSpouse === 'Yes'
                                            ? [{ value: 2, label: '2' }] // Limit group size to 2 if bringing spouse
                                            : [
                                                  { value: 2, label: '2' },
                                                  { value: 3, label: '3' },
                                                  { value: 4, label: '4' },
                                              ]
                                    }
                                />
                            )}
                        />
                    </div>
                )}

                {memberType === 'Non IIA Member - INR 7500 (Incl. GST)' && renderContactInfoFields(1)}
                {memberType === 'Student - INR 1000 (Incl. GST)' && renderContactInfoFields(1)}
                {/* Spouse Form for Individuals */}

                {/* Dynamic Contact Info */}
                {bookingType === 'Individual' && renderContactInfoFields(1)}
                {bookingType === 'Group' && groupSize && isBringingSpouse === 'No' && renderContactInfoFields(groupSize.value)}
                {bookingType === 'Group' && groupSize && isBringingSpouse === 'Yes' && renderContactInfoFields(1)}

                {/* Spouse Form for Group Booking */}
                {/* {isBringingSpouse === 'Yes' && bookingType === 'Group' && groupSize?.value === 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{renderSpouseInfoFields(1)}</div>
                )} */}
                {isBringingSpouse === 'Yes' && bookingType === 'Group' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold mb-2">Spouse Details</h2>
                            <div>
                                <label>First Name</label>
                                <input type="text" {...register('spouseFirstName')} className="border rounded px-2 py-1 w-full" />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input type="text" {...register('spouseLastName')} className="border rounded px-2 py-1 w-full" />
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" {...register('spouseEmail')} className="border rounded px-2 py-1 w-full" />
                            </div>
                            <div>
                                <label>Mobile</label>
                                <input type="tel" {...register('spouseMobile')} className="border rounded px-2 py-1 w-full" />
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold mb-2">GST Included*</h2>
                    <div className="flex gap-y-2 flex-col">
                        <label>
                            <input type="checkbox" {...register('gstBill', { required: true })} value="gstBillNeed" className="mr-2" />
                            Do you want GST bill ?
                        </label>
                        <div>
                            <label className="block mb-1">GST Number</label>
                            <input type="text" {...register(`gstNumber`)} className="border rounded px-2 py-1 w-1/2" />
                        </div>
                        <div>
                            <label className="block mb-1">GST Billing Address</label>
                            <input type="text" {...register(`gstBillingAddress`)} className="border rounded px-2 py-1 w-1/2" />
                        </div>
                    </div>
                </div>

                {/* price compnent  */}
                {/* <PriceDetails /> */}
                {/* Submit Button */}
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Continue to pay
                </button>
            </form>
        </div>
    );
}

export default RegistrationForm;
