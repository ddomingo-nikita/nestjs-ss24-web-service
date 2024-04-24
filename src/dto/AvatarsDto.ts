import {IsNotEmpty, IsString} from "class-validator";

export class AvatarsDto{
    id?:string;
    avatarName: string;
    childAge: number;
    skinColor: string;
    hairstyle: string;
    headShape: string;
    upperClothing: string;
    lowerClothing: string;
    createdAt?:string;
}