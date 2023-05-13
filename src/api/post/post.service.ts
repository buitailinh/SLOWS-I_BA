import { FollowingService } from './../following/following.service';
import { JobQueueService } from './../../share/job-queue/job-queue.service';
import { FirebaseDatabaseService } from './../../share/common/external-services/firebase-admin/firebase-admin.service';
import { CreateCommentDto } from './../comment/dto/create-comment.dto';
import { CommentService } from './../comment/comment.service';
import { CloudinaryService } from './../../share/cloudinary/cloudinary.service';
import { UserService } from 'src/api/user/user.service';
import { PostRepository } from './post.repository';
import { Injectable, NotFoundException, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as QRCode from 'qrcode';
import { And, ObjectID } from 'typeorm';
import { Post } from './entities/post.entity';
import { ERROR } from 'src/share/common/error-code.const';
import { User } from '../user/user.entity';


@Injectable()
export class PostService {
  constructor(
    public postRepository: PostRepository,
    private userService: UserService,
    private cloudinary: CloudinaryService,
    private commentService: CommentService,
    private jobQueueService: JobQueueService,
    private followingService: FollowingService

  ) { }
  async create(createPostDto: CreatePostDto, user, file?: Express.Multer.File) {
    const { content } = createPostDto;
    let image;

    // console.log(`creating`, file);
    if (file) {
      image = await this.cloudinary.uploadImage(file);
    }

    const post = {
      content: content ? content : "",
      images: image ? [image] : [],
      likes: [],
      comments: [],
      author: user._id
    }
    const postNew = await this.postRepository.save(post);
    const qrCode = await this.createQR(`${process.env.FRONTEND_HOST}/post/${postNew._id}`);
    return this.postRepository.save({ ...postNew, qrCode });
  }

  async findAll(query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const keyword = query.keyword || ''
    let order = null;
    if (query.order === 'ASC') {
      order = 1;
    } else if (query.order === 'DESC') {
      order = -1;
    }

    const posts = await this.postRepository.findAndOptions({
      where: keyword ? { content: { $regex: keyword, $options: 'i' } } : null,
      order: order ? { content: order, createdAt: 'DESC' } : { createdAt: 'DESC' },
      take: take,
      skip: skip
    });

    console.log('data', posts);
    return this.postRepository.paginateResponse(posts, page, skip);
  }


  async getPostById(_id) {
    const post = await this.postRepository.findOne(_id);
    if (!post)
      throw new NotFoundException(ERROR.POST_NOT_FOUND.MESSAGE);
    // if (post.likes.length > 0) {
    //   const likes = post.likes.map(likeId => this.userService.getByUserId(likeId));
    //   post.likes = likes
    // }
    // if (post.comments.length > 0) {
    //   const comments = post.comments.map(commentId => this.commentService.getCommentById(commentId));
    //   post.comments = comments;
    // }
    return post;
  }

  async getPostByIdDetail(_id) {
    const post = await this.postRepository.findOne(_id);
    // console.log('post', post, _id);
    if (!post)
      throw new NotFoundException(ERROR.POST_NOT_FOUND.MESSAGE);
    if (post.likes.length > 0) {
      const likes = await Promise.all(post.likes.map(likeId => this.userService.getByUserId(likeId)));
      post.likes = likes
    }
    if (post.comments.length > 0) {
      const comments = await Promise.all(post.comments.map(commentId => this.commentService.getCommentById(commentId)));
      post.comments = comments;
    }
    post.author = await this.userService.getByUserId(post.author);

    // console.log(post);
    return post;
  }


  async getPostByIdLikes(_id) {
    const post = await this.postRepository.findOne(_id);
    if (!post)
      throw new NotFoundException(ERROR.POST_NOT_FOUND.MESSAGE);
    if (post.likes.length > 0) {
      const likes = await Promise.all(post.likes.map(likeId => this.userService.getByUserId(likeId)));
      post.likes = likes
    }
    return post;
  }

  async getPostByIdComment(_id) {
    const post = await this.postRepository.findOne(_id);
    if (!post)
      throw new NotFoundException(ERROR.POST_NOT_FOUND.MESSAGE);
    if (post.comments.length > 0) {
      const comments = await Promise.all(post.comments.map(commentId => this.commentService.getCommentById(commentId)));
      post.comments = comments;
    }
    return post;
  }

  async getPostByUser(userId) {
    const userFound = await this.userService.getByUserId(userId);

    const listPost = await this.postRepository.findAndOptions({
      where: { 'author': userFound._id },
      order: { createdAt: 'DESC' }
    });
    // console.log('data', listPost, userId);
    return listPost;
  }

  async update(postId: ObjectID, userId, updatePostDto: UpdatePostDto, file?: Express.Multer.File) {
    let { content, image } = updatePostDto;
    const postFound = await this.getPostById(postId);
    if (postFound.author !== userId) {
      throw new HttpException('You do not have access', HttpStatus.BAD_REQUEST)
    }
    if (file) {
      await this.cloudinary.deleteImage(postFound.images[0]);
      image = await this.cloudinary.uploadImage(file)
    }

    await this.postRepository.update(postId, {
      ...postFound,
      content,
      images: [image]
    })
    return {
      message: 'Updated post successfully!',
      status: 202
    }
  }

  async updateLikes(postId: ObjectID, userId: ObjectID) {
    const postFound = await this.getPostById(postId);
    const userFound = await this.userService.getByUserId(userId);
    const findUserLike = postFound.likes.findIndex(like => like.toString() === userId.toString());
    if (findUserLike === -1) {
      postFound.likes.push(userFound._id);
    } else {
      postFound.likes.splice(findUserLike, 1);
    }
    await this.postRepository.update(postId, { likes: postFound.likes });
    if (postFound.author.toString() !== userId.toString()) {
      await this.jobQueueService.likeNotification({ post: postFound, user: userFound });
    }
    const postResult = await this.getPostByIdLikes(postId);
    return postResult;
  }

  async getLikes(postId: ObjectID) {
    const postFound = await this.getPostByIdLikes(postId);
    const likes = await Promise.all(postFound.likes.map(async (like) => await like));
    return likes;
  }

  async updateComments(createComment: CreateCommentDto, userId) {
    const { postId } = createComment;
    const postFound = await this.getPostById(postId);
    const userFound = await this.userService.getByUserId(userId);
    const newComment = await this.commentService.createComment(createComment, postFound, userId);
    postFound.comments.push(newComment._id);
    await this.postRepository.update(postId, { comments: postFound.comments });
    if (postFound.author.toString() !== userId.toString()) {
      await this.jobQueueService.commentNotification({ post: postFound, user: userFound })
    }
    const postResult = await this.getPostByIdComment(postId);
    return postResult;
  }

  async getComments(postId: ObjectID) {
    const postFound = await this.getPostByIdDetail(postId);
    const comments = await Promise.all(postFound.comments.map(async (comment) => await (comment)));
    return comments;
  }



  async remove(id: ObjectID, userId) {
    const postFound = await this.getPostById(id);
    if (postFound.author.toString() !== userId.toString())
      throw new HttpException('You do not have access', HttpStatus.BAD_REQUEST)
    if (postFound.images) {
      await this.cloudinary.deleteImages(postFound.images);
    }
    if (postFound.qrCode) {
      await this.cloudinary.deleteImage(postFound.qrCode);
    }
    await this.postRepository.delete(postFound._id);
    return `This action removes a #${id} post`;
  }

  async createQR(url: string) {
    const qrCodeImage = await QRCode.toDataURL(url);
    const image = await this.cloudinary.uploadImageData(qrCodeImage);
    return image;
  }
}
