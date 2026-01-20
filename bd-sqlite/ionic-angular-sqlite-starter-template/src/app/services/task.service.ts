import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from './sqlite.service';
import { Item } from '../models/item';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    public items: Item[] = [];
    public categories: string[] = [];
    private db!: SQLiteDBConnection;
    private readonly DB_NAME = 'inventario_db';
    private readonly initialData = [
        {
            cat: 'Alimentación',
            items: [{ name: 'Latas de Conserva (Atún)', stock: 5 }, { name: 'Garrafas de Agua (5L)', stock: 10 }, { name: 'Arroz (Paquetes)', stock: 20 }, { name: 'Miel', stock: 15 }]
        },
        {
            cat: 'Medicinas',
            items: [{ name: 'Botiquín Primeros Auxilios', stock: 5 }, { name: 'Antibióticos', stock: 10 }, { name: 'Vendas', stock: 20 }, { name: 'Alcohol', stock: 15 }],
        },
        {
            cat: 'Herramientas',
            items: [{ name: 'Multiherramienta', stock: 5 }, { name: 'Cinta Americana', stock: 10 }, { name: 'Martillo', stock: 20 }, { name: 'Cuerda', stock: 15 }],
        },
        {
            cat: 'Defensa',
            items: [{ name: 'Spray Pimienta', stock: 5 }, { name: 'Navaja Táctica', stock: 10 }, { name: 'Alarma Sonora', stock: 20 }],
        },
        {
            cat: 'Energía',
            items: [{ name: 'Baterías AA', stock: 5 }, { name: 'Linterna LED', stock: 10 }, { name: 'Powerbank Solar', stock: 20 }],
        }
    ];

    constructor(private sqliteService: SQLiteService) { }

    /**
     * Initializes the plugin, opens the database, and creates the table.
     */
    async initializeFull() {
        await this.sqliteService.initializePlugin();

        if (this.sqliteService.platform === 'web') {
            await this.sqliteService.initWebStore();
        }

        this.db = await this.sqliteService.openDatabase(this.DB_NAME, false, 'no-encryption', 1, false);

        const sqlCreateTableItems = `
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );`;

        const sqlCreateTableCategories = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
      );`;

        await this.db.execute(sqlCreateTableCategories);
        await this.db.execute(sqlCreateTableItems);

        //Verificar si la BD ya tiene datos 
        const resCount = await this.db.query('SELECT count(*) as count FROM categories');
        const count = resCount.values?.[0].count;

        if (count === 0) {
            await this.loadInitialData();
        }

        // 5. Load initial tasks
        await this.loadItems();
    }

    private async loadInitialData() {
        for (const data of this.initialData) {
            await this.addCategory(data.cat);
            const categoryId: number = await this.getCategoryIdByName(data.cat);

            if (categoryId) {
                for (const item of data.items) {
                    await this.addItem(item.name, item.stock, categoryId);
                }
            } else {
                console.error('Error al obtener la categoría');
            }
        }
    }

    async loadItems() {
        const sql = `
        SELECT items.*, categories.name as category_name 
        FROM items 
        INNER JOIN categories ON items.category_id = categories.id
    `;
        const res = await this.db.query(sql);
        this.items = (res.values as Item[]).map(t => ({
            id: t.id,
            name: t.name,
            stock: t.stock,
            category_id: t.category_id,
            category_name: t.category_name
        }));
    }
    async addItem(name: string, stock: number, category_id: number) {
        const sql = 'INSERT INTO items (name, stock, category_id) VALUES (?, ?, ?)';
        await this.db.run(sql, [name, stock, category_id]);
        await this.saveAndRefresh();
    }

    async addCategory(name: string) {
        const sql = 'INSERT INTO categories (name) VALUES (?)';
        await this.db.run(sql, [name]);
        await this.saveAndRefresh();
    }

    async getCategoryIdByName(name: string) {
        const categories = await this.getCategories();
        return categories.find(c => c.name === name)?.id;
    }

    async getCategories() {
        const categories = await this.db.query('SELECT * FROM categories');
        return categories.values || [];
    }

    async getCategorieNameById(id: number) {
        const categories = await this.db.query('SELECT name FROM categories WHERE id = ?', [id]);
        return categories.values?.[0].name;
    }

    async updateItem(item: Item) {
        const sql = 'UPDATE items SET name = ?, stock = ?, category_id = ? WHERE id = ?';
        await this.db.run(sql, [item.name, item.stock, item.category_id, item.id]);
        await this.saveAndRefresh();
    }

    async deleteItem(id: number) {
        const sql = 'DELETE FROM items WHERE id = ?';
        await this.db.run(sql, [id]);
        await this.saveAndRefresh();
    }

    async searchItems(event: Event) {
        const searchText = (event.target as HTMLInputElement).value;

        const sql = `
        SELECT items.*, categories.name as category_name
        FROM items
        INNER JOIN categories ON items.category_id = categories.id
        WHERE items.name LIKE ? OR categories.name LIKE ?
    `;
        const res = await this.db.query(sql, [`%${searchText}%`, `%${searchText}%`]);
        this.items = (res.values as Item[]).map(t => ({
            id: t.id,
            name: t.name,
            stock: t.stock,
            category_id: t.category_id,
            category_name: t.category_name
        }));
    }

    /**
     * Syncs database to browser storage (IndexedDB) on web platform
     */
    private async saveAndRefresh() {
        if (this.sqliteService.platform === 'web') {
            await this.sqliteService.sqliteConnection.saveToStore(this.DB_NAME);
        }
        await this.loadItems();
    }
}
