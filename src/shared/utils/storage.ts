import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

// Storage implementation for Zustand persist middleware using AsyncStorage
export const zustandStorage = createJSONStorage(() => AsyncStorage);
