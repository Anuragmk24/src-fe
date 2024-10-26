'use client';
import Modal from '@/app/(user)/add-accomodation/Modal';
import { fetchUserWithTransactionId } from '@/data/users/register';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { MdCurrencyRupee } from 'react-icons/md';

type FormData = {
    referenceNumbers: { referenceNumber: string }[]; // Array of reference numbers
};

function NewAccomodationAdding() {
    const [amount, setAmount] = useState<number>(0);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            referenceNumbers: [{ referenceNumber: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'referenceNumbers',
    });

    const [referenceNumbers, setReferenceNumbers] = useState<string[]>([]);

    // Fetch user details for each reference number
    const { data, error, isLoading } = useQuery({
        queryKey: ['userDetails', referenceNumbers],
        queryFn: async () => {
            const responses = await Promise.all(referenceNumbers.map((id) => fetchUserWithTransactionId(id)));
            return responses; // Assuming fetchUserWithTransactionId returns an array of users per ID
        },
        enabled: referenceNumbers.length > 0, // Only enable query if there are IDs
    });

    const onSubmit = (data: FormData) => {
        console.log("Data ",data)
        const transactionIds = data.referenceNumbers.map((item) => item.referenceNumber);
        if (transactionIds.length <= 4) {
            setReferenceNumbers(transactionIds); // Set reference numbers for fetching users
        } else {
            alert('You can only enter up to 4 transaction IDs for group accommodation.');
        }
    };

    // Combine user details from all responses, avoiding duplicates
    const users = React.useMemo(() => {
        if (!data) return [];

        const userMap = new Map();

        data.forEach((item) => {
            if (Array.isArray(item.data)) {
                item.data.forEach((user: any) => {
                    if (!userMap.has(user.email)) {
                        // Use email or a unique identifier
                        userMap.set(user.email, user);
                    }
                });
            }
        });

        return Array.from(userMap.values());
    }, [data]);

    const uniqueUsers = React.useMemo(() => {
        const userMap = new Map();
        users.forEach((user) => {
            if (!userMap.has(user.id)) {
                userMap.set(user.id, user);
            }
        });
        return Array.from(userMap.values());
    }, [users]);

    useEffect(() => {
        setAmount(uniqueUsers.length * 4000);
    }, [uniqueUsers]);

    return (
        <div className="max-w-5xl mx-auto p-4  panel px-8 md:px-12 g-white dark:bg-white text-black dark:text-black">
            <h2 className="text-lg font-bold mb-4">Already Registered? Want to book accommodation?</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => (
                    <div key={field?.id} className="mb-4 md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Transaction ID {index + 1}</label>
                        <input
                            type="text"
                            placeholder="Enter reference number"
                            {...register(`referenceNumbers.${index}.referenceNumber`, { required: 'Reference number is required' })}
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors?.referenceNumbers?.[index]?.referenceNumber ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none dark:bg-white`}
                        />
                        <div className="flex flex-col justify-start items-start">
                            <small>* Maximum 4 members group allowed</small>
                            {errors?.referenceNumbers?.[index]?.referenceNumber && <p className="text-red-500 text-sm mt-1">{errors?.referenceNumbers?.[index]?.referenceNumber?.message}</p>}
                            {index > 0 && (
                                <button type="button" onClick={() => remove(index)} className="text-red-600 text-sm">
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="flex flex-col gap-2 justify-start items-start">
                    <button type="submit" className="bg-[#E5E52E] font-mono text-[#16616E] font-bold px-4 py-2 rounded-md hover:bg-[#E5E52E]">
                        Search
                    </button>
                    {fields.length < 4 && (
                        <button type="button" onClick={() => append({ referenceNumber: '' })} className="text-blue-600 text-sm mb-4">
                            + Add another Transaction ID
                        </button>
                    )}
                </div>
            </form>

            {/* Display loading, error, or user details */}
            <div className="mt-6 ">
                {isLoading && <p className="text-blue-600 font-medium">Loading user details...</p>}
                {error && <p className="text-red-600 font-medium">{error?.message || 'Error fetching user details. Please try again later.'}</p>}
                {uniqueUsers?.length > 0 && (
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200 g-white dark:bg-white text-black dark:text-black">
                        <h3 className="text-xl font-bold text-[#16616E] dark:text-black mb-4">User Details</h3>
                        <ul className="space-y-4">
                            {uniqueUsers.slice(0, 4).map(
                                (
                                    user: any // Removed slicing to show all unique users
                                ) => (
                                    <li key={user.id} className="p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition duration-200 g-white dark:bg-white text-black dark:text-black">
                                        <p className="text-gray-900 text-lg font-medium dark:text-black">
                                            <span className="font-semibold text-[#16616E]  dark:text-black">Name:</span> {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-gray-700 text-md dark:text-black">
                                            <span className="font-semibold text-[#16616E] dark:text-black ">Email:</span> {user?.email}
                                        </p>
                                    </li>
                                )
                            )}
                            <div className="flex  flex-col sm:flex-row gap-x-2 justify-start items-center">
                                {amount > 0 && (
                                    <span className="flex  rounded p-2 items-center">
                                        Total Amount: <MdCurrencyRupee />
                                        {amount}
                                    </span>
                                )}
                                <Modal uniqueUsers={uniqueUsers} />
                            </div>
                        </ul>
                    </div>
                )}
                {data && data.length > 0 && data.some((item: any) => item?.statusCode === 404) && <p className="text-red-600 text-md font-semibold">Incorrect Transaction ID(s) found.</p>}
            </div>
        </div>
    );
}

export default NewAccomodationAdding;
