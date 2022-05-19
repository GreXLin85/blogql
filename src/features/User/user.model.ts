import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize
} from 'sequelize'
import type { Comment } from '../Comment/comment.model'
import type { Post } from '../Post/post.model'

type UserAssociations = 'posts' | 'comments'

export class User extends Model<
  InferAttributes<User, { omit: UserAssociations }>,
  InferCreationAttributes<User, { omit: UserAssociations }>
> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // User hasMany Post
  declare posts?: NonAttribute<Post[]>
  declare getPosts: HasManyGetAssociationsMixin<Post>
  declare setPosts: HasManySetAssociationsMixin<Post, number>
  declare addPost: HasManyAddAssociationMixin<Post, number>
  declare addPosts: HasManyAddAssociationsMixin<Post, number>
  declare createPost: HasManyCreateAssociationMixin<Post, 'createdBy'>
  declare removePost: HasManyRemoveAssociationMixin<Post, number>
  declare removePosts: HasManyRemoveAssociationsMixin<Post, number>
  declare hasPost: HasManyHasAssociationMixin<Post, number>
  declare hasPosts: HasManyHasAssociationsMixin<Post, number>
  declare countPosts: HasManyCountAssociationsMixin

  // User hasMany Comment
  declare comments?: NonAttribute<Comment[]>
  declare getComments: HasManyGetAssociationsMixin<Comment>
  declare setComments: HasManySetAssociationsMixin<Comment, number>
  declare addComment: HasManyAddAssociationMixin<Comment, number>
  declare addComments: HasManyAddAssociationsMixin<Comment, number>
  declare createComment: HasManyCreateAssociationMixin<Comment, 'createdBy'>
  declare removeComment: HasManyRemoveAssociationMixin<Comment, number>
  declare removeComments: HasManyRemoveAssociationsMixin<Comment, number>
  declare hasComment: HasManyHasAssociationMixin<Comment, number>
  declare hasComments: HasManyHasAssociationsMixin<Comment, number>
  declare countComments: HasManyCountAssociationsMixin

  declare static associations: {
    posts: Association<User, Post>,
    comments: Association<User, Comment>
  }

  static initModel (sequelize: Sequelize): typeof User {
    User.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize
    })

    return User
  }
}
