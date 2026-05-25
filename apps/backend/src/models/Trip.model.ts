import mongoose, { type Document, type Model, Schema, type Types } from 'mongoose';

interface IActivity {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
}

interface IDayPlan {
  dayNumber: number;
  activities: IActivity[];
}

interface IPackingItem {
  id: string;
  name: string;
  essential: boolean;
  quantity: number | null;
}

interface IPackingCategory {
  category: string;
  items: IPackingItem[];
}

export interface ITrip extends Document {
  userId: Types.ObjectId;
  destination: string;
  numberOfDays: number;
  budgetType: 'low' | 'medium' | 'high';
  interests: string[];
  itinerary: IDayPlan[];
  budgetEstimate: Record<string, number> | null;
  hotelSuggestions: Record<string, unknown>[];
  packingList: IPackingCategory[];
  customNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimatedCost: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const dayPlanSchema = new Schema<IDayPlan>(
  {
    dayNumber: { type: Number, required: true },
    activities: { type: [activitySchema], default: [] },
  },
  { _id: false },
);

const packingItemSchema = new Schema<IPackingItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    essential: { type: Boolean, default: false },
    quantity: { type: Number, default: null },
  },
  { _id: false },
);

const packingCategorySchema = new Schema<IPackingCategory>(
  {
    category: { type: String, required: true },
    items: { type: [packingItemSchema], default: [] },
  },
  { _id: false },
);

const tripSchema = new Schema<ITrip>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    destination: { type: String, required: true },
    numberOfDays: { type: Number, required: true, min: 1 },
    budgetType: { type: String, enum: ['low', 'medium', 'high'], required: true },
    interests: { type: [String], default: [] },
    itinerary: { type: [dayPlanSchema], default: [] },
    budgetEstimate: { type: Schema.Types.Mixed, default: null },
    hotelSuggestions: { type: Schema.Types.Mixed, default: [] },
    packingList: { type: [packingCategorySchema], default: [] },
    customNotes: { type: String },
  },
  { timestamps: true },
);

// Compound index for efficient per-user trip listing sorted by newest first
tripSchema.index({ userId: 1, createdAt: -1 });

tripSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as any).__v;
    return ret;
  },
});

export const TripModel: Model<ITrip> = mongoose.model<ITrip>('Trip', tripSchema);
