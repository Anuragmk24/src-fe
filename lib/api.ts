import { GetServerSidePropsContext } from 'next';
import { cache } from 'react';

export const getAuthKey = (context?: GetServerSidePropsContext) => {
    let accessToken;
    
    if (context) {
        // This block runs in server-side context
        // @ts-ignore
        accessToken = context?.req?.session?.user?.accessToken;
        if (!accessToken) {
            // @ts-ignore
            context?.res?.writeHead(302, { Location: '/auth/logout' });
            // @ts-ignore
            context?.res?.end();
        }
    } else {
        // This block runs in the client-side context
        if (typeof window !== 'undefined') {
            accessToken = localStorage.getItem('accessToken');
        }
    }

    return accessToken;
};


const _fetch = async (url: any, options: any, isAuthenticated: boolean = true, context?: GetServerSidePropsContext) => {
    const dontWait = options.dontWait ?? false;
    delete options.dontWait;

    const finalUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/${url}`;
    const allOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': options.contentType ?? 'application/json',
        },
        next: {
            revalidate: 10,
        },
    };

    if (options.contentType === 'multipart/form-data') {
        delete allOptions.headers['Content-Type'];
    }

    if (options.method !== 'GET' && options.contentType !== 'multipart/form-data') {
        allOptions.body = JSON.stringify(options.body);
    }
    if (isAuthenticated) {
        const authKey = getAuthKey(context);
        allOptions.headers.Authorization = `Bearer ${authKey}`;
    }
    const response = await fetch(finalUrl, allOptions);
    if (!response.ok) {
        if (isAuthenticated && response.status === 401 && url !== 'customer/user/') {
            if (context) {
                // @ts-ignore
                context.res.writeHead(302, { Location: '/auth/logout' });
                // @ts-ignore
                context.res.end();
            } else {
                window.location.href = '/auth/logout';
            }
        }
    }

    if (dontWait) {
        return {
            ok: response.ok,
            status: response.status,
            json: response.ok ? await response.json() : null,
        };
    } else {
        return {
            ok: response.ok,
            status: response.status,
            json: response.status != 204 ? response.json() : {},
        };
    }
};
export const noAuthFetch = async (url: string, options: any): Promise<Response> => {
    return fetch(url, options);
};

export const serverFetch = async (context: GetServerSidePropsContext, url: string, options: any = {}) => {
    return _fetch(url, options, true, context);
};
export const clientFetch = async (url: string, options: any = {}): Promise<any> => {
    // Construct the final URL for the API request
    const finalUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/${url}`;

    // Prepare all options for the fetch request
    const allOptions: any = {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': options.contentType ?? 'application/json',
            "Access-Control-Allow-Origin": "*"
        },
        // Control caching behavior
        next: options.cache ? undefined : { cache: 'no-store' },
    };

    // Handle multipart/form-data requests
    if (options.contentType === 'multipart/form-data') {
        delete allOptions.headers['Content-Type'];
    }

    // Handle request body for non-GET requests
    if (options.method !== 'GET' && options.body) {
        allOptions.body = JSON.stringify(options.body);
    }

    try {
        // Make the API request
        const response = await fetch(finalUrl, allOptions);
        // Handle non-2xx responses
        // if (!response.ok) {
        //   const errorData = await response.json();
        //   console.error(`HTTP error! Status: ${response.status}`, errorData);
        //   // Handle specific error scenarios (optional)
        //   // if (response.status === 401 && url !== "customer/user/") {
        //   //   window.location.href = '/auth/logout'; // Redirect on unauthorized access
        //   // }
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        // Parse and return the JSON response
        const data = await response.json();
        if (!data.ok) {
            throw data;
        }
        return data;
    } catch (error) {
        return error; // Re-throw error for handling by caller
    }
};
