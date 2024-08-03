import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.providers';

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
