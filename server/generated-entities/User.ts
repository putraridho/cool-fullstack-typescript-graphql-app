import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class User {

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt!: Date;

  @Property()
  updatedAt!: Date;

  @Unique({ name: 'user_username_unique' })
  @Property({ columnType: 'text' })
  username!: string;

  @Property({ columnType: 'text' })
  password!: string;

}
