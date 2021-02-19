import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { TABLES } from '../schemas/schema';

export default class DtoConfig extends Model {
  static table = TABLES.CONFIG;

  @field('name') name!: string;
  @field('json') json!: string;
}
