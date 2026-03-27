import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { EntityManager } from 'typeorm';
import { Worker } from './entities/worker.entity';

@Injectable()
export class WorkersService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createWorkerDto: CreateWorkerDto) {
    const worker = new Worker(createWorkerDto);
    await this.entityManager.save(worker);
  }

  findAll() {
    return `This action returns all workers`; 
  }

  findOne(id: number) {
    return `This action returns a #${id} worker`;
  }

  update(id: number, updateWorkerDto: UpdateWorkerDto) {
    return `This action updates a #${id} worker`;
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
