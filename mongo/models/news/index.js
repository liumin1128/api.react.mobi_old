import mongoose from 'mongoose';
import config from './schema';

const schema = new mongoose.Schema(config);

export default mongoose.model('News', schema);
