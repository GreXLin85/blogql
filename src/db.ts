import { Options } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'
import configs from './config/config'
import path from 'path'

const env = process.env.NODE_ENV || 'development'
const config = (configs as { [key: string]: Options })[env]

const db = new Sequelize({
  ...config,
  define: {
    underscored: true
  },
  models: [
    path.join(__dirname, 'features/**/*.schema.ts'),
    path.join(__dirname, 'models/**/*.schema.js')
  ]
})

export default db
