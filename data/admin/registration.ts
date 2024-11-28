import { clientFetch } from '@/lib/api';

export const fetchBookings = async (token:string,start:number,limit:number,search:string) => {
    try {
        const res = await clientFetch(`booking/fetch?start=${start}&limit=${limit}&search=${search}`, {
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




export const fetchChaptersData = async (token:string,start:number,limit:number,search:string) => {
    try {
        const res = await clientFetch(`admin/chapters?start=${start}&limit=${limit}&search=${search}`, {
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


export const fetchParticipants = async (token:string,start:number,limit:number,search:string) => {
    try {
        const res = await clientFetch(`booking/participants?start=${start}&limit=${limit}&search=${search}`, {
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
