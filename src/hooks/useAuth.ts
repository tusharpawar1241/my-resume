import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthInstance';

export const useAuth = () => useContext(AuthContext);
