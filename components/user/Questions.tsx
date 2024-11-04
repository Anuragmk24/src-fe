import React from 'react';
import Points from './Points';

function Questions({ register, question, name }: { register: any; question: string; name: string }) {
    return (
        <div className="bg-white  mb-6 g-white dark:bg-white text-black dark:text-black">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-black">{question}?</h2>

            <div className="flex gap-y-4 flex-col">
                <label className="flex items-center text-gray-700">
                    <input type="radio" {...register(`${name}`, { required: true })} value="Yes" className="mr-3  text-green-500 focus:ring-green-500 form-radio w-4 h-4" />
                    <span className="dark:text-black">Yes</span>
                </label>

                <label className="flex items-center text-gray-700">
                    <input type="radio" {...register(`${name}`, { required: true })} value="No" className="mr-3  text-red-500 focus:ring-red-500 form-radio w-4 h-4" />
                    <span className="dark:text-black">No</span>
                </label>
            </div>
            {question === 'Do you want accomodation' && (
                <Points
                    points="Please note that roomRoom sharing arrangements will be based on the type of booking and group size. For group bookings, rooms are more likely to be allocated according to the number of participants: groups of two will receive double occupancy rooms (with couples receiving first preference), groups of three will be placed in triple occupancy rooms, and groups of four in quadruple occupancy rooms.

Please consider your group size carefully, as changes to room assignments may not be possible once allocated.

For individual bookings, room sharing will be arranged based on availability."
                    classNames=""
                />
            )}
        </div>
    );
}

export default Questions;
