import React from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  referenceNumber: string;
};

function NewAccomodationAdding() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Call search API for reference number
    // try {
    //   const response = await fetch(`/api/accommodation/search?ref=${data.referenceNumber}`);
    //   const result = await response.json();
    //   console.log('Search result:', result);
    //   // Handle the result (e.g., display accommodation details)
    // } catch (error) {
    //   console.error('Error searching reference number:', error);
    // }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-4">Already Registered ? And you want to book accomodation ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Reference Number
          </label>
          <input
            type="text"
            placeholder="Enter reference number"
            {...register('referenceNumber', { required: 'Reference number is required' })}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.referenceNumber ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none`}
          />
          {errors.referenceNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.referenceNumber.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-[#E5E52E] font-mono text-[#16616E] font-bold px-4 py-2 rounded-md hover:bg-[#E5E52E]"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default NewAccomodationAdding;
