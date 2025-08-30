import mongoose from 'mongoose';
const MatchSchema = new mongoose.Schema({
leagueSlug: String,
round: Number,
home: String,
away: String,
scoreHome: Number,
scoreAway: Number,
date: Date
});
MatchSchema.index({ leagueSlug: 1, round: 1, home: 1, away: 1 }, { unique: true });
export default mongoose.model('Match', MatchSchema);