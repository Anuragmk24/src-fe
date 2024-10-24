import IconX from '@/components/icon/icon-x';
import { IRootState } from '@/store';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form'; // Import useForm from react-hook-form
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

function Modal({ uniqueUsers }: { uniqueUsers: any }) {
    const [modal10, setModal10] = useState(false);
    const { register, handleSubmit, reset } = useForm(); // Initialize react-hook-form
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);

            const file = data.accomodationReciept[0];
            if (!file) {
                throw new Error('No file uploaded');
            }

            //compression options
            const options = {
                maxSizeMB: 1,
                maxWidthOeHeight: 1024,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);

            const formData = new FormData();
            formData.append('files', compressedFile, file.name);
            formData.append('users', JSON.stringify(uniqueUsers));

            const fileUploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/booking/accomodation-reciept`, {
                method: 'POST',
                body: formData,
            });
            // Handle the response if needed
            const response = await fileUploadResponse.json();
            console.log('File upload response: ', response);

            // Reset form and stop loading
            reset(); // Reset the form fields after submission
            if (response.ok) {
                toast.success(response?.message);
            } else {
                toast.error(response?.message);
            }
            setModal10(false);
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setLoading(false);
            console.log('error while adding accomodation reciept', error);
        }
    };

    return (
        <div>
            <div onClick={() => setModal10(true)}>
                <button type="button" className="bg-[#E5E52E] my-3 font-mono text-[#16616E] font-bold px-4 py-2 rounded-md hover:bg-[#E5E52E]">
                    Book Accommodation
                </button>
            </div>
            <Transition appear show={modal10} as={Fragment}>
                <Dialog as="div" open={modal10} onClose={() => setModal10(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="slideIn_down_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
                                <div className="p-5">
                                    <img src="/assets/images/qrcode.png" alt="qrcode" />
                                    <h1 className="text-xl font-bold text-center my-3">OR</h1>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        {' '}
                                        {/* Add the form submission handler */}
                                        <div className="px-5 py-4 panel bg-gray-100 rounded-lg shadow-md">
                                            <h3 className="font-bold text-lg text-[#16616E] mb-2">Beneficiary Information</h3>
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-md">Beneficiary:</span>
                                                    <span className="text-[13px] flex justify-center items-center font-bold">Vythiri Village (A Unit of Greeshmam Resorts Pvt Ltd)</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-md">Account No:</span>
                                                    <span className="text-md flex justify-center items-center font-bold">0358214000002</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-md">IFSC Code:</span>
                                                    <span className="text-md flex justify-center items-center font-bold">CNRB0000358</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-md">Bank:</span>
                                                    <span className="text-md flex justify-center items-center font-bold">Canara Bank, Vythiri</span>
                                                </div>
                                            </div>
                                        </div>
                                        <label className="block my-3">Upload Screenshot here</label>
                                        <input type="file" {...register('accomodationReciept')} className="border rounded px-2 py-1 w-full mt-4" accept=".pdf,.jpg,.png,.svg,.webp" />
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" onClick={() => setModal10(false)} className="btn btn-outline-danger">
                                                Discard
                                            </button>
                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                {loading ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default Modal;
