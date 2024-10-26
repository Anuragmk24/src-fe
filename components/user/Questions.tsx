import React from 'react';
import Points from './Points';

function Questions({ register, question, name }: { register: any; question: string; name: string }) {
    return (
        <div className="bg-white  mb-6 g-white dark:bg-gray-900 text-black dark:text-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{question}?</h2>

            <div className="flex gap-y-4 flex-col">
                <label className="flex items-center text-gray-700">
                    <input type="radio" {...register(`${name}`, { required: true })} value="Yes" className="mr-3  text-green-500 focus:ring-green-500" />
                    <span className="dark:text-white">Yes</span>
                </label>

                <label className="flex items-center text-gray-700">
                    <input type="radio" {...register(`${name}`, { required: true })} value="No" className="mr-3  text-red-500 focus:ring-red-500" />
                    <span className="dark:text-white">No</span>
                </label>
            </div>
            {question === 'Do you want accomodation' && (
                <Points points='Please note that room-sharing arrangements will depend on the type of booking. Group bookings are more likely to result in rooms being allocated together.
                    For individual bookings, room sharing will be arranged based on availability.'/>
            )}
        </div>
    );
}

export default Questions;
