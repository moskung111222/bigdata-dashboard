import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

const DatasetTableSchema = new mongoose.Schema({
  sheet_name: String,
  columns_json: Object,
  row_count: Number
}, { _id: false });

const DatasetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  source_type: { type: String, enum: ['excel', 'google'], required: true },
  file_path: String,
  google_sheet_id: String,
  public: { type: Boolean, default: true },
  tables: [DatasetTableSchema]
}, { timestamps: true });

const ChartSchema = new mongoose.Schema({
  title: String,
  chart_type: { type: String, enum: ['bar','line','pie'] },
  dataset_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' },
  sheet_name: String,
  config_json: Object,
  public: { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export const Dataset = mongoose.model('Dataset', DatasetSchema);
export const Chart = mongoose.model('Chart', ChartSchema);

export async function initSchema() {
  // with mongoose models, indexes are created automatically when needed
  await User.init();
  await Dataset.init();
  await Chart.init();
}
