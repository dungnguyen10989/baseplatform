import { Database, Model, Q, Query } from '@nozbe/watermelondb';
import { ConsoleUtils } from '../../utils/log';
import { Subscription } from 'rxjs';

const updateObj = (target = {}, creatorObj = {}) => {
  const entries = Object.entries(creatorObj);
  entries.forEach((entry) => {
    const key = entry[0];
    const value = entry[1];
    (target as any)[key] = value;
  });
};

export default class SchemaManager<T extends Model> {
  readonly _table: string;

  constructor(table: string) {
    this._table = table;
  }

  log = (title: string, ...msg: any[]) => {
    ConsoleUtils.l(`[DB] - ${title} from Table ${this._table}`, msg);
  };

  logError = (title: string, ...msg: any[]) => {
    ConsoleUtils.le(`[DB] - ${title} from Table ${this._table}`, msg);
  };

  collections = (db: Database) => {
    return db.collections.get<T>(this._table);
  };

  fetchCount = (db: Database, query: Query<T>) => {
    return db.collections.get<T>(this._table).fetchCount(query);
  };

  findRecordById = async (db: Database, key: any) => {
    try {
      const collections = this.collections(db);
      const record = await collections.find(key);
      this.log(`[FIND SUCCESS] record with primary key ${key}`, record);
      return record;
    } catch (error) {
      this.log(
        '[FIND FAILURE]',
        `Record with primary key ${key} does not exists`,
      );
    }
  };

  query = (db: Database, conditions: Q.Clause) => {
    const collections = this.collections(db);
    return collections.query(conditions);
  };

  fetch = async (db: Database, conditions?: Q.Clause) => {
    const collections = this.collections(db);
    const query = conditions
      ? collections.query(conditions)
      : collections.query();
    const data = await query.fetch();
    this.log('[FETCH SUCCESS]', conditions, data);
    return data;
  };

  observe = (db: Database, conditions?: Q.Clause) => {
    const collections = this.collections(db);
    const query = conditions
      ? collections.query(conditions)
      : collections.query();
    return query.observe();
  };

  findAndObserve = (db: Database, id: string) => {
    return this.collections(db).findAndObserve(id);
  };

  subscribeQuery = (
    db: Database,
    subscription: (values: T[]) => void,
    conditions?: Q.Clause,
  ) => {
    const observe = this.observe(db, conditions);
    return observe.subscribe((values) => {
      this.log('[SUBSCRIBE QUERY SUCCESS]', conditions, values);
      subscription(values);
    });
  };

  subscribeRecord = (subscription: (values: T) => void, record?: T) => {
    return new Promise((resolve) => {
      if (!record) {
        this.log('[SUBSCRIBE RECORD FAILURE] record does not exists');
        return resolve(undefined);
      }
      const sub = record.observe().subscribe((newData) => {
        this.log('[SUBSCRIBE RECORD SUCCESS]', newData);
        subscription(newData);
      });
      resolve(sub);
    }) as Promise<Subscription | undefined>;
  };

  addRecord = (db: Database, record: Partial<T>) => {
    this.log('[REQUEST ADD]', record);
    return new Promise(async (resolve) => {
      try {
        const collections = this.collections(db);
        db.action<void>(async () => {
          try {
            const _record = await collections.create((target) => {
              updateObj(target._raw, record);
            });
            this.log('[ADD SUCCESS]', _record);
            resolve(_record);
          } catch (error) {
            this.log('[ADD ERROR]', error, error.message);
            resolve(undefined);
          }
        });
      } catch (error) {
        this.log('[ADD FAILURE]', error, error.message);
        resolve(undefined);
      }
    });
  };

  updateRecord = (db: Database, record: Partial<T>) => {
    this.log('[REQUEST UPDATE]', record);

    return new Promise(async (resolve) => {
      try {
        const _target = await this.findRecordById(db, record.id);
        if (!_target) {
          return resolve(false);
        }
        db.action<void>(async () => {
          await _target.update((target) => {
            updateObj(target._raw, record);
          });
          this.log('[UPDATE SUCCESS]', record);
          resolve(true);
        });
      } catch (error) {
        this.log('[UPDATE FAILURE]', error, error.message);
        resolve(false);
      }
    });
  };

  deleteRecord = (db: Database, record: T) => {
    this.log('[REQUEST DELETE]', record);

    return new Promise((resolve) => {
      try {
        db.action<void>(async () => {
          await record.markAsDeleted();
          await record.destroyPermanently();
          this.log('[DELETE SUCCESS]', record);
          resolve(true);
        });
      } catch (error) {
        this.log('[DELETE FAILURE]', error, error.message);
        resolve(false);
      }
    });
  };
}

class BaseSchema {
  unsafeClearDB = async (db: Database) => {
    return await db.action<void>(async () => {
      await db.unsafeResetDatabase();
      ConsoleUtils.l('Database cleaned successfully');
    });
  };
}

export const _mBaseSchema = new BaseSchema();
