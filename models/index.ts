import { Post as _Post } from './Post'
import { User as _User } from './User'
import { Comment as _Comment } from './Comment'
import db from '../db'
import { hashSync } from "bcryptjs";
import { InstanceUpdateOptions } from 'sequelize/types';
import SequelizeSimpleCache from 'sequelize-simple-cache';

export {
  _Post as Post,
  _User as User,
  _Comment as Comment
}

const Cache = new SequelizeSimpleCache({
  User: {},
  Post: {},
  Comment: {}
});


export function initModels() {
  let sequelize = db

  let Post = Cache.init(_Post.initModel(sequelize))
  let User = Cache.init(_User.initModel(sequelize))
  let Comment = Cache.init(_Comment.initModel(sequelize))

  // Hooks
  User.addHook('beforeCreate', (user: _User) => {
    user.password = hashSync(user.password, 10)
  })
  User.addHook('beforeUpdate', (user: _User, options: InstanceUpdateOptions) => {
    user.changed("password") && (user.password = hashSync(user.password, 10))
  })

  //Associations
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
