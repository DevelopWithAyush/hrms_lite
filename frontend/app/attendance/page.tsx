'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Filter } from 'lucide-react';

const attendanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['Present', 'Absent'], {
    errorMap: () => ({ message: 'Status is required' }),
  }),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
}

interface Attendance {
  _id: string;
  employee: Employee;
  date: string;
  status: 'Present' | 'Absent';
}

export default function AttendancePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (date?: string) => {
    try {
      setLoadingAttendance(true);
      let url = '/attendance/summary';
      if (date) {
        url = `/attendance/date?date=${date}`;
      }
      const response = await api.get(url);
      if (response.data.success) {
        setAttendances(response.data.attendances || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoadingAttendance(false);
    }
  };

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await api.post('/attendance', data);

      if (response.data.success) {
        setSuccess('Attendance marked successfully');
        reset({
          date: new Date().toISOString().split('T')[0],
        });
        fetchAttendance(filterDate || undefined);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilter = () => {
    if (filterDate) {
      fetchAttendance(filterDate);
    } else {
      fetchAttendance();
    }
  };

  const handleClearFilter = () => {
    setFilterDate('');
    fetchAttendance();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground mt-2">Mark and view employee attendance</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Mark Attendance Form - At the top */}
      <Card className="shadow-sm border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            Mark Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="employeeId" className="text-sm font-medium">Employee *</Label>
                <Select
                  id="employeeId"
                  {...register('employeeId')}
                  disabled={submitting}
                  className="w-full"
                >
                  <option value="">Select an employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId} - {emp.fullName}
                    </option>
                  ))}
                </Select>
                {errors.employeeId && (
                  <p className="text-sm text-destructive">{errors.employeeId.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  disabled={submitting}
                  className="w-full"
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
                <Select
                  id="status"
                  {...register('status')}
                  disabled={submitting}
                  className="w-full"
                >
                  <option value="">Select status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2 flex items-end md:col-span-1">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Marking...' : 'Mark Attendance'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Attendance Records with Filter Inside */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                Attendance Records
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Click on any row to view full attendance history for that employee
              </p>
            </div>
            <div className="flex items-end gap-2 flex-wrap">
              <div className="space-y-2">
                <Label htmlFor="filterDate" className="text-xs text-muted-foreground">
                  Filter by Date
                </Label>
                <Input
                  id="filterDate"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-[160px] h-9"
                />
              </div>
              <Button
                type="button"
                onClick={handleFilter}
                variant="default"
                size="sm"
                className="h-9"
              >
              
               Apply
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilter}
                size="sm"
                className="h-9"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loadingAttendance ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading attendance...</p>
              </div>
            </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Employee ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((attendance) => (
                    <TableRow
                      key={attendance._id}
                      className="cursor-pointer hover:bg-primary/5 transition-all duration-200 border-b last:border-0"
                      onClick={() => router.push(`/attendance/${attendance.employee._id}`)}
                    >
                      <TableCell className="font-medium">{attendance.date}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {attendance.employee.employeeId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {attendance.employee.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {attendance.employee.email}
                      </TableCell>
                      <TableCell>{attendance.employee.department}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${attendance.status === 'Present'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                        >
                          {attendance.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
