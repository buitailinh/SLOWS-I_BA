import { ObjectID } from 'typeorm';
import { JwtAuthGuard } from './../../share/auth/guards/jwt-auth.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createPostDto: CreatePostDto, @Request() req, @UploadedFile() file) {
    return this.postService.create(createPostDto, req.user, file);
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query) {
    return this.postService.findAll(query);
  }


  @Get('/me')
  @UseGuards(JwtAuthGuard)
  findByMe(@Request() req) {
    return this.postService.getPostByUser(req.user._id);
  }

  @Get(':id')
  async findOneById(@Param('id') id) {
    return this.postService.getPostByIdDetail(id);
  }

  @Get('/users/:user')
  @UseGuards(JwtAuthGuard)
  findOneByUser(@Param('user') userId, @Request() req) {
    return this.postService.getPostByUser(userId, req.user._id);
  }

  @Patch('/like/:id')
  @UseGuards(JwtAuthGuard)
  async updateLike(@Param('id') id, @Request() req) {
    return this.postService.updateLikes(id, req.user._id);
  }

  @Get('/likes/:id')
  @UseGuards(JwtAuthGuard)
  async getLike(@Param('id') id) {
    return this.postService.getLikes(id);
  }

  @Get('/comments/:id')
  @UseGuards(JwtAuthGuard)
  async getComment(@Param('id') id) {
    return this.postService.getComments(id);
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id') id: ObjectID, @Body() updatePostDto: UpdatePostDto, @UploadedFile() file) {
    return this.postService.update(id, updatePostDto, file);
  }



  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: ObjectID, @Request() req) {
    return this.postService.remove(id, req.user._id);
  }
}
