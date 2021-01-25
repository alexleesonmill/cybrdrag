const mongoose = require('mongoose');

const PerformerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  worth: {
    type: Number,
    default: 2000,
  },
  performancehistory: {
    type: [
      {
        netearned: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  costperperformance: {
    type: Number,
    default: 100,
  },
});

PerformerSchema.methods.perform = async function () {
  let netRevenue = Performer.calculateEarning() - this.costperperformance;

  this.performancehistory.push({
    netearned: netRevenue,
  });
  this.worth += netRevenue;

  await this.save();
};

PerformerSchema.statics.calculateEarning = function () {
  return Math.floor(Math.random() * 501);
};

module.exports = Performer = mongoose.model('performer', PerformerSchema);
