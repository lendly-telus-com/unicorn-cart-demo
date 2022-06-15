import { createClient } from 'redis';

const client = createClient();

export class RedisConfig {
  async clientOn() {
    await client.connect();
  }

  async clientSave(key: string, psuedo: number, payload: any) {
    return await client.setEx(key, psuedo, payload);
  }

  async clientGet(key: string) {
    return await client.get(key);
  }

  async clientDelete(key: string) {
    return await client.del(key);
  }

  async clientRenameKey(oldKey, newKey) {
    return await client.rename(oldKey, newKey);
  }
}
