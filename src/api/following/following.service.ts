import { CreateJobBlockQueueDto } from './../../share/job-queue/dto/create-job-block.dto';
import { NotificationFollowQueueDto } from './../../share/job-queue/dto/notification-follow-queue.dto';
import { JobQueueService } from './../../share/job-queue/job-queue.service';
import { UserFollowingDto } from './dto/user-following.dto';
import { FriendRequest_Status } from './interface/following.interface';
import { UserService } from 'src/api/user/user.service';
import { FollowingRepository } from './following.repository';
import { Injectable } from '@nestjs/common';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';
import { ObjectID } from 'typeorm';

@Injectable()
export class FollowingService {

  constructor(
    public followingRepository: FollowingRepository,
    private jobQueueService: JobQueueService
  ) { }
  async create(createFollowingDto: CreateFollowingDto) {

    const { creator, receiver, status } = createFollowingDto;

    const followingNew = await this.followingRepository.save({
      creator: creator._id,
      receiver: receiver._id,
      creatorStatus: status === 'Following' ? 'Following' : '',
      receiverStatus: status === 'Following' ? 'Follower' : '',
      creatorBlock: status === 'Block' ? true : false,
      receiverBlock: false
    })

    return followingNew;
  }

  async findAllUserFollower(userId, query) {

    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    // const userFound = await this.userService.getByUserId(userId);
    // console.log('user', userFound, userId);
    const followers = await this.followingRepository.findAndOptions({
      where: {
        // $or: [
        //   // { creator: userFound._id, creatorStatus: { $in: ['Follower', 'Friend'] } },
        //   // { receiver: userFound._id, receiverStatus: { $in: ['Follower', 'Friend'] } },
        //   { creator: userFound._id, creatorStatus: 'Follower' },
        //   { receiver: userFound._id, receiverStatus: 'Follower' },
        //   { creator: userFound._id, creatorStatus: 'Friend' },
        //   { receiver: userFound._id, receiverStatus: 'Friend' }
        // ],

        $and: [
          {
            $or: [
              { creator: userId, creatorStatus: 'Follower' },
              { receiver: userId, receiverStatus: 'Follower' },
              { creator: userId, creatorStatus: 'Friend' },
              { receiver: userId, receiverStatus: 'Friend' }
            ]
          },
          { creatorStatus: { $ne: true } },
          { receiverStatus: { $ne: true } }
        ]
      },
      order: { updateAt: 'DESC' },
    })

    // console.log('follower', followers);

    return this.followingRepository.paginateResponse(followers, page, skip);
  }

  async findAllUserFollowing(userId, query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    // const userFound = await this.userService.getByUserId(userId);

    const followings = await this.followingRepository.findAndOptions({
      where: {
        // $or: [
        //   { creator: userFound._id, creatorStatus: 'Following', creatorBlock: false, receiverBlock: false },
        //   { receiver: userFound._id, receiverStatus: 'Following', creatorBlock: false, receiverBlock: false },
        //   { creatorStatus: 'Friend', $or: [{ creator: userFound._id }, { receiver: userFound._id }], creatorBlock: false, receiverBlock: false }
        // ],
        // $and: [
        //   { creatorStatus: { $ne: 'Follower' } },
        //   { receiverStatus: { $ne: 'Follower' } }
        // ]

        $and: [
          {
            $or: [
              { creator: userId, creatorStatus: 'Following' },
              { receiver: userId, receiverStatus: 'Following' },
              { creator: userId, creatorStatus: 'Friend' },
              { receiver: userId, receiverStatus: 'Friend' }
            ]
          },
          { creatorStatus: { $ne: true } },
          { receiverStatus: { $ne: true } }
        ]
      },
      order: { updateAt: 'DESC' },
    });
    // console.log('following', followings);

    return this.followingRepository.paginateResponse(followings, page, skip);
  }



  async findAllUserFriend(userId, query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    // const userFound = await this.userService.getByUserId(userId);

    const friends = await this.followingRepository.findAndOptions({
      where: {
        creatorStatus: 'Friend',
        $or: [{ creator: userId }, { receiver: userId }],
        creatorBlock: false, receiverBlock: false
      },
      order: { updateAt: 'DESC' },
    })

    return this.followingRepository.paginateResponse(friends, page, skip);
  }

  async findAllUser(userId, query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    const listUser = await this.followingRepository.findAndOptions({
      where: {
        $and: [
          {
            $or: [
              { creator: userId },
              { receiver: userId }
            ]
          },
          { creatorStatus: { $ne: "" } },
          { receiverStatus: { $ne: "" } }
        ]

      }
    });

    if (listUser[0].length) {
      listUser[0] = await Promise.all(listUser[0].map(follow => {
        if (userId.toString() === follow.creator.toString()) {
          return follow.receiver;
        }
        return follow.creator;
      }))
    }
    return listUser;
  }

  async findAllUserBlock(userId) {
    // const userFound = await this.userService.getByUserId(userId);
    const blocks = await this.followingRepository.findAndOptions({
      where: {
        $or: [
          { creator: userId, creatorBlock: true },
          { receiver: userId, receiverBlock: true }
        ]
      }
    });

    return blocks;
  }

