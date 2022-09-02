import db, { Datastore } from "./db"

export class UserStore {
    db: Datastore;

    constructor(db) {
        this.db = db
    }

    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY NOT NULL,
                username TEXT UNIQUE,
                token TEXT NOT NULL,
                tokenSecret TEXT NOT NULL,
                addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        `
        return this.db.run(sql)
    }

    insert(id: string, username: string, token: string, tokenSecret: string) {
        return this.db.run(
            'INSERT INTO users (id, username, token, tokenSecret) VALUES (?, ?, ?, ?)',
            [id, username, token, tokenSecret])
    }

    all() {
        return this.db.all(`SELECT * FROM users`)
    }

    findById(id) {
        return this.db.get(
            `SELECT * FROM users WHERE id = ?`,
            [id])
    }

    findByUsername(username) {
        return this.db.get(
            `SELECT * FROM users WHERE username = ?`,
            [username])
    }

    anyUser() {
        return this.db.get("SELECT * FROM users ORDER BY RANDOM() LIMIT 1")
    }
}

const store = new UserStore(db)
export default store;
