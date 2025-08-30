import mongoose from 'mongoose';
const StandingSchema = new mongoose.Schema({
leagueSlug: { type: String, index: true },
competition: { type: String, default: 'campionato' },
team: String,
played: Number,
wins: Number,
draws: Number,
losses: Number,
goalsFor: Number,
goalsAgainst: Number,
goalDiff: Number,
points: Number,
updatedAt: { type: Date, default: Date.now }
});
StandingSchema.index({ leagueSlug: 1, competition: 1, team: 1 }, { unique: true });
export default mongoose.model('Standing', StandingSchema);