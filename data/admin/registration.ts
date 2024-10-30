import { clientFetch } from '@/lib/api';

export const fetchBookings = async (token:string,start:number,limit:number) => {
    try {
        const res = await clientFetch(`booking/fetch?start=${start}&limit=${limit}`, {
            method: 'GET',
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

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

export const toggleAttendeeStatus = async (token:string,userId:string) => {
    try {
        const res = await clientFetch(`admin/toggle-attendee-status/${userId}`, {
            method: 'PUT',
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

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

