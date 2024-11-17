import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function ImageViewModal(row: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImageValid, setIsImageValid] = useState(true);

    // Function to handle image error (invalid image URL)
    const handleImageError = () => {
        setIsImageValid(false);
    };

    // Construct image URL
    const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${row.row.fileName}`;
    const fileName = row.row.fileName;

    // Function to trigger image download
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName; // Use the file name from the row data
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Thumbnail with error handling */}
            <div
                onClick={() => setIsOpen(true)}
                className="cursor-pointer inline-flex w-16 items-center p-2 hover:bg-gray-200 rounded-md"
            >
                {/* Show image only if it's valid, otherwise show nothing */}
                {isImageValid && <img src={imageUrl} alt="Thumbnail" onError={handleImageError} />}
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {/* Modal Image */}
                                    {isImageValid && (
                                        <img
                                            src={imageUrl}
                                            className="w-full h-full"
                                            alt="Full size"
                                            onError={handleImageError}
                                        />
                                    )}
                                    <div className="mt-6 flex justify-between">
                                        {/* Close Button */}
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Close
                                        </button>

                                        {/* Download Button */}
                                        {isImageValid && (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleDownload}
                                            >
                                                Download
                                            </button>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default ImageViewModal;
