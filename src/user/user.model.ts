import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EUserRole, IUser } from 'pepese-core/src/user';
import { Document } from 'mongoose';
import * as bcript from 'bcrypt';

export type UserDocument = User & Document;
@Schema()
export class User implements IUser {
  @Prop({ _id: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: EUserRole;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  async changePassword(currentPassword: string, newPassword: string) {
    if (currentPassword === newPassword) {
      throw 'error';
    }
    this.password = await this.hashPassword(newPassword);
  }
  async verifyPassword(rawPassword: string) {
    return await bcript.compare(rawPassword, this.password);
  }
  async hashPassword(rawPassword: string): Promise<string> {
    return await bcript.hash(rawPassword, await bcript.genSalt());
  }
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
