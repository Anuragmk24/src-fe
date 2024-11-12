import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toggleAttendeeStatus } from '@/data/admin/registration';
import IconEye from '@/components/icon/icon-eye';

function CenterModal(state:any) {
    console.log("state ",state)

    const [modal10, setModal10] = useState(false);
    const { token } = useSelector((state: any) => state.admin);
   
   
   
    return (
        <div>
            <div onClick={() => setModal10(true)}>
                {state?.state}
            </div>
            <Transition appear show={modal10} as={Fragment}>
                <Dialog as="div" open={modal10} onClose={() => setModal10(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="slideIn_down_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <h5 className="font-bold text-lg">User Details</h5>
                                    <button onClick={() => setModal10(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                  
                                    <div className="flex justify-end items-center mt-8">
                                        <button onClick={() => setModal10(false)} type="button" className="btn btn-outline-danger">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default CenterModal;
