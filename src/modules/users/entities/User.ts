import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Statement } from '../../statements/entities/Statement';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', nullable: true })
  name: string | undefined;;

  @Column({ type: 'varchar', nullable: true })
  email: string | undefined;;

  @Column({ type: 'varchar', nullable: true })
  password: string | undefined;

  @OneToMany(() => Statement, statement => statement.user)
  statement: Statement[];

  @CreateDateColumn()
  created_at: Date | undefined;;

  @CreateDateColumn()
  updated_at: Date | undefined;;

  constructor() {
    if(!this.id) {
      this.id = uuid();
    }
  }
}
