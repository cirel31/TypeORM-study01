import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({
  //   // 데이터베이스에서 인지하는 칼럼 타입
  //   type: 'text',
  //   // 데이터베이스 칼럼 이름
  //   // 프로퍼티 이름이 디폴트 값
  //   name: 'title',
  //   // varchar는 길이 설정 가능
  //   // length: 300,
  //   // null 허용 여부
  //   nullable: false,
  //   // 업데이트 허용 여부
  //   update: true,
  //   // find() 계열 함수를 실행할 때 기본으로 값을 불러올지
  //   // 디폴트는 true
  //   // false로 설정할 경우 controller의 find() 실행 시 select 별로 해당 col을 선언해야함
  //   select: true,
  //   // 기본 값
  //   // 아무 값도 설정하지 않을 때 기본으로 DB에 저장되는 값
  //   default: 'default value',
  //   // col 중에 값이 중복 설정을 허용할 지 여부
  //   // true로 설정할 경우 null도 중복되면 안됨
  //   // 당연히 true 설정일 경우 default로 설정한 값도 중복되면 에러 뱉어냄
  //   unique: false,
  // })
  // title: string;

  @Column()
  email: string;

  @Column({
    // enum은 특정 값으로 제한을 두고 싶을 때 사용
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column()
  @Generated('uuid')
  additionalId: string;

  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    // find() 실행 시 마다 항상 가져올 relation
    // true 설정하면 controller 에서 조회 시 relation 등록 안해도 된다는 거시다
    eager: true,
    // 저장할 때 relation 을 함께 저장 가능 (default: false)
    cascade: false,
    // null 허용 여부 (default: true)
    nullable: true,
    // 관계가 삭제 됐을 때
    // no action >> 아무 것도 안함
    // cascade >> 참조하는 row 도 같이 삭제
    // set null >> 참조하는 row에서 참조 id 를 null 로 변경
    // set default >> 기본 테이블 세팅으로 설정
    // restrict >> 참조하고 있는 row 가 있는 경우 참조 되는 row 삭제 불가
    onDelete: 'CASCADE',
  })
  // Join Col을 어디에 설정해 줄 지는 DB 설계하면서 생각해야 하는 부분
  @JoinColumn()
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
