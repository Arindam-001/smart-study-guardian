
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AccessDeniedCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="py-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Access Denied</h2>
          <p className="mt-2">You do not have access to the faculty dashboard.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessDeniedCard;
