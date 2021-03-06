const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {type: String, required: true, createIndexes: true},
    password: {type: String, required: true},
    sports: [{type: Schema.Types.ObjectId, ref: 'Sport'}],
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User