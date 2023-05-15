import { ObjectID } from 'typeorm';
import { RolesGuard } from './../../share/auth/guards/role.guard';
import { multerOptions } from './../../share/common/helper/multer/image-file.filter';
import { JwtAuthGuard } from './../../share/auth/guards/jwt-auth.guard';
import { ValidationPipe } from './../../share/pipe/validation.pipe';
import { ExportDataService } from './exportdata.service';
import { UserService } from 'src/api/user/user.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, Response, Request, UploadedFile, UseGuards, UseInterceptors, ConsoleLogger } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/share/decorator/get-user.decorator';
import { createReadStream } from 'fs';
import { join } from 'path';
import { google } from 'googleapis';
import { ApiBadRequestResponse, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { USER_SWAGGER_RESPONSE } from './user.constant';
import { FileInterceptor } from '@nestjs/platform-express';
import { AUTH_SWAGGER_RESPONSE } from 'src/share/auth/auth.constant';
import { AppObject } from 'src/share/common/app.object';
import { Roles } from 'src/share/decorator/roles.decorator';
import { RoleUserDto } from './dto/role-user.dto';
import { CreateFollowingDto } from './dto/createFollowing.dto';
import { query } from 'express';



@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(private userService: UserService,
    private exportdata: ExportDataService,
  ) { };


  // @ApiOkResponse(SWAGGER_RESPONSE.HEALTH_CHECK)
  @Get()
  findAll(@Query() query) {
    return this.userService.getAll(query);
  }

  @Post('/follow')
  @UseGuards(JwtAuthGuard)
  createOrUpdateFollow(@Body() body, @Request() req) {
    return this.userService.creatOrUpdateFollow(body, req.user._id);
  }

  @Get('/follow/followers')
  @UseGuards(JwtAuthGuard)
  findAllFollowers(@Request() req, @Query() query) {
    console.log('followers', req.user._id)
    return this.userService.findAllUserFollower(req.user._id, query);
  }

  @Get('/follow/followings')
  @UseGuards(JwtAuthGuard)
  findAllFollowings(@Request() req, @Query() query) {
    return this.userService.findAllUserFollowing(req.user._id, query);
  }


  @Get('/follow/blocks')
  @UseGuards(JwtAuthGuard)
  findAllBlocks(@Request() req) {
    return this.userService.findAllUserBlock(req.user._id);
  }

  @Get('/follow/add')
  @UseGuards(JwtAuthGuard)
  findAllAdd(@Request() req, @Query() query) {
    return this.userService.findFollowUserAdd(req.user._id, query);
  }


  @Get('/follow/friends')
  @UseGuards(JwtAuthGuard)
  findAllFriends(@Request() req, @Query() query) {
    return this.userService.findAllFriends(req.user._id, query);
  }


  @Get('/follow/followers/:id')
  @UseGuards(JwtAuthGuard)
  findAllUserFollowers(@Param('id') id, @Query() query) {
    return this.userService.findAllUserFollower(id, query);
  }

  @Get('/follow/followings/:id')
  @UseGuards(JwtAuthGuard)
  findAllUserFollowings(@Param('id') id, @Query() query) {
    return this.userService.findAllUserFollowing(id, query);
  }

  @Get('/follow/:id')
  @UseGuards(JwtAuthGuard)
  findFollowOfUser(@Param('id') id, @Request() req) {
    if (!id) {
      console.log('id is undefined');
      return;
    }
    return this.userService.findFollowOfUser(req.user._id, id);
  }

  @Get('exportfile')
  getfile(@Response({ passthrough: true }) res) {
    res.set({
      'Content-Type': 'application/csv',
      'Content-Disposition': 'attachment; filename="data.csv"',
    });
    return this.exportdata.exportFile();
  }

  // @Get('exportgoogle')
  // getGGS() {
  //     return this.exportdata.getGoogleSheet();
  // }
  @Get('exportgoogle1')
  getGGS2() {
    return this.exportdata.exportGG();
  }

  // @Get('exportgoogle1')
  // getGGS1(@Res() res: Response) {
  //     return this.exportdata.getGoogleSheet1();
  // }

  @Get('/notifications')
  @UseGuards(JwtAuthGuard)
  getAllNotifications(@Request() req) {

    return this.userService.updateNotification(req.user._id);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id, @Request() req): Promise<User> {
    return this.userService.getByUser(id, req.user._id);
  }


  @Get('/username/:name')
  findByName(@Param('name') name: string): Promise<User> {
    return this.userService.getByUserName(name);
  }

  @Get('/phone/:phone')
  findByPhone(@Param('phone') phone: string): Promise<User> {
    return this.userService.getByPhone(phone);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }


  @Put('/:id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: number): Promise<any> {
    return this.userService.delete(id);
  }


  @ApiOkResponse({
    type: User,
    description: 'Update role user successfully',
  })
  @ApiBadRequestResponse({
    description: 'User cannot update. Try again!',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id' })
  @Post('role/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppObject.USER_MODULE.ROLE.PRO, AppObject.USER_MODULE.ROLE.ADMIN)
  async updateRoleForMn(@Param('id') id: ObjectID, @Query() role: RoleUserDto, @Request() req) {
    // console.log(role)
    return await this.userService.updateRoleManager(id, role, req.user.userId);
  }
}
