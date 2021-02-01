import { DtoUser } from '@database/models';
import { Database } from '@nozbe/watermelondb';
import { TABLES } from './schema';
import SchemaManager from './schema-base';

export default class UserSchemaManager extends SchemaManager<DtoUser> {}

export const _mUserSchema = new UserSchemaManager(TABLES.USER);