  async CheckUserBlock(user, userCheck) {

    const checkUser = await this.hasRequestBeenSentOrReceived({ creator: user, receiver: userCheck });
    if (!checkUser)
      return {
        status: false
      };

    if (checkUser.creatorBlock || checkUser.receiverBlock) {
      return {
        status: true,
        message: checkUser.creator === user._id ? "You are blocking this user!" : "This user is blocking you!",
        actionYou: checkUser.creator.toString() === user._id.toString() ? checkUser.creatorBlock : checkUser.receiverBlock,
        actionUser: checkUser.creator.toString() !== user._id.toString() ? checkUser.creatorBlock : checkUser.receiverBlock,
      }
    }

    return {
      status: false
    };
  }


  async getById(_id) {
    const followFound = await this.followingRepository.findOne(_id);
    if (!followFound)
      return followFound;
  }
  async hasRequestBeenSentOrReceived(userFollowing: UserFollowingDto) {
    const { creator, receiver } = userFollowing;
    // const creatorFound = await this.userService.getByUserId(creator);
    // const receiverFound = await this.userService.getByUserId(receiver);

    const found = await this.followingRepository.findOne({
      where: {
        $and: [
          {
            $or: [
              { creator: creator._id },
              { creator: receiver._id }
            ]
          },
          {
            $or: [
              { receiver: creator._id },
              { receiver: receiver._id }
            ]
          }
        ]
      },
    });


    return found;

  }

  async findOneDetail(userFollowing: UserFollowingDto) {
    const { creator, receiver } = userFollowing;
    // const creatorFound = await this.userService.getByUserId(creator);
    // const receiverFound = await this.userService.getByUserId(receiver);

    const follow = await this.followingRepository.findOne({
      where: {
        $and: [
          {
            $or: [
              { creator: creator._id },
              { creator: receiver._id }
            ]
          },
          {
            $or: [
              { receiver: creator._id },
              { receiver: receiver._id }
            ]
          }
        ]
      },
    });


    return follow;
  }

  async update(updateFollowingDto: CreateFollowingDto, userId) {
    const { creator, receiver, status, time } = updateFollowingDto;
    // const creatorFound = await this.userService.getByUserId(creator);
    // const receiverFound = await this.userService.getByUserId(receiver);

    const followFound = !!(await this.hasRequestBeenSentOrReceived({ creator, receiver }));

    if (followFound) {
      const follow = await this.findOneDetail({ creator, receiver });
      if (userId.toString() === follow.creator.toString()) {
        if (status === 'Block') {
          follow.creatorBlock = !follow.creatorBlock;
          if (follow.creatorBlock && time) {
            const addBlockUser: CreateJobBlockQueueDto = {
              creatorId: creator._id,
              receiverId: receiver._id,
              time: time,
            }
            await this.jobQueueService.addBlockUser(addBlockUser);
          }
        } else {
          follow.creatorStatus = await this.selectAction1(follow.creatorStatus);
          if (follow.creatorStatus === 'Friend') {
            // console.log('dada', follow.creatorStatus)
            await this.jobQueueService.followNotification({ userSend: creator, userReceive: receiver, status: 'Friend' })
          }
          follow.receiverStatus = this.selectAction2(follow.creatorStatus);
        }
        await this.followingRepository.update(follow._id, follow);
      } else {
        if (status === 'Block') {
          follow.receiverBlock = !follow.receiverBlock;
          if (follow.receiverBlock && time) {
            const addBlockUser: CreateJobBlockQueueDto = {
              creatorId: creator._id,
              receiverId: receiver._id,
              time: time,
            }
            await this.jobQueueService.addBlockUser(addBlockUser)
          }
        } else {
          follow.receiverStatus = this.selectAction1(follow.receiverStatus);
          follow.creatorStatus = this.selectAction2(follow.receiverStatus);
        }
        await this.followingRepository.update(follow._id, follow);
      }


      return this.findOneDetail({ creator, receiver });

    } else {
      const followNew = await this.create({ creator, receiver, status });
      if (status === "Block") {
        if (followNew.creatorBlock && time) {
          const addBlockUser: CreateJobBlockQueueDto = {
            creatorId: creator._id,
            receiverId: receiver._id,
            time: time,
          }
          await this.jobQueueService.addBlockUser(addBlockUser)
        }
      } else {
        await this.jobQueueService.followNotification({ userSend: creator, userReceive: receiver, status: 'following' })
      }
      return followNew;
    }
  }

  selectAction1(status: FriendRequest_Status): FriendRequest_Status {
    if (status === 'Following') {
      return '';
    }
    if (status === 'Follower') {
      return 'Friend';
    }
    if (status === 'Friend') {
      return 'Follower';
    }
    else {
      return 'Following';
    }
  }

  selectAction2(status: FriendRequest_Status): FriendRequest_Status {
    if (status === 'Following') {
      return 'Follower';
    }
    if (status === 'Follower') {
      return 'Following';
    }
    if (status === 'Friend') {
      return 'Friend';
    }
    else {
      return '';
    }
  }

  async remove(id) {
    // const followFound = await this.getById(id);
    await this.followingRepository.delete(id);
    return {
      message: `This action removes a #${id} follow`
    };
  }
}
