CREATE TABLE IF NOT EXISTS ai2026_departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    icon VARCHAR(50),
    hod_name VARCHAR(255),
    hod_title VARCHAR(255),
    hod_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai2026_department_plans (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES ai2026_departments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai2026_work_reports (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES ai2026_departments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_date DATE NOT NULL,
    image_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Departments
INSERT INTO ai2026_departments (name, short_name, icon, hod_name, hod_title) VALUES
('Operations & Maintenance', 'O&M', 'settings', 'John Doe', 'Head of O&M'),
('Sales', 'SALES', 'handshake', 'Mark Henderson', 'Head of Sales'),
('Finance', 'FINANCE', 'payments', 'Jane Smith', 'CFO'),
('Administration', 'ADMIN', 'business_center', 'Admin User', 'Head of Admin'),
('SEDA', 'SEDA', 'eco', 'Green Keeper', 'Head of SEDA'),
('Customer Service', 'CS', 'support_agent', 'Sarah Connor', 'Head of CS'),
('Human Resources', 'HR', 'groups', 'Mike Ross', 'CHRO'),
('Engineering', 'ENG', 'precision_manufacturing', 'Tony Stark', 'Chief Engineer'),
('Control & Instrumentation', 'C&I', 'memory', 'Steve Jobs', 'Head of C&I'),
('Information Technology', 'IT', 'terminal', 'Bill Gates', 'CTO'),
('Project Management', 'PROJECT', 'assignment', 'Peter Parker', 'Project Lead'),
('Procurement', 'PROC', 'shopping_cart', 'Bruce Wayne', 'Head of Procurement'),
('Efficiency', 'EFF', 'speed', 'Barry Allen', 'Efficiency Expert'),
('Culture', 'CULTURE', 'favorite', 'Diana Prince', 'Culture Lead')
ON CONFLICT DO NOTHING;

-- Verify data was inserted (for debugging)
-- SELECT * FROM ai2026_departments;
