import { Post } from './Post'
import { User } from './User'
import { Comment } from './Comment'
import db from '../db'
import { hashSync } from "bcryptjs";

export {
  Post,
  User,
  Comment
}

export function initModels() {
  let sequelize = db

  Post.initModel(sequelize)
  User.initModel(sequelize)
  Comment.initModel(sequelize)

  // Hooks
  User.addHook('beforeCreate', (user: User) => {
    user.password = hashSync(user.password, 10)
  })
  // TODO: add hooks for update password


  //Associations


  Post.belongsTo(User, {
    as: 'created_by',
    foreignKey: 'createdBy'
  })
  Post.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'postId'
  })
  User.hasMany(Post, {
    as: 'posts',
    foreignKey: 'createdBy'
  })
  Comment.belongsTo(User, {
    as: 'user',
    foreignKey: 'createdBy'
  })
  Comment.belongsTo(Post, {
    as: 'post',
    foreignKey: 'postId'
  })

  return {
    Post,
    User,
    Comment
  }
}
