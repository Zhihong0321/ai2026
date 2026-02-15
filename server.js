import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/daily_report',
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('rlwy.net') ? { rejectUnauthorized: false } : false
});

// Test DB Connection on Start
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error acquiring client', err.stack);
    } else {
        console.log('✅ Database connected successfully');
        client.query('SELECT NOW()', (err, result) => {
            release();
            if (err) {
                return console.error('❌ Error executing query', err.stack);
            }
            console.log('✅ Database Time:', result.rows[0].now);
        });
    }
});

// Serve static files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));

    // Serve index.html for any unknown routes (SPA support)
    app.get(/.*/, (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        }
    });
}

// API Routes

// Health Check
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'healthy', database: 'connected' });
    } catch (err) {
        console.error('Health check failed:', err);
        res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: err.message });
    }
});

// Get all departments
app.get('/api/departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ai2026_departments ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get department details with plans and reports
app.get('/api/departments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deptResult = await pool.query('SELECT * FROM ai2026_departments WHERE id = $1', [id]);
        const plansResult = await pool.query('SELECT * FROM ai2026_department_plans WHERE department_id = $1', [id]);
        const reportsResult = await pool.query('SELECT * FROM ai2026_work_reports WHERE department_id = $1 ORDER BY report_date DESC LIMIT 5', [id]);

        if (deptResult.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.json({
            department: deptResult.rows[0],
            plans: plansResult.rows,
            reports: reportsResult.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all recent reports
app.get('/api/reports', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT r.*, d.name as dept_name, d.short_name as dept_short_name
      FROM ai2026_work_reports r
      JOIN ai2026_departments d ON r.department_id = d.id
      ORDER BY r.report_date DESC
      LIMIT 20
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a report
app.post('/api/reports', async (req, res) => {
    const { title, description, department_id, report_date, image_url, youtube_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ai2026_work_reports (title, description, department_id, report_date, image_url, youtube_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, department_id, report_date, image_url, youtube_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
