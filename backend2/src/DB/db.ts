import { Client } from '@neondatabase/serverless';
import { get } from 'node:http';

const getClient = (url: string) => new Client(url);

export interface InsertUserInput {
  email: string;
  name: string;
  password: string;
}

export interface InsertPostInput {
  title: string;
  content: string;
  authorId: number;
  publishedDate?: string,
  category_id? : number
}

export async function initDB(url: string) {
  const client = getClient(url);
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(1000) NOT NULL,
      content VARCHAR(10000) NOT NULL,
      publishedDate TIMESTAMP,
      authorId INTEGER NOT NULL,
      FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS comment (
      id SERIAL PRIMARY KEY,
      content VARCHAR(1000),
      publishedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      authorId INTEGER NOT NULL,
      blogId INTEGER NOT NULL,
      FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (blogId) REFERENCES posts(id) ON DELETE CASCADE
    );
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS rating (
      id SERIAL PRIMARY KEY,
      score INTEGER CHECK (score >= 1 AND score <= 5), 
      authorId INTEGER NOT NULL,
      blogId INTEGER NOT NULL,
      FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (blogId) REFERENCES posts(id) ON DELETE CASCADE,
      UNIQUE (authorId, blogId) 
    );
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS categories(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
`);
  await client.query(`
    ALTER TABLE posts
    ADD COLUMN category_id INT,
    ADD CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL;
`);

  await client.end()
}

export async function insertUser(input: InsertUserInput, url: string) {
  const client = getClient(url);
  await client.connect();
  try {
    const res = await client.query(
      `
      INSERT INTO users(email, name, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [input.email, input.name, input.password]
    );

    console.log("Inserted user:", res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error("insertUser failed:", err);
    throw err;
  }
  finally {
    await client.end();
  }
}


export async function insertPost(input: InsertPostInput, url: string) {
  const client = getClient(url);
  await client.connect();

  const { title, content, authorId, publishedDate ,category_id } = input;

  try {
    const res = await client.query(
      `INSERT INTO posts(title, content, authorId, publishedDate ,category_id)
       VALUES ($1, $2, $3, $4 ,$5) RETURNING *;`,
      [title, content, authorId, publishedDate ,category_id]
    );
    return res.rows;
  } catch (err) {
    console.error("Insert Post  Error:", err);
    throw err;
  } finally {
    await client.end();
  }
}
export interface UpdatePostInput {
  authorId: number;
  title: string;
  content: string;
}

export async function updatePost(input: UpdatePostInput, url: string) {
  const client = getClient(url);
  await client.connect();
  const { authorId, title, content } = input;
  try {
    const res = await client.query(`
    UPDATE posts
    SET title = $1,
        content = $2
    WHERE authorId = $3
    RETURNING *;
    `,
      [title, content, authorId]
    );
    return res.rows;
  }
  catch (e) {
    console.log("Update Post Error")
  }
  finally {
    await client.end();
  }
}

export async function getAllPosts(url: string) {
  const client = getClient(url);
  await client.connect();
  const res = await client.query(`
      SELECT posts.id ,posts.title , posts.content,posts.authorid,posts.category_id , users.email , users.name FROM posts
      JOIN users ON posts.authorid = users.id;
  `);
  await client.end();
  return res.rows;
}

export async function getPostByUserId(id: number, url: string) {
  const client = getClient(url);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT users.id , users.email , users.name, posts.title , posts.content FROM users
      JOIN posts ON users.id = posts.authorId
      WHERE users.id = $1;
        ` , [id]);
    return res.rows;
  }
  finally {
    await client.end();
  }
}

export async function findUser(email: string, url: string) {
  const client = getClient(url);
  try {
    await client.connect();
    const res = await client.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );

    return res.rows[0] || null;
  } catch (e: any) {
    console.error(" Error in findUser:", e.message);
    throw e;
  } finally {
    await client.end();
  }
}
export async function getUserByUSerId(id: number, url: string) {
  const client = getClient(url);
  try {
    await client.connect();
    const res = await client.query(
      `SELECT * FROM users
    WHERE id = $1`
      , [id]
    )
    return res.rows[0];
  }
  catch (e: any) {
    console.log("Error while geting User Detail by User ID")
    throw e;
  }
  finally {
    client.end();
  }
}
export async function getPostByPostId(id: number, url: string) {
  const client = getClient(url);
  try {
    await client.connect();
    const res = await client.query(
      `SELECT posts.id ,posts.title , posts.content,posts.authorid , users.email , users.name FROM posts
      JOIN users ON posts.authorid = users.id
      WHERE posts.id =$1`, [id]

    )
    console.log(res);
    return res.rows;
  }
  catch (e) {
    console.log("Error in getting post");

  }
  finally {
    await client.end();
  }
}

export async function createcomment(blogId: number, authorId: number, content: string, url: string) {
  const client = getClient(url);
  try {
    await client.connect();
    const res = await client.query(
      `INSERT INTO comment(content, authorId, blogId, publishedDate)
       VALUES ($1, $2, $3, NOW()) RETURNING *;`,
      [content, authorId, blogId]
    );

    return res.rows[0];
  } catch (e) {
    console.error("Error while creating comment:", e);
    return null;
  } finally {
    await client.end();
  }
}

export async function createrating(blogId: number, authorId: number, score: number, url: string) {
  const client = getClient(url);
  try {
    await client.connect();
    const res = await client.query(
      `INSERT INTO rating (score, authorId, blogId)
       VALUES ($1, $2, $3)
       ON CONFLICT (authorId, blogId) 
       DO UPDATE SET score = EXCLUDED.score
       RETURNING *;`,
      [score, authorId, blogId]
    );

    return res.rows[0];
  } catch (e: any) {
    console.error("Error in updating rating:", e.message);
    return null;
  } finally {
    await client.end();
  }
}


export async function getCommentByPostId(blogId: number, url: string) {
  const client = getClient(url);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT 
        c.id, 
        c.content, 
        c.publishedDate, 
        u.name AS "authorName"
      FROM comment c
      JOIN users u ON c.authorId = u.id
      WHERE c.blogId = $1
      ORDER BY c.publishedDate DESC;
    `, [blogId]);

    return res.rows;
  } catch (e) {
    console.error("Error in Getting Comments:", e);
    return []; // Return an empty array so the frontend doesn't crash
  } finally {
    await client.end();
  }
}

