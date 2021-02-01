import { Model } from '@nozbe/watermelondb';
import { field, action } from '@nozbe/watermelondb/decorators';
import { HasManyAssociation } from '@nozbe/watermelondb/Model';

import { TABLES } from '../schemas/schema';

export default class DtoPost extends Model {
  static table = TABLES.POST;
  static associations = {
    [TABLES.COMMENT]: {
      type: 'has_many',
      foreignKey: 'post_id',
    } as HasManyAssociation,
    [TABLES.USER]: {
      type: 'has_many',
      foreignKey: 'post_id',
    } as HasManyAssociation,
  };

  @field('post_id') post_id!: string;
  @field('title') title!: string;
  @field('body') body!: string;

  @action async addComment(body: string, title: string) {
    return await this.collections.get<DtoPost>('post').create((post) => {
      post.title = title;
      post.body = body;
    });
  }
}
