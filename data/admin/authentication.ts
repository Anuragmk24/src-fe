import { clientFetch } from '@/lib/api';

export const signIn = async (username: any, password: string) => {
    try {
        const res = await clientFetch(`auth/admin/login`, {
            method: 'POST',
            body: { username, password },
        });

        // Check if the response is ok (status in the range 200-299)
        if (!res.ok) {
            throw res;
        }
        return res;
    } catch (err) {
        console.log('error singin ', err);
        throw err;
    }
};
