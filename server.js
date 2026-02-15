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

// Database Connection
// SSL is required for Railway and most cloud Postgres providers
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get(/.*/, (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        }
    });
}

app.get('/api/departments', async (req, res) => {
    const result = await pool.query('SELECT * FROM ai2026_departments ORDER BY id ASC');
    res.json(result.rows);
});

app.get('/api/departments/:id', async (req, res) => {
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
});

app.get('/api/reports', async (req, res) => {
    const result = await pool.query(`
      SELECT r.*, d.name as dept_name, d.short_name as dept_short_name
      FROM ai2026_work_reports r
      JOIN ai2026_departments d ON r.department_id = d.id
      ORDER BY r.report_date DESC
      LIMIT 20
    `);
    res.json(result.rows);
});

app.post('/api/reports', async (req, res) => {
    const { title, description, department_id, report_date, image_url, youtube_url } = req.body;
    const result = await pool.query(
        'INSERT INTO ai2026_work_reports (title, description, department_id, report_date, image_url, youtube_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, department_id, report_date, image_url, youtube_url]
    );
    res.status(201).json(result.rows[0]);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
