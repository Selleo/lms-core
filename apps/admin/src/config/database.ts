import { Adapter, DatabaseMetadata } from "@adminjs/sql";

export class DatabaseService {
  private adapter: Adapter;
  private db: DatabaseMetadata;

  constructor(connectionString: string, database: string) {
    this.adapter = new Adapter("postgresql", { connectionString, database });
  }

  async init() {
    this.db = await this.adapter.init();
    return this;
  }

  getResource(tableName: string) {
    return this.db.table(tableName);
  }
}
