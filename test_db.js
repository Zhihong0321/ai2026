import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function runTest() {
    console.log('----------------------------------------');
    console.log('🔍 Testing Database Connection...');
    console.log('----------------------------------------');

    try {
        console.log(`📡 Connecting to: ${process.env.DATABASE_URL.split('@')[1]}`); // Mask credentials

        const client = await pool.connect();
        console.log('✅ Connection Established!');

        const res = await client.query('SELECT count(*) FROM ai2026_departments');
        console.log(`✅ Query Successful! Found ${res.rows[0].count} departments.`);

        const deptNames = await client.query('SELECT name FROM ai2026_departments LIMIT 3');
        console.log('📋 Sample Data:', deptNames.rows.map(r => r.name).join(', '));

        client.release();
        console.log('----------------------------------------');
        console.log('🎉 CONCLUSION: The App CAN read Postgres.');
        console.log('----------------------------------------');
    } catch (err) {
        console.error('❌ FAILURE:', err.message);
    } finally {
        await pool.end();
    }
}

runTest();
