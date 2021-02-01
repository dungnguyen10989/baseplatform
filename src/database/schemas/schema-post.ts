import { DtoPost } from '@database/models';
import { Database, Q } from '@nozbe/watermelondb';
import { TABLES } from './schema';
import SchemaManager from './schema-base';

export default class PostSchemaManager extends SchemaManager<DtoPost> {
  constructor() {
    super(TABLES.POST);
  }

  findRecordByPostId = async (db: Database, id: string) => {
    const collections = await this.collections(db);
    const query = await collections.query(Q.where('post_id', id)).fetch();
    const record = query[0];
    this.log(`[${record ? 'FOUND' : 'NOT FOUND'}]  "post_id: ${id}" `, record);
    return record as DtoPost | undefined;
  };

  addPost = async (db: Database, record: Partial<DtoPost>) => {
    if (!record.post_id) {
      return this.log(`[ADD FAILURE] "post_id: ${record.post_id}" invalid`);
    }
    const exists = await this.findRecordByPostId(db, record.post_id);
    if (exists) {
      return this.log(
        `[ADD FAILURE] "post_id: ${record.post_id}" has been exist`,
        exists,
      );
    }
    return this.addRecord(db, record);
  };
}

export const _mPostSchema = new PostSchemaManager();
