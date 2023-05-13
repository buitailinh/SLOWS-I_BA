import { JwtAuthGuard } from './../../share/auth/guards/jwt-auth.guard';
import { Controller, Delete, Get, Param, UseGuards, Request } from "@nestjs/common";
import { CommentService } from "./comment.service";


@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get(':id')
  findComment(@Param('id') id) {
    console.log('findComment')
    return this.commentService.getCommentById(id);
  }

  @Get('/post/:id')
  findCommentByPostId(@Param('id') id) {
    return this.commentService.getCommentByPostId(id);
  }

  @Get('/like/:id')
  getCommentLike(@Param('id') id) {
    return this.commentService.getLikes(id);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteComment(@Param('id') id, @Request() req) {
    return this.commentService.remove(id, req.user.userId);
  }
}
