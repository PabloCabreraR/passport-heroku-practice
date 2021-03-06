const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sportSchema = new Schema(
  {
    sport: {type: String, required: true}
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const Sport = mongoose.model('Sport', sportSchema)

module.exports = Sport