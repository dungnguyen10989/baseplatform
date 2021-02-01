import { Model, Relation } from '@nozbe/watermelondb';
import { relation } from '@nozbe/watermelondb/decorators';
import { BelongsToAssociation } from '@nozbe/watermelondb/Model';

import { DtoComment, DtoPost } from '.';
import { TABLES } from '../schemas/schema';

export default class DtoUser extends Model {
  static table = TABLES.USER;
  static associations = {
    [TABLES.POST]: {
      type: 'belongs_to',
      key: 'post_id',
    } as BelongsToAssociation,
    [TABLES.COMMENT]: {
      type: 'belongs_to',
      key: 'comment_id',
    } as BelongsToAssociation,
  };

  @relation(TABLES.POST, 'author_id') post!: Relation<DtoPost>;
  @relation(TABLES.COMMENT, 'comment_id') comment!: Relation<DtoComment>;
}
