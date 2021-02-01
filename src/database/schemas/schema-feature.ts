import DtoFeature from '@database/models/dto-feature';
import { Database, Q } from '@nozbe/watermelondb';
import { PrototypeManager } from '@utils/prototype';
import { TABLES } from './schema';
import SchemaManager from './schema-base';

export default class FeatureSchemaManager extends SchemaManager<DtoFeature> {
  getFeature = (db: Database, code: string): Promise<DtoFeature> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!code) {
          throw 'Feature code cannot be null';
        }
        const collections = await this.collections(db);
        const query = await collections.query(Q.where('code', code)).fetch();
        this.log(`[GET FEATURE ${code}] SUCCESS`, query[0]);

        resolve(query[0]);
      } catch (error) {
        this.log(`[GET FEATURE ${code}] ERROR`, error, error.message);
        reject(error);
      }
    });
  };

  getFeatureParams = (db: Database, code: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const feature = await this.getFeature(db, code);
        if (!feature) {
          return resolve(undefined);
        }
        const { params } = feature;
        const paramsObj = PrototypeManager.json.tryParse(params);
        this.log(`[GET FEATURE PARAMS ${code}] SUCCESS`, paramsObj);
        resolve(paramsObj);
      } catch (error) {
        this.log(`[GET FEATURE PARAMS ${code}] ERROR`, error);
        reject(error);
      }
    });
  };
}

export const _mFeatureSchema = new FeatureSchemaManager(TABLES.FEATURE);
