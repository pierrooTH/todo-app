import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: ['à faire', 'en cours', 'terminée'], default: 'à faire' })
  status: string;
  id: any;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
