import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize
} from 'sequelize'
import type { Post } from '../Post/post.model'
import type { User } from '../User/user.model'

type CommentAssociations = 'user' | 'post'

export class Comment extends Model<
  InferAttributes<Comment, {omit: CommentAssociations}>,
  InferCreationAttributes<Comment, {omit: CommentAssociations}>
> {
  declare id: CreationOptional<number>
  declare text: string | null
  declare createdBy: number | null
  declare postId: number | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // Comment belongsTo User
  declare user?: NonAttribute<User>
  declare getUser: BelongsToGetAssociationMixin<User>
  declare setUser: BelongsToSetAssociationMixin<User, number>
  declare createUser: BelongsToCreateAssociationMixin<User>

  // Comment belongsTo Post
  declare post?: NonAttribute<Post>
  declare getPost: BelongsToGetAssociationMixin<Post>
  declare setPost: BelongsToSetAssociationMixin<Post, number>
  declare createPost: BelongsToCreateAssociationMixin<Post>

  declare static associations: {
    user: Association<Comment, User>,
    post: Association<Comment, Post>
  }

  static initModel (sequelize: Sequelize): typeof Comment {
    Comment.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING
      },
      createdBy: {
        type: DataTypes.INTEGER
      },
      postId: {
        type: DataTypes.INTEGER
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

    return Comment
  }
}
