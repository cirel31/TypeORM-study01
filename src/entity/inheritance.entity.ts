import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

// 일반적인 상속을 위한 기본 모델 설정
// 일반적인 Class Inheritance, 객체 지향 프로그래밍에서의 클래스 상속 개념
// Entity 데코레이션 없음
// 각 클래스가 별도의 테이블로 구현, 데이터 구조가 단순하고 명확
// 공통 필드를 재사용하면서 각 엔티티가 고유한 속성을 가질 때 사용
export class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// 기본 모델에서 확장할 모델들
// 각 모델들은 다른 col를 추가하는 방식
// 이렇게 생성한 모델들은 DB에 별도의 테이블로 저장
@Entity()
export class CarModel extends BaseModel {
  @Column()
  brand: string;
}

@Entity()
export class BookModel extends BaseModel {
  @Column()
  name: string;
}

// Table Inheritance
// 부모 - 자식 개념으로 테이블을 상속하는 TypeORM 테이블 상속
// TableInheritance의 column 옵션을 통해 어떤 엔티티 타입인지 구분
// 객체의 계층 구조를 DB에 보다 효율적으로 매핑 가능
// 다형성을 DB에 적용 >> 다양한 유형의 객체가 공통의 속성을 공유하면서 다른 특성 보유 시
@Entity()
@TableInheritance({
  column: {
    name: 'type',
    type: 'varchar',
  },
})
export class SingleBaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@ChildEntity()
export class ComputerModel extends SingleBaseModel {
  @Column()
  brand: string;
}
@ChildEntity()
export class AirplainModel extends SingleBaseModel {
  @Column()
  country: string;
}
