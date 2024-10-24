import React from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';

function Points({ points }: { points: string }) {
    return (
        <>
            {points !== '' && (
                <div className="p-3  rounded-lg my-3 border shadow-sm  flex items-center justify-start ">
                    <HiOutlineLightBulb size={25} className="mr-2 text-yellow-400 self-start min-h-12 min-w-8" />
                    <p className='font-bold'>{points}</p>
                </div>
            )}
        </>
    );
}

export default Points;
