import mongoose from 'mongoose';
const FormationSchema = new mongoose.Schema({
team: String,
module: String,
players: [String],
notes: String,
matchId: String,
updatedAt: { type: Date, default: Date.now }
});
export default mongoose.model('Formation', FormationSchema);