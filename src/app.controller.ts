import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, RawBodyRequest, Req, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {Avatar} from "./types/Avatar";
import {Response} from "express";

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('avatars')
  createAvatar(@Body() body: Avatar, @Res() res: Response) {
    console.log(" POST /api/avatars")
    return this.appService.create_avatar(body, res);
  }

  @Get('avatars')
  getAllAvatars(@Res() res: Response){
    console.log(" GET /api/avatars")
    return this.appService.get_all_avatars(res)
  }

  @Get('avatars/:id')
  getAvatarById(@Param('id') id:string, @Res() res: Response){
    console.log(` GET /api/avatars/${id}`)
    return this.appService.get_avatar_by_id(id, res)
  }

  @Put('avatars/:id')
  updateAvatar(@Param('id') id: string, @Body() updateValues: Avatar, @Res() res: Response){
    console.log(` PUT /api/avatars/${id}`)
    return this.appService.update_avatar(updateValues, id, res)
  }

  @Delete('avatars/:id')
  deleteAvatar(@Param('id') id:string, @Res() res: Response){
    console.log(` DELETE /api/avatars/${id}`)
    return this.appService.delete_avatar(id, res)
  }
}
