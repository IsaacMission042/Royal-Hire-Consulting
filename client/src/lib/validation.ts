import React from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (data: Record<string, string>, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(field => {
    const value = data[field] || '';
    const rule = rules[field];

    if (rule.required && !value.trim()) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      return;
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`;
      return;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be less than ${rule.maxLength} characters`;
      return;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} format is invalid`;
      return;
    }

    if (value && rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });

  return errors;
};

export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !value.includes('@')) return 'Please enter a valid email address';
      return null;
    }
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value && value.length < 6) return 'Password must be at least 6 characters';
      return null;
    }
  },
  accessCode: {
    required: true,
    minLength: 6,
    maxLength: 6,
    pattern: /^\d{6}$/,
    custom: (value: string) => {
      if (value && !/^\d{6}$/.test(value)) return 'Access code must be exactly 6 digits';
      return null;
    }
  },
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    custom: (value: string) => {
      if (value && value.trim().split(' ').length < 2) return 'Please enter your full name';
      return null;
    }
  },
  phoneNumber: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      if (value && value.length < 10) return 'Please enter a valid phone number';
      return null;
    }
  }
};

export const useFormValidation = (initialData: Record<string, string>, rules: ValidationRules) => {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string) => {
    const fieldRules = { [field]: rules[field] };
    const fieldData = { [field]: value };
    const fieldErrors = validateForm(fieldData, fieldRules);
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors[field] || ''
    }));
  };

  const handleChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, data[field]);
  };

  const validateAll = () => {
    const allErrors = validateForm(data, rules);
    setErrors(allErrors);
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(allErrors).length === 0;
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  };
};

// React import moved to top