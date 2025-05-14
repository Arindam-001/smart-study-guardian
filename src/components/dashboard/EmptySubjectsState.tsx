
import React from 'react';

const EmptySubjectsState: React.FC = () => {
  return (
    <div className="text-center py-8 bg-muted rounded-lg">
      <p className="text-muted-foreground">
        No subjects available for your current semester.
      </p>
    </div>
  );
};

export default EmptySubjectsState;
