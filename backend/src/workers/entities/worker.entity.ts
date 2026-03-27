import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ name: 'email' })
  email: string;

  @Column()
  password: string;

  constructor(worker: Partial<Worker>) {
    Object.assign(this, worker);
  }
}
