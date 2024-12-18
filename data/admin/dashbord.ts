import { clientFetch } from "@/lib/api";

export const fetchDashbordDataCounts = async (token:string) => {
    try {
        const res = await clientFetch(`admin/dashbord-data-counts`, {
            method: 'GET',
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log("res from data ",res )
        // Check if the response is ok (status in the range 200-299)
        // if (res.statusCode !== 200) {
        //     throw res;
        // }
        return res;
    } catch (err) {
        console.log('error fetching booking ', err);
        throw err;
    }
};

export const resendEmail = async (token:string,payload:any) => {
    try {
        const res = await clientFetch(`admin/send-email`, {
            method: 'POST',
            body:{payload},
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        console.log("res from data ",res )
        // Check if the response is ok (status in the range 200-299)
        // if (res.statusCode !== 200) {
        //     throw res;
        // }
        return res;
    } catch (err) {
        console.log('error fetching booking ', err);
        throw err;
    }
};


export const fetchCenters = async (token:string,state:string) => {
    console.log("state")
    try {
        const res = await clientFetch(`admin/center?state=${state}`, {
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

export const fetchAccomodationData = async (token:string,start:number,limit:number,search:string) => {
    try {
        const res = await clientFetch(`accomodation/fetch?start=${start}&limit=${limit}&search=${search}`, {
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