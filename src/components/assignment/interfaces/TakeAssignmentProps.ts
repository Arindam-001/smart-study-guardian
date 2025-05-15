
import { Assignment } from '@/lib/interfaces/types';

export interface TakeAssignmentProps {
  assignment: Assignment;
  onComplete?: () => void;
}
