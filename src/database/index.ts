import { Database, appSchema, tableSchema } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import DtoPost from './models/dto-post';
import DtoComment from './models/dto-comment';
import DtoUser from './models/dto-user';
import { TABLES } from './schemas/schema';
import { DtoFeature } from './models';

const { name } = require('../../app.json');

const _appSchema = appSchema({
  version: 4,
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
      name: TABLES.POST,
      columns: [
        { name: 'post_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string', isOptional: true },
        { name: 'body', type: 'string' },
        { name: 'is_pinned', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: TABLES.COMMENT,
      columns: [
        { name: 'body', type: 'string' },
        { name: 'post_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: TABLES.USER,
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'avatar', type: 'string', isIndexed: true },
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
  modelClasses: [DtoFeature, DtoPost, DtoComment, DtoUser],
  actionsEnabled: true,
});
