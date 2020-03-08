import { ID, Int, ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AuthData {
  @Field(() => ID)
  _id!: string;

  @Field()
  token!: string;

  @Field(() => Int)
  tokenExpiration!: number;
}

export interface DecodedToken {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  fatherName: string;
  exp: number;
}
