import React from 'react';
import { MdCurrencyRupee } from 'react-icons/md';

function PriceDetails({ fee, price }: { fee: any, price: any }) {
    const totalPrice = fee.reduce((total: number, item: any) => total + item.value, 0);

    return (
        <div className="border rounded-t-xl md:w-1/3 g-white dark:bg-white text-black dark:text-black ">
            <div className="rounded-full">
                <h1 className="border-b bg-[#29C192] text-white px-4 py-3 rounded-t-xl">Price Detail</h1>
            </div>

            {fee?.map((i: any, k: any) => (
                <div key={k} className="flex justify-between px-4 py-2">
                    <h2>{i?.name}</h2>
                    <h2 className="flex items-center">
                        <MdCurrencyRupee />
                        {i.value}
                    </h2>
                </div>
            ))}

            <div className="border-t bg-gray-100 flex justify-between px-4 py-2 font-bold g-white dark:bg-white text-black dark:text-black">
                <h2>Total</h2>
                <h2 className="flex items-center">
                    <MdCurrencyRupee />
                    {totalPrice}
                </h2>
            </div>
        </div>
    );
}

export default PriceDetails;
