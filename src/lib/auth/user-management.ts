
import { supabase } from '../supabase';
import { User, UserRole } from '../interfaces/types';

export const signUp = async (
  name: string,
  email: string,
  password: string,
  id: string,
  role: UserRole,
  currentSemester: number = 1
): Promise<boolean> => {
  try {
    // First, check if the email already exists by properly parameterizing the query
    const { data: existingEmail, error: emailError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (emailError && emailError.code !== 'PGRST116') {
      console.error('Error checking existing email:', emailError);
      return false;
    }

    if (existingEmail) {
      console.log('Email already exists:', existingEmail);
      return false;
    }

    // Then check if the ID already exists
    const { data: existingId, error: idError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (idError && idError.code !== 'PGRST116') {
      console.error('Error checking existing ID:', idError);
      return false;
    }

    if (existingId) {
      console.log('ID already exists:', existingId);
      return false;
    }

    // Register with Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      console.error('Auth registration error:', error?.message);
      return false;
    }

    // Create user in database
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id,
        name,
        email,
        role,
        current_semester: role === 'student' ? currentSemester : 0,
        accessible_semesters: role === 'student' ? [currentSemester] : [1, 2, 3, 4, 5, 6, 7, 8],
        auth_id: data.user.id,
      });

    if (insertError) {
      console.error('Database registration error:', insertError);
      // If user creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(data.user.id);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};
