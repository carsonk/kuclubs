-- UP

CREATE TABLE persons (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

CREATE TABLE faculty (
    id INTEGER PRIMARY KEY,
    person_id INT NOT NULL,
    department VARCHAR(255),
    FOREIGN KEY(person_id) REFERENCES persons(id)
);

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    person_id INT NOT NULL,
    class INT,
    FOREIGN KEY(person_id) REFERENCES persons(id)
);

CREATE TABLE clubs (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    photo_album_embed TEXT,
    date_founded DATE
);

CREATE TABLE events (
    id INTEGER PRIMARY KEY,
    club_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(255),
    name VARCHAR(255),
    FOREIGN KEY(club_id) REFERENCES clubs(id)
);

CREATE TABLE announcements (
    id INTEGER PRIMARY KEY,
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
