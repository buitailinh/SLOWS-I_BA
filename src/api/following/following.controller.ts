import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { FollowingService } from './following.service';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';
import { JwtAuthGuard } from 'src/share/auth/guards/jwt-auth.guard';

@Controller('following')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createFollowingDto: CreateFollowingDto, @Request() req) {
    // return this.followingService.update(createFollowingDto, req.user._id);
    return
  }

  @Get('/followers')
  @UseGuards(JwtAuthGuard)
  findAllFollowers(@Request() req, @Query() query) {
    console.log('followers', req.user._id)
    // return this.followingService.findAllUserFollower(req.user._id, query);
    return
  }

  @Get('/followings')
  @UseGuards(JwtAuthGuard)
  findAllFollowings(@Request() req, @Query() query) {
    // return this.followingService.findAllUserFollowing(req.user._id, query);
    return
  }


  @Get('/blocks')
  @UseGuards(JwtAuthGuard)
  findAllBlocks(@Request() req) {
    // return this.followingService.findAllUserBlock(req.user._id);
    return
  }


  @Get('/friends')
  @UseGuards(JwtAuthGuard)
  findAllFriends(@Request() req, @Query() query) {
    // return this.followingService.findAllUserFriend(req.user._id, query);
    return
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  findFollowOfUser(@Param('id') id, @Request() req) {
    // return this.followingService.findOneDetail({ creator: req.user._id, receiver: id });
    return
  }


  @Get('/followers/:id')
  @UseGuards(JwtAuthGuard)
  findAllUserFollowers(@Param('id') id, @Query() query) {
    // return this.followingService.findAllUserFollower(id, query);
    return
  }

  @Get('/followings/:id')
  @UseGuards(JwtAuthGuard)
  findAllUserFollowings(@Param('id') id, @Query() query) {
    // return this.followingService.findAllUserFollowing(id, query);
    return
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.followingService.remove(+id);
  // }
}
