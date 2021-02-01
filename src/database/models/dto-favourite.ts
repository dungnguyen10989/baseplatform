import { Model, Relation } from '@nozbe/watermelondb';
import { relation } from '@nozbe/watermelondb/decorators';
import { BelongsToAssociation } from '@nozbe/watermelondb/Model';
import { DtoPost, DtoUser } from '.';
import { TABLES } from '../schemas/schema';

export default class DtoComment extends Model {
  static table = TABLES.COMMENT;
  static associations = {
    [TABLES.POST]: {
      type: 'belongs_to',
      key: 'post_id',
    } as BelongsToAssociation,
    [TABLES.USER]: {
      type: 'belongs_to',
      key: 'comment_id',
    } as BelongsToAssociation,
  };

  @relation(TABLES.POST, 'post_id') post!: Relation<DtoPost>;
  @relation(TABLES.USER, 'post_id') user!: Relation<DtoUser>;
}
