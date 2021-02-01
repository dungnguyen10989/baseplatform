import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { FeatureStatus, FeatureType } from '../../../src/values/constants';
import { TABLES } from '../schemas/schema';

export default class DtoFeature extends Model {
  static table = TABLES.FEATURE;

  @field('name') name!: string;
  @field('icon') icon!: string;
  @field('title') title!: string;
  @field('params') params!: string;
  @field('description') description!: string;
  @field('status') status!: keyof FeatureStatus;
  @field('type') type!: keyof FeatureType;
}
