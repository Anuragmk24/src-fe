import { clientFetch } from '@/lib/api';

export const booking = async (payload: any) => {
    try {
        const res = await clientFetch(`booking/create`, {
            method: 'POST',
            body: payload,
        });
        return res;
    } catch (err) {
        console.log('error  ', err);
        throw err;
    }
};
export const fileUpload = async (payload: FormData) => {
    try {
        const res = await clientFetch(`booking/file-upload`, {
            method: 'POST',
            body: payload,
        });
        return res;
    } catch (err) {
        console.log('error  ', err);
        throw err;
    }
};
export const payment = async (payload: any) => {
    try {
        const res = await clientFetch(`payment/request`, {
            method: 'POST',
            body: payload,
        });
        console.log('Res from data ', res);

        // Check if the response is ok (status in the range 200-299)
        // if (!res.ok) {
        //     throw res;
        // }
        return res;
    } catch (err) {
        console.log('error  ', err);
        throw err;
    }
};

export const fetchTotalStudentsCount = async () => {
    try {
        const res = await clientFetch(`booking/count-students`, {
            method: 'GET',
        });
        console.log('Res from data ', res);

        // Check if the response is ok (status in the range 200-299)
        // if (!res.ok) {
        //     throw res;
        // }
        return res;
    } catch (err) {
        console.log('error  ', err);
        throw err;
    }
};
export const verifyResponse = async (transactionId: string | null | undefined) => {
    try {
        const res = await clientFetch(`payment/verify-response?transactionId=${transactionId}`, {
            method: 'GET',
        });
        console.log('Res from data ', res);

        // Check if the response is ok (status in the range 200-299)
        // if (!res.ok) {
        //     throw res;
        // }
        return res;
    } catch (err) {
        console.log('error  ', err);
        throw err;
    }
};

export const fetchUserWithTransactionId = async (transactionId: string) => {
    try {
        const res = await clientFetch(`booking/user/${transactionId}`, {
            method: 'GET',
        });
        console.log('res from rgitser api ', res);

        // Check if the response is ok (status in the range 200-299)
        if (res.statusCode !== 200) {
            throw res;
        }
        return res;
    } catch (err) {
        console.log('error  ', err);
        throw err;
    }
};
