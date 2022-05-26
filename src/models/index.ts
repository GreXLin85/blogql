import { Comment as _Comment } from './Comment'
import { Post as _Post } from './Post'
import { User as _User } from './User'
import { hashSync } from 'bcryptjs'
import db from '../db'

export {
  _Post as Post,
  _User as User,
  _Comment as Comment
}

/* const Cache = new SequelizeSimpleCache({
  User: {},
  Post: {},
  Comment: {}
}) */

export function initModels () {
  const sequelize = db

  const Post = (_Post.initModel(sequelize))
  const User = (_User.initModel(sequelize))
  const Comment = (_Comment.initModel(sequelize))

  // Hooks
  User.addHook('beforeCreate', (user: _User) => {
    user.password = hashSync(user.password, 10)
  })
  User.addHook('beforeUpdate', (user: _User) => {
    user.changed('password') && (user.password = hashSync(user.password, 10))
  })

  // Associations
  Post.belongsTo(User, {
    as: 'user',
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
  User.hasMany(Comment, {
    as: 'comments',
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
