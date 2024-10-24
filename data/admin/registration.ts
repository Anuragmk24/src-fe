import { clientFetch } from '@/lib/api';

export const fetchBookings = async (token:string,start:number,limit:number) => {
    try {
        const res = await clientFetch(`booking/fetch?start=${start}&limit=${limit}`, {
            method: 'GET',
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log("res from data ",res )
        // Check if the response is ok (status in the range 200-299)
        if (res.statusCode !== 200) {
            throw res;
        }
        return res;
    } catch (err) {
        console.log('error fetching booking ', err);
        throw err;
    }
};
