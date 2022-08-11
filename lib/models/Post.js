const pool = require('../utils/pool');

module.exports = class Post {
  id;
  content;
  created_at;

  constructor({ id, content, created_at }) {
    this.id = id;
    this.content = content;
    this.created_at = created_at;
  }
  //get all posts
  static async getAll() {
    const { rows } = await pool.query('SELECT content, created_at FROM posts');
    return rows.map((row) => new Post(row));
  }
  //create new post
  static async insert({ content }) {
    const { rows } = await pool.query(
      `
        INSERT INTO posts (content)
        VALUES ($1)
        RETURNING *
    `,
      [content]
    );
    return new Post(rows[0]);
  }
};
