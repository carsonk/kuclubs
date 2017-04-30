-- UP

CREATE TABLE membership (
    person_id INT NOT NULL,
    club_id INT NOT NULL,
    joined DATETIME,
    active TINYINT,
    officer_title VARCHAR(255),
    is_officer TINYINT,
    FOREIGN KEY(person_id) REFERENCES person(id),
    FOREIGN KEY(club_id) REFERENCES club(id)
);

CREATE TABLE advisers (
    person_id INT NOT NULL,
    club_id INT NOT NULL,
    FOREIGN KEY(person_id) REFERENCES person(id),
    FOREIGN KEY(club_id) REFERENCES club(id)
);

-- DOWN

DROP TABLE membership;    
DROP TABLE advisers;

