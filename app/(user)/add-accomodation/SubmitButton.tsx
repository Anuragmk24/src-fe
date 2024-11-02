import { addNewAccomodation } from '@/data/users/register';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function SubmitButton({ uniqueUsers, amount }: { uniqueUsers: any; amount: any }) {
    const [loading, setLoading] = useState(false);

    console.log("uniquesusers from button modal =======> ",uniqueUsers)
    console.log("amount  in modal ==============> ",amount)
    const onSubmit = async () => {
        setLoading(true);
        try {
            const orderUuid = uuidv4().split('-')[0];

            //make group with users
            // add group members into member table
            // initiate paymet with pending statue
            //create accomodation with pending status


            const addAccomodation = await addNewAccomodation(uniqueUsers,amount)
            console.log("addaccomodation ===============>",addAccomodation)

            //only works addaccomodation res is success or display proper error messages
            const payload = {
                address_line_1: addAccomodation?.data?.groupMembers?.[0]?.user?.city || '',
                amount: amount || 0,
                api_key: process.env.NEXT_PUBLIC_OMNIWARE_API_KEY,
                city: addAccomodation?.data?.groupMembers?.[0]?.user?.city || '',
                country: addAccomodation?.data?.groupMembers?.[0]?.user?.country || '',
                currency: 'INR',
                description: 'payment for src',
                email: addAccomodation?.data?.groupMembers?.[0]?.user?.email || '',
                hash: '',
                mode: process.env.NEXT_PUBLIC_PAYMENT_STATUS,
                name: addAccomodation?.data?.groupMembers?.[0]?.user?.firstName || '',
                order_id: `AMK${orderUuid}`,
                phone: Number(addAccomodation?.data?.groupMembers?.[0]?.user?.mobile || 0),
                return_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/payment/response`,
                state: addAccomodation?.data?.groupMembers?.[0]?.user?.state || '',
                zip_code: addAccomodation?.data?.groupMembers?.[0]?.user?.pinCode || '',
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
                    { name: 'hash', value: result.hash },
                    { name: 'address_line_1', value: addAccomodation?.data?.groupMembers?.[0]?.user?.city || '' },
                    { name: 'amount', value: amount || 0 },
                    { name: 'api_key', value: process.env.NEXT_PUBLIC_OMNIWARE_API_KEY },
                    { name: 'city', value: addAccomodation?.data?.groupMembers?.[0]?.user?.city || '' },
                    { name: 'country', value: addAccomodation?.data?.groupMembers?.[0]?.user?.country || '' },
                    { name: 'currency', value: 'INR' },
                    { name: 'description', value: 'payment for src' },
                    { name: 'email', value: addAccomodation?.data?.groupMembers?.[0]?.user?.email || '' },
                    { name: 'mode', value: process.env.NEXT_PUBLIC_PAYMENT_STATUS },
                    { name: 'name', value: addAccomodation?.data?.groupMembers?.[0]?.user?.firstName || '' },
                    { name: 'order_id', value: `AMK${orderUuid}` },
                    { name: 'phone', value: Number(addAccomodation?.data?.groupMembers?.[0]?.user?.mobile  || 0) },
                    //need to set payment success or failed after peyment response got once in be
                    //need to set accomodation confirmed true if payment success - accomodation table
                    { name: 'return_url', value: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/payment/response` },
                    { name: 'state', value: addAccomodation?.data?.groupMembers?.[0]?.user?.state || '' },
                    { name: 'zip_code', value: addAccomodation?.data?.groupMembers?.[0]?.user?.pinCode || '' },
                ];

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
            console.log('Error while processing payment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={onSubmit}
            className="bg-[#E5E52E] my-3 font-mono text-[#16616E] font-bold px-4 py-2 rounded-md hover:bg-[#E5E52E]"
            disabled={loading}
        >
            {loading ? 'Submitting...' : 'Continue to Pay'}
        </button>
    );
}

export default SubmitButton;
