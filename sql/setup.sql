-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS github_users;
DROP TABLE IF EXISTS posts;

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  avatar TEXT
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content VARCHAR(255), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (content) VALUES 
  ('the tv is very good, the world is very bad: the 2022 story'),
  ('Guy on jeopardy was just introduced as a stay at home uncle'),
  ('email was a mistake. we shouldnt be able to communicate this quickly. if my husband died at Gettysburg, thats not my business until next spring.'),
  ('a shrimp? am i to accept, as gods own truth, that the seas very own abominable and chittering roach, was the one who took wok into hand and fried this rice?'),
  ('no offense but sometimes you can just tell if someone took gym class seriously. its such a specific vibe');

