import { DtoConfig } from '@database/models/';
import { Database, Q } from '@nozbe/watermelondb';
import { JsonPrototype, makeCancelablePromise } from '@utils';
import { TABLES } from './schema';
import SchemaManager from './schema-base';

export default class ConfigSchemaManager extends SchemaManager<DtoConfig> {
  getConfig = (db: Database, configName: string) => {
    const promise = new Promise(async (resolve) => {
      try {
        if (!configName) {
          throw 'Config name cannot be null';
        }
        const collections = await this.collections(db);
        const query = await collections
          .query(Q.where('name', configName))
          .fetch();
        const resultObj = JsonPrototype.tryParse(query[0]?.json);
        this.log(`[GET CONFIG ${configName}] SUCCESS`, resultObj);
        resolve({ name: configName, json: resultObj });
      } catch (error) {
        this.logError(`[GET CONFIG ${configName}] ERROR`, error);
        resolve(undefined);
      }
    }) as Promise<any>;

    return makeCancelablePromise(promise);
  };

  getConfigJson = (db: Database, configName: string) => {
    const promise = new Promise(async (resolve) => {
      try {
        if (!configName) {
          throw 'Config name cannot be null';
        }
        const collections = await this.collections(db);
        const query = await collections
          .query(Q.where('name', configName))
          .fetch();
        if (!query[0] || !query[0].json) {
          throw 'Config does not exist';
        }
        resolve(query[0]);
      } catch (error) {
        this.logError(`[GET CONFIG ${configName}] ERROR`, error);
        resolve(undefined);
      }
    }) as Promise<DtoConfig | undefined>;

    return makeCancelablePromise(promise);
  };

  findConfigByName = async (db: Database, name: string) => {
    const collections = this.collections(db);
    const query = await collections.query(Q.where('name', name)).fetch();
    const target = await this.findRecordById(db, query[0]?.id);
    return target;
  };

  addOrUpdateConfig = (db: Database, configName: string, newValue: any) => {
    const promise = new Promise(async (resolve) => {
      try {
        const json = JsonPrototype.tryStringify(newValue);
        const collections = this.collections(db);
        const query = await collections
          .query(Q.where('name', configName))
          .fetch();
        const target = await this.findRecordById(db, query[0]?.id);
        if (target) {
          db.action(async () => {
            const value = await target.update((newRecord) => {
              newRecord.json = json;
            });
            this.log('[UPDATE SUCCESS]', value);
            resolve(true);
          });
        } else {
          db.action(async () => {
            const value = await collections.create((newRecord) => {
              newRecord.json = json;
              newRecord.name = configName;
            });
            this.log('[ADD SUCCESS]', value);
            resolve(true);
          });
        }
      } catch (error) {
        this.logError('[ADD/UPDATE FAILURE]', error);
        resolve(false);
      }
    });

    return makeCancelablePromise(promise);
  };

  addOrUpdateMulti = (
    db: Database,
    recs: Array<{ name: string; value: any }>,
  ) => {
    const collections = this.collections(db);
    const promise = new Promise(async (resolve) => {
      try {
        const queries = recs.map((i) => {
          return collections.query(Q.where('name', i.name)).fetch();
        });
        const dataQueries = await Promise.all(queries);
        const targets = await Promise.all(
          dataQueries.map((i) => this.findRecordById(db, i[0]?.id)),
        );
        db.action(async () => {
          await Promise.all(
            targets.map(async (target, index) => {
              if (target) {
                await target.update((newRecord) => {
                  newRecord.json = JsonPrototype.tryStringify(
                    recs[index].value,
                  );
                });
                this.log(
                  `[UPDATE MULTIPLE ${recs[index].name} SUCCESS]`,
                  target,
                );
              } else {
                const value = await collections.create((newRecord) => {
                  newRecord.json = JsonPrototype.tryStringify(
                    recs[index].value,
                  );
                  newRecord.name = recs[index].name;
                });
                this.log(`[ADD MULTIPLE ${recs[index].name} SUCCESS]`, value);
              }
            }),
          );
          resolve(true);
        });
      } catch (error) {
        this.logError('[ADD/UPDATE MULTI FAILURE]', error);
        resolve(false);
      }
    });

    return makeCancelablePromise(promise);
  };

  deleteConfig = (db: Database, name: string) => {
    const promise = new Promise(async (resolve) => {
      try {
        const collections = this.collections(db);
        const query = await collections.query(Q.where('name', name)).fetch();
        const find = query[0];
        return this.deleteRecord(db, find);
      } catch (error) {
        this.logError('[DELETE FAILURE]', error);
        resolve(undefined);
      }
    });

    return makeCancelablePromise(promise);
  };
}

export const mConfigSchema = new ConfigSchemaManager(TABLES.CONFIG);
