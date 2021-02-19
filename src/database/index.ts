import { Database, appSchema, tableSchema } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { DtoConfig, DtoFeature } from './models/';
import { TABLES } from './schemas/schema';

const { name } = require('../../app.json');

const _appSchema = appSchema({
  version: 5,
  tables: [
    tableSchema({
      name: TABLES.FEATURE,
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'title', type: 'string', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'params', type: 'string', isOptional: true },
        { name: 'status', type: 'string', isOptional: true },
        { name: 'type', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: TABLES.CONFIG,
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
        { name: 'json', type: 'string' },
      ],
    }),
  ],
});

const adapter = new SQLiteAdapter({
  schema: _appSchema,
  dbName: `db.watermelon.${name}`,
  synchronous: true,
  actionsEnabled: true,
} as any);

export default new Database({
  adapter,
  modelClasses: [DtoFeature, DtoConfig],
  actionsEnabled: true,
});
