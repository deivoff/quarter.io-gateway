import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Table
export class User extends Model<User> {
  @PrimaryKey
  @Field()
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @Field({ description: 'Email of the user.' })
  @Unique
  @Column
  public email!: string;

  @Field()
  @Column
  public givenName!: string;

  @Field()
  @Column
  public familyName!: string;

  @Field()
  @Column
  public fatherName!: string;

  @Field()
  @Column
  public password!: string;

  @Field()
  @CreatedAt
  public createdAt!: Date;

  @Field()
  @UpdatedAt
  public updatedAt!: Date;
}
