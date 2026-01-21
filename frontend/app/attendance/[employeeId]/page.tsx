'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Attendance {
  _id: string;
  employee: {
    employeeId: string;
    fullName: string;
    email: string;
    department: string;
  };
  date: string;
  status: 'Present' | 'Absent';
}

export default function EmployeeAttendancePage() {
  const params = useParams();
  const employeeId = params.employeeId as string;
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [totalPresentDays, setTotalPresentDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (employeeId) {
      fetchAttendance();
    }
  }, [employeeId]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/attendance/employee/${employeeId}`);
      if (response.data.success) {
        setAttendances(response.data.attendances);
        setTotalPresentDays(response.data.totalPresentDays);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading attendance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/attendance">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attendance
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const employee = attendances[0]?.employee;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          
            <Button variant="ghost" className="mb-4 group" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back 
            </Button>
          <h1 className="text-3xl font-bold">Employee Attendance</h1>
          {employee && (
            <p className="text-muted-foreground mt-2">
              {employee.fullName} ({employee.employeeId})
            </p>
          )}
        </div>
      </div>

      {employee && (
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{employee.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{employee.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Present Days</p>
                <p className="font-medium text-green-600">{totalPresentDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {attendances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found for this employee.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((attendance) => (
                  <TableRow key={attendance._id}>
                    <TableCell className="font-medium">{attendance.date}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          attendance.status === 'Present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {attendance.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