export async function getRatingByPostId(blogId: number, url: string) {
  const client = getClient(url);
  try {
    await client.connect();
    const res = await client.query(`
      SELECT 
        COALESCE(AVG(score), 0) AS "average", 
        COUNT(*) AS "total"
      FROM rating 
      WHERE blogId = $1;
    `, [blogId]);

    const stats = res.rows[0];
    return {
      average: parseFloat(stats.average).toFixed(1),
      total: parseInt(stats.total)
    };
  } catch (e) {
    console.error("Error in getting ratings:", e);
    return { average: "0.0", total: 0 };
  } finally {
    await client.end();
  }
}
export async function GetAllCategories(url: string) {
  const client = getClient(url);
  try {
    await client.connect(); 
    const res = await client.query(`
      SELECT * FROM categories;
    `);

    return res.rows;  
  } catch (e) {
    console.log("Error while Fetching All Categories", e);
    throw e;
  } finally {
    await client.end();
  }
}

export async function GetPostByCategories(url :string , category : number) {
  const client =  getClient(url);
  try{
    await client.connect();
    const res = await client.query(`
      SELECT * FROM posts 
      WHERE category_id = $1` , [category]);
      return res.rows;
  }catch(e){
    console.log("Error While Fetching Posts By Categories")
    throw e;
  }
  finally{
    client.end();
  }
}
