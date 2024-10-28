'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { SlCalender } from 'react-icons/sl';
import { CiLocationOn } from 'react-icons/ci';
import { CountrySelect, StateSelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import PriceDetails from './PriceDetails';
import { useQuery } from '@tanstack/react-query';
import { booking, fetchTotalStudentsCount, fileUpload, payment } from '@/data/users/register';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Questions from './Questions';
import Points from './Points';
import imageCompression from 'browser-image-compression';
import { registrationSchema, registrationSchemaForIiaMembers, registrationSchemaWithSpouse } from './Schema';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

function RegistrationForm() {
    const [countryid, setCountryid] = useState(0);
    const [stateid, setstateid] = useState(0);
    const [loading, setLoading] = useState(false);
    const { data, isError, isPending } = useQuery({
        queryKey: ['count-student'],
        queryFn: () => fetchTotalStudentsCount(),
    });

    const [schema, setSchema] = useState<ZodType<any>>(registrationSchema);
    const {
        control,
        handleSubmit,
        register,
        watch,
        reset,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });
    const memberType = watch('definition');
    const bookingType = watch('bookingType');
    const [customError, setCustomError] = useState('');

    const groupSize = watch('groupSize');
    const isBringingSpouse = watch('bringingSpouse');
    const accomodation = watch('accomodation');
    const isStudentAffiliatedToIia = watch('isStudentAffiliatedToIia');
    useEffect(() => {
        if (memberType === 'IIA_MEMBER' && isBringingSpouse === 'Yes') {
            setSchema(registrationSchemaWithSpouse);
        } else if (memberType === 'IIA_MEMBER') {
            setSchema(registrationSchemaForIiaMembers);
        } else {
            setSchema(registrationSchema);
        }
    }, [memberType, isBringingSpouse]);

    const [priceData, setPriceData] = useState<any>({
        regFee: 0,
        accFee: 0,
    });
    const [priceDetails, setPriceDetails] = useState<any>([]);

    const onSubmit = async (data: any) => {
        console.log('Daata ==========> ', data);

        if (data.definition === 'IIA_MEMBER') {
            if (data.group[0].iia === '' && (!data.group[0].iiaReceipt || data.group[0].iiaReceipt.length === 0)) {
                setCustomError('Please provide either IIA number or upload the IIA receipt.');
                return;
            }
        }
        setLoading(true);
        const uploadPromises = data.group.map(async (member: any) => {
            // Assign the filename to the member before uploading
            member.fileName = member?.iiaReceipt?.[0]?.name;

            if (member.iiaReceipt && member.iiaReceipt.length > 0) {
                const originalFile = member.iiaReceipt[0];

                //compression options
                const options = {
                    maxSizeMB: 1,
                    maxWidthOeHeight: 1024,
                    useWebWorker: true,
                };

                try {
                    const compressedFile = await imageCompression(originalFile, options);
                    const formData = new FormData();

                    formData.append('files', compressedFile, originalFile.name);
                    formData.append('phoneNumber', member.mobile);
                    const fileUploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/booking/file-upload`, {
                        method: 'POST',
                        body: formData,
                    });

                    const fileUploadData = await fileUploadResponse.json();

                    // Add the uploaded file name or response data to the member object
                    return {
                        ...member,
                        uploadStatus: 'success',
                        uploadedFileData: fileUploadData,
                    };
                } catch (error) {
                    console.error('File upload failed for member:', member.mobile, error);
                    return {
                        ...member,
                        uploadStatus: 'failure',
                        error,
                    };
                }
            } else {
                // If no file is uploaded, still return the member
                return {
                    ...member,
                    uploadStatus: 'no-file',
                };
            }
        });

        // Wait for all uploads to complete
        const uploadedMembers = await Promise.all(uploadPromises);

        // Now proceed with the booking request, including the file name for each member
        const payload = {
            ...data,
            memberType,
            amount: priceData,
            uploadedMembers, // Add the uploaded members info to the payload
        };
        const orderUuid = uuidv4().split('-')[0];

        try {
            const bookingResult = await booking(payload);
            if (bookingResult.statusCode === 201) {
                const payload = {
                    address_line_1: bookingResult?.data?.[0]?.city,
                    amount: 10,
                    // amount: priceData.regFee + priceData.accFee || 0,
                    api_key: process.env.NEXT_PUBLIC_OMNIWARE_API_KEY,
                    city: bookingResult?.data?.[0]?.city,
                    country: bookingResult?.data?.[0]?.country,
                    currency: 'INR',
                    description: 'payment for src',
                    email: bookingResult?.data?.[0]?.email,
                    hash: '',
                    mode: process.env.NEXT_PUBLIC_PAYMENT_STATUS,
                    name: bookingResult?.data?.[0]?.firstName,
                    order_id: `AMK${orderUuid}`,
                    // order_id: '2a00s02603' + bookingResult?.data?.[0]?.id + '5647',
                    phone: Number(bookingResult?.data?.[0]?.mobile),
                    return_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/payment/response`,
                    // return_url: `http://localhost:8888/paymentResponse`,
                    state: bookingResult?.data?.[0]?.state,
                    zip_code: bookingResult?.data?.[0]?.pinCode,
                };
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/payment/request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();

                if (result.hash) {
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = 'https://pgbiz.omniware.in/v2/paymentrequest';

                    const inputs = [
                        { name: 'hash', value: result?.hash },
                        { name: 'address_line_1', value: bookingResult?.data?.[0]?.city },
                        {
                            name: 'amount',
                            value: 10,
                            // value: priceData.regFee + priceData.accFee || 0,
                        },

                        { name: 'api_key', value: process.env.NEXT_PUBLIC_OMNIWARE_API_KEY },
                        { name: 'city', value: bookingResult?.data?.[0]?.city },
                        { name: 'country', value: bookingResult?.data?.[0]?.country },
                        { name: 'currency', value: 'INR' },
                        { name: 'description', value: 'payment for src' },
                        { name: 'email', value: bookingResult?.data?.[0]?.email },
                        { name: 'mode', value: process.env.NEXT_PUBLIC_PAYMENT_STATUS },
                        { name: 'name', value: bookingResult?.data?.[0]?.firstName },
                        { name: 'order_id', value: `AMK${orderUuid}` }, // Example order id, can be dynamic
                        { name: 'phone', value: Number(bookingResult?.data?.[0]?.mobile) },
                        { name: 'return_url', value: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/payment/response` },
                        // { name: 'return_url', value: `http://localhost:8888/paymentResponse` },
                        { name: 'state', value: bookingResult?.data?.[0]?.state },
                        { name: 'zip_code', value: bookingResult?.data?.[0]?.pinCode },
                    ];
                    console.log('inputs ', inputs);

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
                    setLoading(false);
                    console.error('Hash generation failed');
                }
            } else {
                toast.error('Something went wrong , please try again later');
            }
        } catch (error) {
            setLoading(false);

            toast.error('Something went wrong please try again later');
            console.error('Error during payment request:', error);
        }
    };

    useEffect(() => {
        let regFee = 0;
        let accFee = 0;

        if (memberType === 'STUDENT') {
            if (isStudentAffiliatedToIia === 'Yes') {
                regFee = 1000;
            } else {
                console.log('in else condition ');
                regFee = 1500;
            }
        } else if (memberType === 'NON_IIA_MEMBER') {
            regFee = 4500;
        } else if (memberType === 'IIA_MEMBER') {
            regFee = 3500;
            if (isBringingSpouse === 'Yes') {
                regFee = 7000;
            } else if (groupSize?.value === 2) {
                regFee = 7000;
            } else if (groupSize?.value === 3) {
                regFee = 10500;
            } else if (groupSize?.value === 4) {
                regFee = 14000;
            } else if (isBringingSpouse === 'No' && bookingType === 'Individual') {
                regFee = 3500;
            }

            // Adjust for group size with accommodation
            if (groupSize?.value === 2 && accomodation === 'Yes') {
                regFee = 7000;
            } else if (groupSize?.value === 3 && accomodation === 'Yes') {
                regFee = 10500;
            } else if (groupSize?.value === 4 && accomodation === 'Yes') {
                regFee = 14000;
            }
        }

        // Check for accommodation
        if (accomodation === 'Yes') {
            accFee = 4000; // Accommodation fee
            if (bookingType === 'Individual') {
                accFee = 4000;
            } else if (groupSize?.value === 2) {
                accFee = 8000;
            } else if (groupSize?.value === 3) {
                accFee = 12000;
            } else if (groupSize?.value === 4) {
                accFee = 16000;
            } else if (isBringingSpouse === 'Yes') {
                accFee = 8000;
            }
        }

        setPriceData({ regFee, accFee });
    }, [memberType, isBringingSpouse, groupSize, accomodation, bookingType, isStudentAffiliatedToIia]);

    useEffect(() => {
        const details = [{ name: 'Registration Fee', value: priceData.regFee }];

        if (accomodation === 'Yes') {
            details.push({ name: 'Accommodation Fee', value: priceData.accFee });
        }

        setPriceDetails(details);
    }, [priceData, accomodation]);

    console.log('errors ', errors);
    const renderContactInfoFields = (size: number) => {
        return Array.from({ length: size }, (_, i) => (
            <div key={i}>
                <h2 className="text-lg font-semibold mb-2">{i === 0 ? 'Contact Info' : `Contact Info  ${i + 1}`}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">First Name</label>
                        <input type="text" {...register(`group[${i}].firstName`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        {Array.isArray(errors?.group) && errors.group[i]?.firstName && <p className="text-red-600">{errors.group[i].firstName.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Last Name</label>
                        <input type="text" {...register(`group[${i}].lastName`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        {Array.isArray(errors?.group) && errors.group[i]?.lastName && <p className="text-red-600">{errors.group[i].lastName.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Email</label>
                        <input type="email" {...register(`group[${i}].email`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        {Array.isArray(errors?.group) && errors.group[i]?.email && <p className="text-red-600">{errors.group[i].email.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Mobile</label>
                        <input type="tel" {...register(`group[${i}].mobile`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        {Array.isArray(errors?.group) && errors.group[i]?.mobile && <p className="text-red-600">{errors.group[i].mobile.message}</p>}
                    </div>

                    {memberType === 'IIA_MEMBER' && (
                        <div>
                            <label className="block mb-1">IIA Number</label>
                            <input type="text" {...register(`group[${i}].iia`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                            {Array.isArray(errors?.group) && errors.group[i]?.iia && <p className="text-red-600">{errors.group[i].iia.message}</p>}
                        </div>
                    )}

                    {/* File Upload for new IIA members without IIA Number */}
                    {memberType === 'IIA_MEMBER' && !watch(`group[${i}].iia`) && (
                        <div>
                            <label className="block mb-1">Upload IIA Membership Receipt (Newly registerd)</label>
                            <input type="file" {...register(`group[${i}].iiaReceipt`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" accept=".pdf,.jpg,.png" />
                            {Array.isArray(errors?.group) && errors.group[i]?.iiaReceipt && <p className="text-red-600">{errors.group[i].iiaReceipt.message}</p>}
                        </div>
                    )}
                    {customError && <p className="text-red-600">{customError}</p>}

                    {memberType !== 'STUDENT' && (
                        <>
                            <div>
                                <label className="block mb-1">Company Name</label>
                                <input type="text" {...register(`group[${i}].companyName`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                            </div>
                            <div>
                                <label className="block mb-1">Designation</label>
                                <input type="text" {...register(`group[${i}].designation`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                            </div>
                        </>
                    )}
                    {memberType === 'NON_IIA_MEMBER' && (
                        <div>
                            <label className="block mb-1">COA Number</label>
                            <input type="text" {...register(`group[${i}].coaNumber`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        </div>
                    )}
                    {memberType === 'STUDENT' && (
                        <div>
                            <label className="block mb-1">College Name</label>
                            <input type="text" {...register(`group[${i}].collegeName`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        </div>
                    )}

                    <div>
                        <label className="block mb-1">Country</label>
                        <Controller
                            name={`group[${i}].country`}
                            control={control}
                            rules={{ required: 'Country is required' }}
                            render={({ field }) => (
                                <CountrySelect
                                    {...field}
                                    onChange={(e: any) => {
                                        setCountryid(e.id);
                                        setValue(`group[${i}].country`, e.name); // Set country name in form data
                                        trigger(`group[${i}].country`); // Trigger validation after setting value

                                    }}
                                    placeHolder="Select Country"
                                />
                            )}
                        />
                        {Array.isArray(errors?.group) && errors.group[i]?.country && <p className="text-red-600">{errors.group[i].country.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">State</label>
                        <Controller
                            name={`group[${i}].state`}
                            control={control}
                            rules={{ required: 'State is required' }}
                            render={({ field }) => (
                                <StateSelect
                                    {...field}
                                    countryid={countryid}
                                    onChange={(e: any) => {
                                        setstateid(e.id);
                                        setValue(`group[${i}].state`, e.name); // Set state name in form data
                                        trigger(`group[${i}].state`); // Trigger validation after setting value

                                    }}
                                    placeHolder="Select State"
                                />
                            )}
                        />
                        {Array.isArray(errors?.group) && errors.group[i]?.state && <p className="text-red-600">{errors.group[i].state.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">City</label>
                        <input type="text" {...register(`group[${i}].city`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        {Array.isArray(errors?.group) && errors.group[i]?.city && <p className="text-red-600">{errors.group[i].city.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-1">Center</label>
                        <input type="text" {...register(`group[${i}].center`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        {Array.isArray(errors?.group) && errors.group[i]?.center && <p className="text-red-600">{errors.group[i].center.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Pin Code</label>
                        <input type="text" {...register(`group[${i}].pinCode`)} className="border rounded px-2 py-1 w-full dark:bg-white bg-white" />
                        {Array.isArray(errors?.group) && errors.group[i]?.pinCode && <p className="text-red-600">{errors.group[i].pinCode.message}</p>}
                    </div>
                </div>
            </div>
        ));
    };
    useEffect(() => {
        if (isBringingSpouse === 'Yes') {
            setValue('bookingType', 'Group');
            setValue('groupSize', 2);
        } else {
            // Reset bookingType and groupSize when spouse is not being brought
            // setValue('bookingType', 'Individual');
            // setValue('groupSize', null);
        }
    }, [isBringingSpouse, setValue]);

    return (
        <div className="max-w-5xl mx-auto p-4 mt-5 panel px-8 md:px-12 g-white dark:bg-white bg-white text-black dark:text-black">
            <div className="flex flex-col items-center justify-center">
                <img src="/assets/sponsors/jidal-sml-logo-black.svg" alt="Logo" className="w-36 h-16 md:w-20 md:h-20" />
                <img src="/assets/images/SRC-logo-black.svg" alt="Logo" className="w-60 h-20 md:w-72 mb-5 md:h-20" />
            </div>
            {/* <h1 className="text-2xl font-bold mb-4 text-3xl text-center mt-4">Southern Regional Conference</h1> */}
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center  gap-x-4 text-[#16616E] sm:text-xl mb-8">
                <div className="flex items-center gap-x-2">
                    <SlCalender />
                    <h3>29, 30 NOVEMBER 2024</h3>
                </div>

                <div className="flex items-center gap-x-2">
                    <CiLocationOn />
                    <h3>Vythiri Village Resort, Wayanad</h3>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Best Defines You */}
                <div className="flex">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">What best defines you? *</h2>
                        <div className="flex gap-y-2 flex flex-col">
                            <label>
                                <input type="radio" {...register('definition', { required: true })} value="IIA_MEMBER" className="mr-2" />
                                IIA Member
                            </label>
                            <label>
                                <input type="radio" {...register('definition', { required: true })} value="NON_IIA_MEMBER" className="mr-2" />
                                Non IIA Member
                            </label>
                            <div className="flex itemse-center flex-col gap-x-3">
                                <label className="text-gray-400">
                                    {data && data.count < 100 ? (
                                        <input type="radio" disabled {...register('definition', { required: true })} value="STUDENT" className="mr-2" />
                                    ) : (
                                        <input type="radio" disabled={true} value="student" className="mr-2" />
                                    )}
                                    Student
                                </label>
                                <small> *Student registration will be opening soon.</small>
                            </div>
                        </div>
                    </div>
                    {/* <NewAccomodationAdding/> */}
                </div>

                {memberType === 'STUDENT' && <Questions register={register} question="Affiliated to IIA" name="isStudentAffiliatedToIia" />}
                {memberType === 'IIA_MEMBER' && (
                    <>
                        <div>
                            <Points points="Early Bird Offer: Register for SRC and book your accommodation together for just ₹7500. Offer valid only until November 5th."  classNames="bg-violet-200" />
                            <Questions register={register} question="Are you bringing your spouse" name="bringingSpouse" />
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
                        {bookingType === 'Group' && (
                            <div className={`${isBringingSpouse === 'Yes' ? 'hidden' : ''}`}>
                                <h2 className="text-lg font-semibold mb-2">Select Group Size</h2>
                                <Controller
                                    name="groupSize"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="dark:text-black g-white dark:bg-white bg-white text-black dark:text-black"
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
                                            isDisabled={isBringingSpouse === 'Yes'} // Disable the select if bringing a spouse
                                        />
                                    )}
                                />
                            </div>
                        )}
                        <Questions register={register} question="Do you want accomodation" name="accomodation" />
                    </>
                )}

                {/* Booking Type */}

                {/* Group Size */}

                {memberType === 'NON_IIA_MEMBER' && renderContactInfoFields(1)}
                {memberType === 'STUDENT' && renderContactInfoFields(1)}
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
                                <input
                                    type="text"
                                    {...register('spouse.spouseFirstName')} // Register as part of the spouse object
                                    className="border rounded px-2 py-1 w-full dark:bg-white bg-white"
                                />
                                {errors?.spouse && (
                                    <p className="text-red-600">{(errors.spouse as any).spouseFirstName?.message}</p> // Corrected error access
                                )}
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    {...register('spouse.spouseLastName')} // Register as part of the spouse object
                                    className="border rounded px-2 py-1 w-full dark:bg-white bg-white"
                                />
                                {errors?.spouse && (
                                    <p className="text-red-600">{(errors.spouse as any).spouseLastName?.message}</p> // Corrected error access
                                )}
                            </div>
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    {...register('spouse.spouseEmail')} // Register as part of the spouse object
                                    className="border rounded px-2 py-1 w-full dark:bg-white bg-white"
                                />
                                {errors?.spouse && (
                                    <p className="text-red-600">{(errors.spouse as any).spouseEmail?.message}</p> // Corrected error access
                                )}
                            </div>
                            <div>
                                <label>Mobile</label>
                                <input
                                    type="tel"
                                    {...register('spouse.spouseMobile')} // Register as part of the spouse object
                                    className="border rounded px-2 py-1 w-full dark:bg-white bg-white"
                                />
                                {errors?.spouse && (
                                    <p className="text-red-600">{(errors.spouse as any).spouseMobile?.message}</p> // Corrected error access
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {memberType !== null && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">GST Included</h2>
                        <div className="flex gap-y-2 flex-col">
                            <label>
                                <input type="checkbox" {...register('gstBill')} className="mr-2 dark:bg-white bg-white" />
                                Do you want GST bill?
                            </label>

                            {/* Conditionally show GST fields if gstBill is true */}
                            {watch('gstBill') && (
                                <>
                                    <div>
                                        <label className="block mb-1">GST Number</label>
                                        <input
                                            type="text"
                                            {...register('gstNumber', {
                                                required: watch('gstBill') ? 'GST Number is required' : false,
                                            })}
                                            className="border rounded px-2 py-1 w-1/2 dark:bg-white bg-white"
                                        />
                                        {errors.gstNumber && typeof errors.gstNumber.message === 'string' && <p className="text-red-500">{errors.gstNumber.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block mb-1">GST Billing Address</label>
                                        <input
                                            type="text"
                                            {...register('gstBillingAddress', {
                                                required: watch('gstBill') ? 'GST Billing Address is required' : false,
                                            })}
                                            className="border rounded px-2 py-1 w-1/2 dark:bg-white bg-white"
                                        />
                                        {errors.gstBillingAddress && typeof errors.gstBillingAddress.message === 'string' && <p className="text-red-500">{errors.gstBillingAddress.message}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <PriceDetails fee={priceDetails} price={priceData.regFee + priceData.accFee} />
                <div className="text-center">
                    <button type="submit" className="bg-[#E5E52E] font-mono text-[#16616E] font-bold px-4 py-2 rounded-md hover:bg-[#E5E52E]">
                        {loading ? 'Submiting...' : ' Continue to pay'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;
