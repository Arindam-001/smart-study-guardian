
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Basic validation - allows various formats
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

export const validateDomain = (email: string, role: string): boolean => {
  if (role === 'admin' && !email.endsWith('@admin.com')) {
    return false;
  }
  
  if (role === 'teacher' && !email.endsWith('@faculty.com')) {
    return false;
  }
  
  if (role === 'student' && !email.endsWith('@college.com')) {
    return false;
  }
  
  return true;
};
