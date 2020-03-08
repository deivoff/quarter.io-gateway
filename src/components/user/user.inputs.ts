import { InputType, Field } from 'type-graphql'

import { User } from './user.model'

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  email!: string;

  @Field()
  givenName!: string;

  @Field()
  familyName!: string;

  @Field()
  fatherName!: string;

  @Field()
  password!: string;
}
