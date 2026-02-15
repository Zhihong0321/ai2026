import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// CONFIG
const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new pg.Pool(dbConfig);

// Startup Check
pool.connect().then(client => {
    return client.query('SELECT NOW()').then(res => {
        client.release();
        console.log('✅ Connected to database successfully');
    });
}).catch(err => {
    console.error('❌ Failed to connect to database on startup:', err.message);
});

// PROOF ROUTE
app.get('/proof', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as time, count(*) as count FROM ai2026_departments');
        res.send(`<h1>✅ PROOF: CONNECTED</h1><pre>${JSON.stringify(result.rows, null, 2)}</pre>`);
    } catch (err) {
        res.status(500).send(`<h1>❌ ERROR</h1><pre>${err.stack}</pre>`);
    }
});

// SERVE STATIC FILES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
}

// ============================================
// API ROUTES
// ============================================

app.get('/api/departments', async (req, res) => {
    try {
        console.log('GET /api/departments request received');
        const result = await pool.query('SELECT * FROM ai2026_departments ORDER BY id ASC');
        console.log(`Returning ${result.rows.length} departments`);
        res.json(result.rows);
    } catch (err) {
        console.error('ERROR in GET /api/departments:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/departments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deptResult = await pool.query('SELECT * FROM ai2026_departments WHERE id = $1', [id]);
        const plansResult = await pool.query('SELECT * FROM ai2026_department_plans WHERE department_id = $1', [id]);
        const reportsResult = await pool.query('SELECT * FROM ai2026_work_reports WHERE department_id = $1 ORDER BY report_date DESC LIMIT 5', [id]);

        if (deptResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });

        res.json({
            department: deptResult.rows[0],
            plans: plansResult.rows,
            reports: reportsResult.rows,
        });
    } catch (err) {
        console.error(`ERROR in GET /api/departments/${req.params.id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reports', async (req, res) => {
    try {
        console.log('GET /api/reports request received');
        const result = await pool.query(`
          SELECT r.*, d.name as dept_name, d.short_name as dept_short_name
          FROM ai2026_work_reports r
          JOIN ai2026_departments d ON r.department_id = d.id
          ORDER BY r.report_date DESC
          LIMIT 20
        `);
        console.log(`Returning ${result.rows.length} reports`);
        res.json(result.rows);
    } catch (err) {
        console.error('ERROR in GET /api/reports:', err);
        res.status(500).json({ error: err.message });
    }
});

// NEW: Get Single Report
app.get('/api/reports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT r.*, d.name as dept_name, d.short_name as dept_short_name
            FROM ai2026_work_reports r
            JOIN ai2026_departments d ON r.department_id = d.id
            WHERE r.id = $1
        `, [id]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Report not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`ERROR in GET /api/reports/${req.params.id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/reports', async (req, res) => {
    try {
        console.log('POST /api/reports received:', req.body);
        const { title, description, department_id, report_date, image_url, youtube_url } = req.body;
        const result = await pool.query(
            'INSERT INTO ai2026_work_reports (title, description, department_id, report_date, image_url, youtube_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, department_id, report_date, image_url, youtube_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('ERROR in POST /api/reports:', err);
        res.status(500).json({ error: err.message });
    }
});

// NEW: Update Report
app.put('/api/reports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image_url, youtube_url } = req.body;

        const result = await pool.query(
            'UPDATE ai2026_work_reports SET title = $1, description = $2, image_url = $3, youtube_url = $4 WHERE id = $5 RETURNING *',
            [title, description, image_url, youtube_url, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Report not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`ERROR in PUT /api/reports/${req.params.id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// NEW: Delete Report
app.delete('/api/reports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM ai2026_work_reports WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Report not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(`ERROR in DELETE /api/reports/${req.params.id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// CATCH-ALL ROUTE (Must be last)
if (process.env.NODE_ENV === 'production') {
    app.get(/.*/, (req, res) => {
        if (!req.path.startsWith('/api') && !req.path.startsWith('/proof')) {
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        }
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
