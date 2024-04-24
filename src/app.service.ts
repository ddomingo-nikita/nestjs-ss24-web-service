import {HttpStatus, Injectable, Req, Res} from '@nestjs/common';
import {Avatar} from "./types/Avatar";
import {Response} from "express"
import * as fs from "fs";
import * as path from "path";
import {v4 as uuidv4} from "uuid"
import { avatarSchema } from './schemas/avatar.schema';

@Injectable()
export class AppService {
    create_avatar(avatar: Avatar, response: Response) {
        try {
            const avatarArray = JSON.parse(fs.readFileSync(path.resolve("./src/database/avatars.json"), "utf-8"))

            const {error, value} = avatarSchema.validate(avatar)

            if(error){
                response.status(400).send(error)
                return
            }

            const newAvatar = {id: uuidv4(), ...avatar, createdAt: new Date().toISOString()}

            fs.writeFileSync(path.resolve("./src/database/avatars.json"), JSON.stringify([...avatarArray, newAvatar]))
            response.status(HttpStatus.CREATED).location(`/api/avatars/${newAvatar.id}`).send(newAvatar)
        } catch (e) {
            response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    get_all_avatars(response: Response) {
        try {
            const avatarArray = JSON.parse(fs.readFileSync(path.resolve("./src/database/avatars.json"), "utf-8"))

            response.status(HttpStatus.OK).send(avatarArray)
        } catch (e) {
            response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    get_avatar_by_id(id: string, response: Response) {
        try {
            const avatar = JSON.parse(fs.readFileSync(path.resolve("./src/database/avatars.json"), "utf-8")).find((av: Avatar) => av.id === id)
            if (avatar)
                response.status(HttpStatus.OK).send(avatar)
            else
                response.sendStatus(HttpStatus.NOT_FOUND)
        } catch (e) {
            response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    update_avatar(updateFields: Avatar, id: string,  response: Response) {
        try {
            const allAvatars = JSON.parse(fs.readFileSync(path.resolve("./src/database/avatars.json"), "utf-8"))

            const prevAvatar = allAvatars.find((av: Avatar) => av.id === id)

            const {error, value} = avatarSchema.validate(updateFields)

            if(error){
                response.status(400).send(error)
                return
            }

            if(!prevAvatar){
                response.sendStatus(HttpStatus.NOT_FOUND)
            }
            else{
                allAvatars[allAvatars.indexOf(prevAvatar)] = {...prevAvatar, ...updateFields}
                fs.writeFileSync(path.resolve("./src/database/avatars.json"), JSON.stringify(allAvatars))
                response.sendStatus(HttpStatus.NO_CONTENT)
            }

        } catch (e) {
            console.log(e)
            response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    delete_avatar(id: string, response: Response){
        try {
            const allAvatars = JSON.parse(fs.readFileSync(path.resolve("./src/database/avatars.json"), "utf-8"))

            const avatarIndex = allAvatars.findIndex((av: Avatar) => av.id === id)

            if(avatarIndex===-1){
                response.sendStatus(HttpStatus.NOT_FOUND)
            }
            else{
                allAvatars.splice(avatarIndex, 1)
                fs.writeFileSync(path.resolve("./src/database/avatars.json"), JSON.stringify(allAvatars))
                response.sendStatus(HttpStatus.NO_CONTENT)
            }

        } catch (e) {
            console.log(e)
            response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}
