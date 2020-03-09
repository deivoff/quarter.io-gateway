import * as bcrypt from 'bcrypt';
import { User } from '$components/user/user.model';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { UserInput } from '.';

@Resolver(of => User)
export class UserResolver {
  @Mutation(returns => User)
  async createUser(
    @Arg('userInput', type => UserInput) {
      email,
      password,
      familyName,
      fatherName,
      givenName
    }: UserInput,
  ): Promise<User> {
    try {
      const userInDatabase = await User.findOne({ where: { email } });
      if (userInDatabase) {
        throw new Error('User is already exist!');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        familyName,
        fatherName,
        givenName,
        password: hashedPassword,
      });
      return (await user.save());
    } catch (err) {
      throw err;
    }
  }

  @Query(returns => [User])
  async getUsers(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      throw error;
    }
  }
}
