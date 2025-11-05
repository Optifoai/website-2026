import { supabase } from '../lib/supabase';
import { AuthAction } from '../types/auth.types';

export const signUp = async (
  email: string,
  password: string,
  dispatch: React.Dispatch<AuthAction>
): Promise<boolean> => {
  try {
    dispatch({ type: 'AUTH_LOADING' });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      return true;
    }

    return false;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred during sign up';
    dispatch({ type: 'AUTH_ERROR', payload: message });
    return false;
  }
};

export const signIn = async (
  email: string,
  password: string,
  dispatch: React.Dispatch<AuthAction>
): Promise<boolean> => {
  try {
    dispatch({ type: 'AUTH_LOADING' });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      return true;
    }

    return false;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred during sign in';
    console.error('Sign-in error:', error); // Log the full error object
    dispatch({ type: 'AUTH_ERROR', payload: message });
    if (error instanceof Error) {
      console.error('Sign-in error message:', error.message);
    }
    return false;
  }
};

export const signOut = async (dispatch: React.Dispatch<AuthAction>): Promise<void> => {
  try {
    dispatch({ type: 'AUTH_LOADING' });

    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    dispatch({ type: 'AUTH_LOGOUT' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred during sign out';
    dispatch({ type: 'AUTH_ERROR', payload: message });
  }
};
