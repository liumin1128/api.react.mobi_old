import mongoose from 'mongoose';
import { test_test, pushAllDataToAlgolia } from '@/server/algolia';
import config from './schema';

const schema = new mongoose.Schema(config);

const model = mongoose.model('News', schema);

// pushAllDataToAlgolia(test_test, model, 'title content cover photos tags');

export default model;
