import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export const useAuth = (strict: boolean = false) => {
    const router = useRouter();

    useFocusEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (!user) {
                    router.replace('/login');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                router.replace('/login');
            }
        };

        if (strict) {
            checkAuth();
        }

        return () => {
        };
    });
};

export default useAuth;
