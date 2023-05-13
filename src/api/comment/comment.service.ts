import { JobQueueService } from './../../share/job-queue/job-queue.service';
import { FirebaseDatabaseService } from './../../share/common/external-services/firebase-admin/firebase-admin.service';
import { ERROR } from './../../share/common/error-code.const';
import { UserService } from './../user/user.service';
import { CommentRepository } from './comment.repository';
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { ObjectID } from 'typeorm';
import { PatternLib } from './../../share/utils/pattern.lib'
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    public commentRepository: CommentRepository,
    private userService: UserService,
    private jobQueueService: JobQueueService,
  ) { }

  async getCommentById(_id) {
    const comment = await this.commentRepository.findOne(_id);
    if (!comment)
      throw new NotFoundException(ERROR.COMMENT_NOT_FOUND.MESSAGE);
    const userComment = await this.userService.getByUserId(comment.author);
    comment.author = {
      _id: userComment._id,
      fullName: userComment.firstName + ' ' + userComment.lastName,
      username: userComment.username,
      avatar: userComment.avatar,
      role: userComment.role,
    }
    return comment;
  }

  async getCommentByPostId(postId) {
    const take = 10;
    const page = 1;
    const skip = (page - 1) * take;
    const comment = await this.commentRepository.findAndOptions({
      where: { postId: { $regex: postId, $options: 'i' } },
      order: { createdAt: 'ASC' },
      take: take,
      skip: skip
    });
    return this.commentRepository.paginateResponse(comment, page, skip);
  }

  async createComment(createComment: CreateCommentDto, post: Post, userId) {
    const userFound = await this.userService.getByUserId(userId);
    let { content } = createComment;
    const matches = content.match(PatternLib.filterUserFromText);

    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const username = match.slice(1);
        const user = await this.userService.getByUserName(username);
        console.log(`Comment`, user);
        if (user) {
          content = content.replace(match, `<a href="/profile/${user._id}">${match}</a>`);
          await this.jobQueueService.remindNotification({ post, user: userFound, userRemind: user });
        }
      }
    }
    const newComment = {
      ...createComment,
      content,
      author: userFound._id,
      likes: [],
      repComments: [],
    };
    const commentNew = await this.commentRepository.save(newComment);

    return commentNew;
  }

  async updateComment(commentId, comment: string, userId) {
    const commentFound = await this.getCommentById(commentId);
    if (commentFound.author !== userId)
      throw new HttpException('You cannot update', HttpStatus.BAD_REQUEST);
    commentFound.content = comment;

    await commentFound.save();

    return {
      httpStatus: 201,
      message: 'Update comment successfully'
    }
  }

  async updateRepComment(commentId, comment: Comment) {
    const commentFound = await this.getCommentById(commentId);
    commentFound.repComments.push(comment);

    commentFound.save();

    return {
      httpStatus: 201,
      message: 'Update comment successfully'
    }
  }

  async updateCommentLikes(commentId, userId) {
    const userFound = await this.userService.getByUserId(userId);
    const commentFound = await this.getCommentById(commentId);

    const findUserLike = commentFound.likes.findIndex(likeId => likeId.toString() === userId.toString());
    if (findUserLike === -1) {
      commentFound.likes.push(userFound._id);
    } else {
      commentFound.likes.splice(findUserLike, 1);
    }
    commentFound.save();

    return commentFound;
  }

  async getLikes(commentId) {
    const commentFound = await this.getCommentById(commentId);
    return commentFound.likes;
  }

  async remove(id: ObjectID, userId) {
    const commentFound = await this.getCommentById(id);
    if (commentFound.author !== userId)
      throw new HttpException('You do not have access', HttpStatus.BAD_REQUEST)

    await this.commentRepository.delete(commentFound._id);
    return `This action removes a #${id} post`;
  }
}
