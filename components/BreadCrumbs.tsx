import React from 'react';

function BreadCrumbs({ title1, title2, title3 }: { title1: string; title2?: string; title3?: string }) {
    return (
        <ol className="flex text-gray-500 font-semibold dark:text-white-dark">
            <li>
                <a href="javascript:;" className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                    {title1}
                </a>
            </li>
            <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                <a href="javascript:;" className="text-primary">
                    {title2}
                </a>
            </li>
            {title3  && (
                <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <a href="javascript:;" className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        {title3}
                    </a>
                </li>
            )}
        </ol>
    );
}

export default BreadCrumbs;
