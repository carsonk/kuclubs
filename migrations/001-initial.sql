-- UP

CREATE TABLE persons (
    id INT PRIMARY KEY, 
    email VARCHAR(255) NOT NULL, 
    first_name VARCHAR(255) NOT NULL, 
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE faculty (
    id INT PRIMARY KEY,
    person_id INT NOT NULL,
    department VARCHAR(255),
    FOREIGN KEY(person_id) REFERENCES persons(id)
);

CREATE TABLE students (
    id INT PRIMARY KEY,
    person_id INT NOT NULL,
    class INT,
    FOREIGN KEY(person_id) REFERENCES persons(id)
);

CREATE TABLE clubs (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date_founded DATE
);

CREATE TABLE events (
    id INT PRIMARY KEY,
    club_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(255),
    name VARCHAR(255),
    FOREIGN KEY(club_id) REFERENCES clubs(id)
);

CREATE TABLE announcements (
    id INT PRIMARY KEY,
    club_id INT NOT NULL,
    time DATETIME,
    title VARCHAR(255),
    description TEXT,
    person_id INT NOT NULL,
    FOREIGN KEY(club_id) REFERENCES clubs(id),
    FOREIGN KEY(person_id) REFERENCES persons(id)
);

-- DOWN

DROP TABLE persons;
DROP TABLE faculty;
DROP TABLE students;
DROP TABLE clubs;
DROP TABLE events;
DROP TABLE announcements;

