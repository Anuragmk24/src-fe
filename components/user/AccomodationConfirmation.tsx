// 'use client';
// import React, { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import PriceDetails from './PriceDetails';

// function AccomodationConfirmation({ count }: { count: number }) {
//     const [isAccommodationConfirmed, setIsAccommodationConfirmed] = useState(false);
//     const [isContactAgreementConfirmed, setIsContactAgreementConfirmed] = useState(false);
//     const [priceData, setPriceData] = useState<any>(0);

//     // Submit logic using TanStack Query
//     const mutation = useMutation(async () => {
//         if (!isAccommodationConfirmed || !isContactAgreementConfirmed) {
//             throw new Error('Accommodation and contact agreement must be confirmed');
//         }
//         // Here you would integrate Omniware or your backend API to handle payment
//         // Example of the data you might send
//         const response = await fetch('/api/confirm-accomodation', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ count }),
//         });
//         if (!response.ok) {
//             throw new Error('Payment failed');
//         }
//         return response.json();
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         mutation.mutate();
//     };

//     let sampleData = [{
//       name:"Accomodation Fee",value:2500},
//       {name:"Service Fee" , value:500}
//     ]

//     return (
//         <div className="p-6 border rounded-md shadow-md max-w-5xl mx-auto p-4 mt-5 panel px-8 md:px-12">
//             <h1 className="text-xl font-semibold mb-4">Book your Accommodation</h1>
//             <h2 className="text-lg mb-4">Please confirm below to book your accommodation for {count} member(s)</h2>

//             <form className="mb-5" onSubmit={handleSubmit}>
//                 {/* Accommodation Confirmation */}
//                 <label className="mb-4 flex items-center">
//                     <input
//                         type="checkbox"
//                         checked={isAccommodationConfirmed}
//                         onChange={() => setIsAccommodationConfirmed(!isAccommodationConfirmed)}
//                         className="mr-2"
//                     />
//                     I confirm accommodation for {count} member(s)
//                 </label>

//                 {/* Contact Agreement Confirmation */}
//                 <label className="my-5 flex items-center">
//                     <input
//                         type="checkbox"
//                         checked={isContactAgreementConfirmed}
//                         onChange={() => setIsContactAgreementConfirmed(!isContactAgreementConfirmed)}
//                         className="mr-2"
//                     />
//                     I agree that SRC event Team can contact me on the provided details for Hotel Booking Confirmation*
//                 </label>
//             </form>

//             {/* Price Details */}
//              {/* display price details conditionally */}
//             <PriceDetails fee={sampleData} price={priceData} />

//             {/* Submit Button */}
//             <div className='text-center mt-5'>

//             <button
//                 type="submit"
//                 className={`bg-[#E5E52E] font-mono text-[#16616E] font-bold px-4 py-2 rounded-md hover:bg-[#E5E52E] ${
//                   !isAccommodationConfirmed || !isContactAgreementConfirmed || mutation.isLoading
//                   ? 'opacity-50 cursor-not-allowed'
//                   : ''
//                   }`}
//                   disabled={!isAccommodationConfirmed || !isContactAgreementConfirmed || mutation.isLoading}
//                   >
//                 {mutation.isLoading ? 'Processing...' : 'Submit & Pay'}
//             </button>
//               </div>

//             {/* Error and Success Messages */}
//             {mutation.isError && (
//                 <p className="text-red-500 mt-4">Error: {mutation.error?.message}</p>
//             )}
//             {mutation.isSuccess && (
//                 <p className="text-green-500 mt-4">Accommodation confirmed successfully!</p>
//             )}
//         </div>
//     );
// }

// export default AccomodationConfirmation;

import React from 'react'

function AccomodationConfirmation() {
  return (
    <div>
      
    </div>
  )
}

export default AccomodationConfirmation
