
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/lib/interfaces/types';

interface CommonFieldsProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  id: string;
  setId: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  role: UserRole;
  setRole: (value: UserRole) => void;
}

export const CommonFields: React.FC<CommonFieldsProps> = ({
  name, setName,
  email, setEmail,
  phone, setPhone,
  id, setId,
  password, setPassword,
  role, setRole
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder={role === 'admin' ? "your.email@admin.com" : role === 'teacher' ? "your.email@faculty.com" : "your.email@college.com"}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          {role === 'admin' ? "Admins must use @admin.com email domain" : 
           role === 'teacher' ? "Faculty must use @faculty.com email domain" : 
           "Students must use @college.com email domain"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          placeholder="+1234567890"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">For password recovery via OTP</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="id">Student/Faculty ID</Label>
        <Input
          id="id"
          placeholder="e.g., S12345 or F67890"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={role} 
          onValueChange={(value) => setRole(value as UserRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Faculty</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default CommonFields;
