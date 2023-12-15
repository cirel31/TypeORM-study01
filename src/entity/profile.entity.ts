import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => UserModel, (user) => user.profile)
  // Join Col을 어디에 설정해 줄 지는 DB 설계하면서 생각해야 하는 부분
  @JoinColumn()
  user: UserModel;

  @Column()
  profileImg: string;
}
