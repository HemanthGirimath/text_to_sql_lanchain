export const schema = `-- Schema for a School/University Database

-- Departments Table
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    building VARCHAR(100),
    phone_number VARCHAR(15)
);

-- Faculty Table
CREATE TABLE faculty (
    faculty_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    department_id INT REFERENCES departments(department_id) ON DELETE SET NULL,
    hire_date DATE NOT NULL
);

-- Students Table
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    date_of_birth DATE NOT NULL,
    enrollment_year INT NOT NULL,
    major_id INT REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Courses Table
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INT NOT NULL CHECK (credits > 0),
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE
);

-- Enrollment Table
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    grade CHAR(2) CHECK (grade IN ('A', 'B', 'C', 'D', 'F', 'W', NULL))
);`

