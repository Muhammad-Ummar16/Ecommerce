import axios from 'axios';

async function seed() {
    try {
        const { data } = await axios.post('https://ecommerce-2onz.vercel.app/api/users/signin', {
            email: 'admin@usman.pk',
            password: 'usman123'
        });
        const token = data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log("Seeding categories...");
        await axios.post('https://ecommerce-2onz.vercel.app/api/categories', { name: 'T-Shirts', description: 'Premium t-shirts' }, config);
        await axios.post('https://ecommerce-2onz.vercel.app/api/categories', { name: 'Trouser', description: 'Premium Trouser' }, config);
        await axios.post('https://ecommerce-2onz.vercel.app/api/categories', { name: 'Accessories', description: 'Extra items' }, config);
        console.log("Categories seeded successfully.");
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}
seed();
