export interface CodeFile {
  filename: string;
  language: string;
  category: 'DBMS (MySQL)' | 'OOPS Core' | 'Java JDBC & DAO' | 'Servlets' | 'Viva & ER Notes';
  description: string;
  code: string;
}

export const PROJECT_CODE_FILES: CodeFile[] = [
  {
    filename: 'hospital_db.sql',
    language: 'sql',
    category: 'DBMS (MySQL)',
    description: 'Complete MySQL database schema with DDL, Primary Keys, Foreign Keys, Constraints, and sample DML records.',
    code: `-- =====================================================================
-- HOSPITAL MANAGEMENT SYSTEM - DATABASE SCHEMA (DBMS MINI PROJECT)
-- Database: MySQL 8.0 / MariaDB
-- =====================================================================

DROP DATABASE IF EXISTS hospital_db;
CREATE DATABASE hospital_db;
USE hospital_db;

-- 1. Admin Users Table (For System Authentication)
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    head_doctor_name VARCHAR(100),
    description TEXT
);

-- 3. Doctors Table (Demonstrates 1:M relationship with Appointments)
CREATE TABLE doctors (
    doctor_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL CHECK (experience_years >= 0),
    opd_timings VARCHAR(100) NOT NULL,
    room_no VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('Available', 'On Duty', 'In Surgery', 'On Leave') DEFAULT 'Available',
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Patients Table (Stores Master Demographic & Emergency Data)
CREATE TABLE patients (
    patient_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 130),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT NOT NULL,
    emergency_contact VARCHAR(100) NOT NULL,
    allergies VARCHAR(255) DEFAULT 'None',
    status ENUM('Outpatient', 'Inpatient', 'Discharged') DEFAULT 'Outpatient',
    registered_at DATE NOT NULL
);

-- 5. Appointments Table (Foreign Keys to Patients and Doctors)
CREATE TABLE appointments (
    appointment_id VARCHAR(20) PRIMARY KEY,
    token_no VARCHAR(10) NOT NULL,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    status ENUM('Scheduled', 'In-Consultation', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    symptoms TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_app_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE RESTRICT
);

-- 6. Medical Records Table (Clinical History, Vitals & Prescriptions)
CREATE TABLE medical_records (
    record_id VARCHAR(20) PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id VARCHAR(20) NOT NULL,
    visit_date DATE NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    blood_pressure VARCHAR(20),
    pulse_rate VARCHAR(20),
    temperature VARCHAR(20),
    spo2 VARCHAR(20),
    weight VARCHAR(20),
    complaints TEXT,
    clinical_notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rec_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE RESTRICT
);

-- 7. Prescriptions Table (1:M with Medical Records)
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id VARCHAR(20) NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    instructions TEXT,
    CONSTRAINT fk_presc_record FOREIGN KEY (record_id) REFERENCES medical_records(record_id) ON DELETE CASCADE
);

-- =====================================================================
-- INITIAL SEED DATA FOR DEMO / TESTING
-- =====================================================================

INSERT INTO admins (username, password_hash, full_name, email)
VALUES ('admin', 'admin123', 'Hospital Chief Administrator', 'admin@medicare.org');

INSERT INTO doctors (doctor_id, name, department, specialization, qualification, experience_years, opd_timings, room_no, phone, email, status, consultation_fee)
VALUES 
('DOC-201', 'Dr. Suresh K. Rao', 'Cardiology', 'Interventional Cardiologist', 'MBBS, MD, DM (Cardio)', 16, '09:00 AM - 01:00 PM', 'OPD-101', '+91 98450 12345', 'dr.suresh@medicare.org', 'On Duty', 700.00),
('DOC-202', 'Dr. Sunita Sen', 'Pediatrics', 'Child & Adolescent Care', 'MBBS, DCH, MD (Pediatrics)', 11, '10:00 AM - 02:00 PM', 'OPD-104', '+91 98450 67890', 'dr.sunita@medicare.org', 'Available', 500.00),
('DOC-203', 'Dr. Amitav Banerjee', 'General Medicine', 'Internal Medicine & Diabetology', 'MBBS, MD (Gen Med)', 14, '08:30 AM - 12:30 PM', 'OPD-102', '+91 98450 33445', 'dr.amitav@medicare.org', 'On Duty', 500.00),
('DOC-204', 'Dr. Kavita Radhakrishnan', 'Orthopedics', 'Joint Replacement & Spine', 'MBBS, MS (Ortho)', 18, '02:00 PM - 06:00 PM', 'OPD-205', '+91 98450 55667', 'dr.kavita@medicare.org', 'In Surgery', 800.00);

INSERT INTO patients (patient_id, name, age, gender, blood_group, phone, email, address, emergency_contact, allergies, status, registered_at)
VALUES
('PID-1001', 'Aarav Sharma', 34, 'Male', 'O+', '+91 98765 43210', 'aarav.sharma@example.com', 'Bengaluru, Karnataka', '+91 98765 11111 (Wife)', 'Penicillin', 'Outpatient', '2026-10-15'),
('PID-1002', 'Priya Iyer', 28, 'Female', 'B+', '+91 98234 56789', 'priya.iyer@example.com', 'Chennai, Tamil Nadu', '+91 98234 99999 (Father)', 'None', 'Outpatient', '2026-10-18'),
('PID-1003', 'Rajesh Verma', 52, 'Male', 'A+', '+91 97112 34567', 'rajesh.verma@example.com', 'Rohini, New Delhi', '+91 97112 88888 (Son)', 'Sulfa Drugs', 'Inpatient', '2026-10-22');

INSERT INTO appointments (appointment_id, token_no, patient_id, doctor_id, appointment_date, time_slot, status, symptoms)
VALUES
('APT-301', 'TK-01', 'PID-1001', 'DOC-201', '2026-10-31', '09:30 AM', 'In-Consultation', 'Mild chest tightness upon exertion'),
('APT-302', 'TK-02', 'PID-1002', 'DOC-203', '2026-10-31', '10:15 AM', 'Scheduled', 'High fever for 3 days and throat pain');

-- Verification Query to test DB integrity
SELECT 
    a.token_no,
    p.name AS patient_name,
    d.name AS doctor_name,
    d.department,
    a.appointment_date,
    a.time_slot,
    a.status
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id;
`
  },
  {
    filename: 'DBConnection.java',
    language: 'java',
    category: 'Java JDBC & DAO',
    description: 'JDBC connection manager implementing the Singleton Pattern for robust MySQL database connectivity.',
    code: `package com.hospital.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DBConnection provides a centralized, reusable database connection manager.
 * Demonstrates: Design Patterns (Singleton Pattern) & JDBC Driver Architecture.
 */
public class DBConnection {
    // Database connection credentials
    private static final String URL = "jdbc:mysql://localhost:3306/hospital_db?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password"; // Replace with your MySQL root password
    private static final String DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";

    private static Connection connection = null;

    // Private constructor to prevent direct instantiation
    private DBConnection() {}

    /**
     * Returns an active java.sql.Connection instance.
     */
    public static Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                // 1. Load the MySQL JDBC Driver class
                Class.forName(DRIVER_CLASS);
                
                // 2. Establish connection to hospital_db
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("[DBConnection] Connected to MySQL hospital_db successfully.");
            }
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnection] MySQL JDBC Driver not found! Ensure mysql-connector-j.jar is in classpath.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("[DBConnection] Failed to connect to MySQL database!");
            e.printStackTrace();
        }
        return connection;
    }

    /**
     * Safely closes the database connection.
     */
    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                System.out.println("[DBConnection] Database connection closed.");
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
`
  },
  {
    filename: 'Person.java (OOPS Base Class)',
    language: 'java',
    category: 'OOPS Core',
    description: 'Abstract base class demonstrating Inheritance, Encapsulation, and Polymorphism in Java.',
    code: `package com.hospital.model;

/**
 * Base class representing a human entity in the hospital.
 * OOPS Concepts Illustrated:
 * 1. Abstraction (abstract class & abstract methods)
 * 2. Encapsulation (private variables with public getters/setters)
 * 3. Inheritance (Extended by Doctor and Patient classes)
 */
public abstract class Person {
    private String id;
    private String name;
    private String phone;
    private String email;

    // Default constructor
    public Person() {}

    // Parameterized constructor
    public Person(String id, String name, String phone, String email) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    // Encapsulation: Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    /**
     * Polymorphic method overridden by child classes (Doctor, Patient).
     */
    public abstract String getRoleDetails();

    @Override
    public String toString() {
        return "ID: " + id + ", Name: " + name + ", Phone: " + phone;
    }
}
`
  },
  {
    filename: 'Doctor.java',
    language: 'java',
    category: 'OOPS Core',
    description: 'Child class inheriting from Person, encapsulating department, OPD hours, and fee details.',
    code: `package com.hospital.model;

/**
 * Doctor entity extending Person (Inheritance).
 */
public class Doctor extends Person {
    private String department;
    private String specialization;
    private String qualification;
    private int experienceYears;
    private String opdTimings;
    private String roomNo;
    private String status;
    private double consultationFee;

    public Doctor() {
        super();
    }

    public Doctor(String id, String name, String phone, String email,
                  String department, String specialization, String qualification,
                  int experienceYears, String opdTimings, String roomNo,
                  String status, double consultationFee) {
        super(id, name, phone, email); // Calling parent constructor (super keyword)
        this.department = department;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experienceYears = experienceYears;
        this.opdTimings = opdTimings;
        this.roomNo = roomNo;
        this.status = status;
        this.consultationFee = consultationFee;
    }

    // Getters and Setters
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public String getOpdTimings() { return opdTimings; }
    public void setOpdTimings(String opdTimings) { this.opdTimings = opdTimings; }

    public String getRoomNo() { return roomNo; }
    public void setRoomNo(String roomNo) { this.roomNo = roomNo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }

    // Polymorphism: Overriding abstract method
    @Override
    public String getRoleDetails() {
        return "Doctor: " + getName() + " (" + department + " - " + specialization + ") Room: " + roomNo;
    }
}
`
  },
  {
    filename: 'Patient.java',
    language: 'java',
    category: 'OOPS Core',
    description: 'Child class inheriting from Person, encapsulating age, blood group, and emergency contact details.',
    code: `package com.hospital.model;

/**
 * Patient entity extending Person (Inheritance & Polymorphism).
 */
public class Patient extends Person {
    private int age;
    private String gender;
    private String bloodGroup;
    private String address;
    private String emergencyContact;
    private String allergies;
    private String status;
    private String registeredDate;

    public Patient() {
        super();
    }

    public Patient(String id, String name, String phone, String email,
                   int age, String gender, String bloodGroup, String address,
                   String emergencyContact, String allergies, String status, String registeredDate) {
        super(id, name, phone, email);
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.allergies = allergies;
        this.status = status;
        this.registeredDate = registeredDate;
    }

    // Getters and Setters
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(String registeredDate) { this.registeredDate = registeredDate; }

    // Polymorphism: Overriding abstract method
    @Override
    public String getRoleDetails() {
        return "Patient: " + getName() + " [" + getId() + "], Blood Group: " + bloodGroup + ", Status: " + status;
    }
}
`
  },
  {
    filename: 'PatientDAO.java',
    language: 'java',
    category: 'Java JDBC & DAO',
    description: 'Data Access Object executing SQL queries (INSERT, SELECT, UPDATE) via JDBC PreparedStatement.',
    code: `package com.hospital.dao;

import com.hospital.model.Patient;
import com.hospital.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * PatientDAO isolates database CRUD operations from the business logic.
 * Demonstrates: PreparedStatement (SQL Injection prevention), ResultSet traversal, and Exception Handling.
 */
public class PatientDAO {

    /**
     * Registers a new patient in the MySQL database.
     */
    public boolean addPatient(Patient p) {
        String sql = "INSERT INTO patients (patient_id, name, age, gender, blood_group, phone, email, address, emergency_contact, allergies, status, registered_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, p.getId());
            stmt.setString(2, p.getName());
            stmt.setInt(3, p.getAge());
            stmt.setString(4, p.getGender());
            stmt.setString(5, p.getBloodGroup());
            stmt.setString(6, p.getPhone());
            stmt.setString(7, p.getEmail());
            stmt.setString(8, p.getAddress());
            stmt.setString(9, p.getEmergencyContact());
            stmt.setString(10, p.getAllergies());
            stmt.setString(11, p.getStatus());
            stmt.setString(12, p.getRegisteredDate());

            int rowsInserted = stmt.executeUpdate();
            return rowsInserted > 0;

        } catch (SQLException e) {
            System.err.println("Error inserting patient: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Fetches all patients ordered by registration date.
     */
    public List<Patient> getAllPatients() {
        List<Patient> list = new ArrayList<>();
        String sql = "SELECT * FROM patients ORDER BY registered_at DESC";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Patient p = new Patient(
                    rs.getString("patient_id"),
                    rs.getString("name"),
                    rs.getString("phone"),
                    rs.getString("email"),
                    rs.getInt("age"),
                    rs.getString("gender"),
                    rs.getString("blood_group"),
                    rs.getString("address"),
                    rs.getString("emergency_contact"),
                    rs.getString("allergies"),
                    rs.getString("status"),
                    rs.getString("registered_at")
                );
                list.add(p);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * Counts total registered patients for the dashboard counter.
     */
    public int getTotalPatientCount() {
        String sql = "SELECT COUNT(*) FROM patients";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }
}
`
  },
  {
    filename: 'PatientServlet.java',
    language: 'java',
    category: 'Servlets',
    description: 'Java HTTP Servlet handling HTTP GET/POST requests from web forms to the MySQL database.',
    code: `package com.hospital.servlet;

import com.hospital.dao.PatientDAO;
import com.hospital.model.Patient;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;

/**
 * PatientServlet processes web requests for patient management.
 * Map this servlet to "/patients" or use annotations.
 */
@WebServlet(name = "PatientServlet", urlPatterns = {"/api/patients"})
public class PatientServlet extends HttpServlet {

    private PatientDAO patientDAO;

    @Override
    public void init() {
        this.patientDAO = new PatientDAO();
    }

    // Handles GET: Retrieve all patients as JSON or Forward to JSP
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        List<Patient> patients = patientDAO.getAllPatients();
        PrintWriter out = resp.getWriter();
        
        // Simple JSON serializer for beginner college projects without third-party dependencies
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < patients.size(); i++) {
            Patient p = patients.get(i);
            json.append(String.format(
                "{\"id\":\"%s\",\"name\":\"%s\",\"age\":%d,\"gender\":\"%s\",\"bloodGroup\":\"%s\",\"phone\":\"%s\",\"status\":\"%s\"}",
                p.getId(), p.getName(), p.getAge(), p.getGender(), p.getBloodGroup(), p.getPhone(), p.getStatus()
            ));
            if (i < patients.size() - 1) json.append(",");
        }
        json.append("]");
        out.print(json.toString());
        out.flush();
    }

    // Handles POST: Register a new patient
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        req.setCharacterEncoding("UTF-8");
        
        // Read form fields
        String name = req.getParameter("name");
        int age = Integer.parseInt(req.getParameter("age"));
        String gender = req.getParameter("gender");
        String bloodGroup = req.getParameter("bloodGroup");
        String phone = req.getParameter("phone");
        String email = req.getParameter("email");
        String address = req.getParameter("address");
        String emergencyContact = req.getParameter("emergencyContact");
        String allergies = req.getParameter("allergies");

        // Generate Patient ID (e.g., PID-1007)
        String patientId = "PID-" + (1000 + (int)(Math.random() * 9000));
        String registeredDate = LocalDate.now().toString();

        Patient newPatient = new Patient(
            patientId, name, phone, email, age, gender,
            bloodGroup, address, emergencyContact, allergies, "Outpatient", registeredDate
        );

        boolean success = patientDAO.addPatient(newPatient);

        if (success) {
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.sendRedirect("patients.html?status=success");
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().println("Failed to register patient in MySQL database.");
        }
    }
}
`
  },
  {
    filename: 'College_Viva_OOPS_DBMS_CheatSheet.md',
    language: 'markdown',
    category: 'Viva & ER Notes',
    description: 'Concise answers to likely college viva questions on OOPS, DBMS, Normalization, JDBC, and SQL.',
    code: `# Hospital Management System - OOPS & DBMS Mini Project Viva Guide

## 1. OOPS Concepts Applied in this Project

### A. Inheritance
- **Base Class:** \`Person\`
- **Derived Classes:** \`Doctor\` and \`Patient\`
- **Advantage:** Code reuse of common attributes (\`name\`, \`phone\`, \`email\`) using \`super()\` constructor.

### B. Encapsulation
- All instance variables in models are marked \`private\`.
- Access and modification are strictly controlled through public getters and setters with validation rules.

### C. Polymorphism
- The abstract method \`getRoleDetails()\` in \`Person\` is implemented differently by \`Doctor\` (returns department, room, OPD schedule) and \`Patient\` (returns ID, blood group, status).
- Method overloading can be shown in constructors.

### D. Abstraction
- The \`Person\` class is declared \`abstract\`. Nobody can instantiate a generic person; only concrete \`Doctor\` or \`Patient\` objects can be created.
- The DAO layer (\`PatientDAO\`, \`AppointmentDAO\`) abstracts raw SQL queries from the UI / Servlets.

---

## 2. DBMS Concepts & Schema Design

### A. Database Normalization (3NF)
- **1NF:** All attributes are atomic (no repeating groups of phone numbers or array columns).
- **2NF:** All non-key attributes are fully dependent on the primary key (\`doctor_id\`, \`patient_id\`).
- **3NF:** No transitive dependencies. \`appointments\` references \`patient_id\` and \`doctor_id\` instead of repeating the patient's full address or doctor's qualification.

### B. Keys & Referential Integrity
- **Primary Keys:** \`admin_id\`, \`doctor_id\`, \`patient_id\`, \`appointment_id\`, \`record_id\`.
- **Foreign Keys:**
  - \`appointments.patient_id\` references \`patients.patient_id\` (\`ON DELETE CASCADE\`).
  - \`appointments.doctor_id\` references \`doctors.doctor_id\` (\`ON DELETE RESTRICT\`).
  - \`prescriptions.record_id\` references \`medical_records.record_id\` (\`ON DELETE CASCADE\`).

### C. JDBC Architecture
1. **Driver Loading:** \`Class.forName("com.mysql.cj.jdbc.Driver");\`
2. **Connection:** \`DriverManager.getConnection(url, user, password);\`
3. **PreparedStatement:** Used to precompile SQL and sanitize input against SQL Injection attacks.
4. **Execution:** \`executeUpdate()\` for INSERT/UPDATE/DELETE and \`executeQuery()\` for SELECT.
5. **ResultSet:** Cursor-based traversal of table records.
`
  }
];
