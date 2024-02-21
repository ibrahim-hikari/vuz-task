import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_SERVICE') private readonly redisClient: Redis
  ) { }

  async setData(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async getData(key: string): Promise<string> {
    console.log('this.redisClient', this.redisClient);

    return await this.redisClient.get(key);
  }
}
