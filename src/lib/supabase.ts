import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database helper functions
export const getLoanApplications = async (userId: string) => {
  const { data, error } = await supabase
    .from('loan_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createLoanApplication = async (application: Partial<import('../types').LoanApplication>) => {
  const { data, error } = await supabase
    .from('loan_applications')
    .insert([application])
    .select()
    .single();
  return { data, error };
};

export const updateLoanApplication = async (id: string, updates: Partial<import('../types').LoanApplication>) => {
  const { data, error } = await supabase
    .from('loan_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const submitContactForm = async (formData: import('../types').ContactForm) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([formData])
    .select()
    .single();
  return { data, error };
};