import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { Not, Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}
  @Post('users')
  async postUser() {
    // return this.userRepository.save({});
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@ssafy.com`,
      });
    }
  }
  @Get('users')
  getUsers() {
    return this.userRepository.find({
      where: {
        // id가 1이 아닌 경우 가져오기
        id: Not(1),
        // LessThan, MoreThan, MoreThanOrEqual, Equal 등으로 범위 필터링 가능
        // 유사값
        // email: Like('%ssafy%'),
        // 대소문자 구분 없는 유사값
        // email: ILike('%SSAFY%'),
        // null인 프로퍼티 필터링
        // id: IsNull(),
      },
      // 어떤 프로퍼티를 선택할지
      // select 미정의 >> 기본적으로 모든 프로퍼티를 가져온다.
      // 내부에 프로퍼티를 정의해서 원하는 프로퍼티만 가져올 수 있다.
      // select: {
      //   id: true,
      // },
      // where >> 필터링 할 조건을 입력
      // 내부에 프로퍼티를 정의해서 해당 정의에 해당되는 프로퍼티를 필터링한다.
      // where 를 {} 로 정의하고 내부에 프로퍼티를 정의하면 and로 실행
      // where: {
      //   version: 1,
      // },
      // where 를  [] 로 선언하고 별개의 {} 으로 구분하면 or 로 필터링
      // where: [
      //   {
      //     version: 1,
      //   },
      //   {
      //     id: 2,
      //   },
      // ],
      // order >> 정렬, 오름차순 >> ASC, 내림차순 >> DESC
      order: {
        id: 'ASC',
      },
      // skip >> 정렬 이후 순차적으로 몇 개를 제외할 지, 기본 설정은 0
      // take >> 정렬 이후 순차적으로 몇 개를 가져올지, 기본 설정은 0 (전부 가져옴)
    });
  }
  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });
    return this.userRepository.save({
      ...user,
      // title: user.title + '0',
    });
  }

  @Post('/user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'ssafyman@ssafy.com',
    });
    await this.profileRepository.save({
      profileImg: '1234.jpg',
      user,
    });
    return user;
  }

  @Post('user/post')
  async createUserAndPost() {
    const user = await this.userRepository.save({
      email: 'ssafyman@ssafy.com',
    });
    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });
    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });
    return user;
  }
  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'Nest.js',
    });
    const post2 = await this.postRepository.save({
      title: 'React',
    });
    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });
    const tag2 = await this.tagRepository.save({
      name: 'Typescript',
      posts: [post2],
    });
    const post3 = await this.postRepository.save({
      title: 'Next.js',
      tags: [tag1, tag2],
    });
    return true;
  }
  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }
}
