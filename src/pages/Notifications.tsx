
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { AlertTriangle, User } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const { user, warnings, users } = useAppContext();
  
  if (!user) {
    navigate('/');
    return null;
  }

  // Filter warnings based on user role
  const filteredWarnings = user.role === 'student' 
    ? warnings.filter(warning => warning.studentId === user.id)
    : warnings;
  
  return (
    <DashboardLayout title="Notifications & Alerts">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Monitoring Alerts</h3>
        
        {filteredWarnings.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <h3 className="text-lg font-medium text-edu-dark">No notifications</h3>
            <p className="text-muted-foreground mt-2">
              {user.role === 'student' 
                ? 'You have no warnings or notifications at this time. Keep up the good work!'
                : 'No suspicious activities have been detected in assignments.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWarnings.map((warning) => {
              const studentInfo = users.find(u => u.id === warning.studentId);
              
              return (
                <Card key={warning.id} className="bg-red-50 border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-edu-danger flex items-center gap-2 text-lg">
                      <AlertTriangle size={18} />
                      Suspicious Activity Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{warning.reason}</p>
                    
                    {user.role !== 'student' && studentInfo && (
                      <div className="mt-2 p-2 bg-white rounded-md flex items-center gap-2">
                        <User size={16} />
                        <div>
                          <p className="font-medium">{studentInfo.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {studentInfo.id}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">
                        Assignment ID: {warning.assignmentId}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(warning.timestamp), 'dd MMM yyyy HH:mm:ss')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
