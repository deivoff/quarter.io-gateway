import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthData } from './auth.type';
import { Resolver, Query, Arg } from 'type-graphql'
import { User } from '../user';

@Resolver(of => AuthData)
export class AuthResolver {
  @Query(returns => AuthData)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<AuthData> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User is not exist!');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect!');
      }

      const token = jwt.sign({
        _id: user.id,
        email,
        familyName: user.familyName,
        givenName: user.givenName,
        fatherName: user.fatherName
      }, 'somebody', {
        expiresIn: '1h',
      });

      return {
        _id: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw error;
    }
  }
}
