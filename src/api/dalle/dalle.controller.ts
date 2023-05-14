import { JwtAuthGuard } from './../../share/auth/guards/jwt-auth.guard';
import { FindDalleDto } from './dto/find-photo.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { DalleService } from './dalle.service';
import { CreateDalleDto } from './dto/create-dalle.dto';
import { UpdateDalleDto } from './dto/update-dalle.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('dalle')
export class DalleController {
  constructor(private readonly dalleService: DalleService) { }

  @Post()
  create(@Body() findPhotoDto: FindDalleDto) {
    return this.dalleService.findPhoto(findPhotoDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  GetUser(@Request() req) {

    return this.dalleService.getDalleByUser(req.user._id);
  }

  // @Get('/:id')
  // @UseGuards(JwtAuthGuard)
  // GetDalleById(@Param('id') id) {
  //   return this.dalleService.getDalleById(id);
  // }

  @Post('/save')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async savephoto(@Body() body, @Request() req, @UploadedFile() file: Express.Multer.File) {
    // console.log('req', req.user, 'file', file, 'body', body);
    const dalle = await this.dalleService.create(body, req.user, file);
    return dalle;
  }

  @Get('/save')
  // @UseGuards(JwtAuthGuard)
  async getAll(@Query() query) {
    return this.dalleService.getAll(query);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updata(@Param('id') id, @Body() body, @Request() req) {
    return this.dalleService.update(id, req.user.userId, body)
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id) {
    return this.dalleService.delete(id)
  }

}
