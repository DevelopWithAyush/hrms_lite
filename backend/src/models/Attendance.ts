import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD format
  status: 'Present' | 'Absent';
  createdAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    status: {
      type: String,
      enum: ['Present', 'Absent'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one attendance per employee per date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
