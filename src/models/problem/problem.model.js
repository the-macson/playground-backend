const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Title is required.'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required.'],
    },
    difficulty: {
      type: String,
      trim: true,
      required: [true, 'Difficulty is required.'],
      enum: ['easy', 'medium', 'hard'],
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: 'tags',
    },
    input: {
      type: [String],
      trim: true,
      required: [true, 'Input is required.'],
    },
    output: {
      type: [String],
      trim: true,
      required: [true, 'Output is required.'],
    },
  },
  { timestamps: true },
);

const Problem = mongoose.models.problems || mongoose.model('problems', problemSchema);

module.exports = Problem;
