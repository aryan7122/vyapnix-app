import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { ArrowLeft, User, Mail, Store, Phone } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { authScreenData } from '../../src/data/authScreenData';
import { CustomInput, SearchableDropdown } from '../../src/components/forms/FormUI';
import { UploadFile } from '../../src/components/upload/uploader';
import { AppDispatch, RootState } from '../../src/redux/store';
import { registerUser, clearError } from '../../src/redux/authSlice';
import { businessTypes } from '../../src/data/businessTypesData';
import auth from '@react-native-firebase/auth';


export default function RegisterScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const dispatch: AppDispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const t = (authScreenData[locale as 'en'|'hi'|'en-HI'] || authScreenData.en).register;

    const [userType, setUserType] = useState<'user' | 'business'>('user');
    const [avatar, setAvatar] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [businessType, setBusinessType] = useState('');

    useEffect(() => {
        if (error) {
            Alert.alert('Registration Error', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0]);
        }
    };

    const handleCreateAccount = async () => {
        if (!fullName.trim()) {
            Alert.alert('Required Field', 'Please enter your full name.');
            return;
        }
        if (userType === 'business' && !businessType) {
            Alert.alert('Required Field', 'Please select a business type.');
            return;
        }

        try {
            const currentUser = auth().currentUser;
            if (!currentUser) {
                throw new Error("User is not authenticated. Please login again.");
            }
            
            const idToken = await currentUser.getIdToken();

            const formData = new FormData();
            formData.append('idToken', idToken);
            formData.append('fullName', fullName);
            formData.append('role', userType);
            if (email) formData.append('email', email);
            if (userType === 'business') {
                formData.append('businessType', businessType);
            }

            if (avatar) {
                const uriParts = avatar.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                
                const file = {
                  uri: Platform.OS === 'android' ? avatar.uri : avatar.uri.replace('file://', ''),
                  name: `avatar.${fileType}`,
                  type: `image/${fileType}`,
                }
                // FIX: Appending the file object directly is the correct way for FormData
                formData.append('avatar', file as any);
            }

            dispatch(registerUser(formData));

        } catch(e: any) {
            Alert.alert("Error", e.message);
        }
    };

    return (
        <SafeAreaView style={[tw`flex-1 pt-10`, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={tw`p-6`} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => router.back()} style={tw`mb-6`}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <Text style={[tw`text-3xl font-bold`, { color: theme.colors.text }]}>{t.title}</Text>
                <Text style={[tw`text-base mt-2 mb-8`, { color: theme.colors.textSecondary }]}>{t.subtitle}</Text>

                <UploadFile 
                    avatarUrl={avatar?.uri || 'https://i.pravatar.cc/300'} 
                    onPress={pickImage} 
                    label="Upload Profile Photo (Optional)" 
                />

                <View style={[tw`flex-row rounded-lg p-1 my-4`, { backgroundColor: theme.colors.card }]}>
                    <TouchableOpacity onPress={() => setUserType('user')} style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: userType === 'user' ? theme.colors.primary : 'transparent' }]}>
                        <Text style={{ color: userType === 'user' ? 'white' : theme.colors.text }}>{t.user}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setUserType('business')} style={[tw`flex-1 p-3 rounded-lg items-center`, { backgroundColor: userType === 'business' ? theme.colors.primary : 'transparent' }]}>
                        <Text style={{ color: userType === 'business' ? 'white' : theme.colors.text }}>{t.business}</Text>
                    </TouchableOpacity>
                </View>
                
                <CustomInput label="Full Name (Required)" icon={User} value={fullName} onChangeText={setFullName} />
                <CustomInput label="Email Address (Optional)" icon={Mail} keyboardType="email-address" value={email} onChangeText={setEmail} />

                {userType === 'business' && (
                    <SearchableDropdown
                        label="Type of Business (Required)"
                        data={businessTypes}
                        onSelect={(item) => setBusinessType(item.value)}
                        selectedValue={businessType}
                    />
                )}

                <TouchableOpacity onPress={handleCreateAccount} disabled={loading === 'pending'} style={[tw`mt-4 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary }]}>
                    <Text style={tw`text-white text-lg font-bold`}>{loading === 'pending' ? 'Creating Account...' : t.button}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

