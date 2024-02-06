const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required.'],
      unique: true,
    },
  },
  { timestamps: true },
);

const Tag = mongoose.models.tags || mongoose.model('tags', tagSchema);

module.exports = Tag;
