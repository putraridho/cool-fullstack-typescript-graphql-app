import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Post {

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt!: Date;

  @Property()
  updatedAt!: Date;

  @Property({ columnType: 'text' })
  title!: string;

}
