import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft, User } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useDispatch, useSelector } from 'react-redux';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { authScreenData } from '../../src/data/authScreenData';
import { CustomInput } from '../../src/components/forms/FormUI';
import { ImprovedOtpInput } from '../../src/components/forms/ImprovedOtpInput';
import { AppDispatch, RootState } from '../../src/redux/store';
import { verifyOtp, clearError, signOut as signOutAction, registerUser } from '../../src/redux/authSlice';

export default function LoginScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const dispatch: AppDispatch = useDispatch();
    const { loading, error, isNewUser, user } = useSelector((state: RootState) => state.auth);

    const t = (authScreenData[locale as 'en' | 'hi' | 'en-HI'] || authScreenData.en).login;

    const [step, setStep] = useState('phone');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');

    // --- Naye Badlav ---
    const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    useEffect(() => {
        if (error) {
            Alert.alert('Authentication Error', error);
            setIsSendingOtp(false); // Loading state ko reset karein
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (isNewUser) {
            router.push('/register');   // ✅ new user ho to registration page
        } else if (user) {
            router.replace('/(tabs)/home'); // ✅ existing user ho to home
        }
    }, [isNewUser, user, router]);


    const handleSendOtp = async () => {
        if (mobileNumber.length < 10) {
            Alert.alert("Invalid Input", "Please enter a valid 10-digit mobile number.");
            return;
        }
        setIsSendingOtp(true);
        try {
            const confirmation = await auth().signInWithPhoneNumber(`+91${mobileNumber}`);
            setConfirm(confirmation);
            setStep('otp');
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6 || !confirm) {
            Alert.alert('Invalid Input', 'Please enter the 6-digit OTP.');
            return;
        }
        try {
            const userCredential = await confirm.confirm(otp);
            if (!userCredential) {
                throw new Error("Could not verify OTP. Please try again.");
            }

            const idToken = await userCredential.user.getIdToken();

            // Sirf token bhej backend ko check karne ke liye
            const formData = new FormData();
            formData.append('idToken', idToken);

            dispatch(registerUser(formData)); // ye ab sirf check karega

        } catch (e: any) {
            Alert.alert('Error', e.message || 'Invalid OTP code.');
        }
    };

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`flex-grow justify-center p-6 pt-4`} keyboardShouldPersistTaps="handled">
                    {step === 'otp' && (
                        <TouchableOpacity onPress={() => { setStep('phone'); setConfirm(null); }} style={tw`absolute top-6 left-6 z-10 mt-10 p-2`}>
                            <ArrowLeft size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    )}
                    <View style={tw`items-center`}>
                        <Image
                            source={{ uri: "https://assets-v2.lottiefiles.com/a/2687f5ac-1702-11ef-8647-f31ff7ccd19f/ppoh7rTFRc.gif" }}
                            style={tw`w-64 h-64 mb-8`}
                            contentFit="contain"
                        />
                    </View>
                    {step === 'phone' && (
                        <View>
                            <Text style={[tw`text-3xl font-bold mb-2`, { color: theme.colors.text }]}>{t.title}</Text>
                            <Text style={[tw`text-base mb-8`, { color: theme.colors.textSecondary }]}>{t.subtitle}</Text>
                            <CustomInput label="Mobile Number" icon={User} keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} maxLength={10} />
                            <TouchableOpacity onPress={handleSendOtp} disabled={isSendingOtp} style={[tw`mt-6 h-14 rounded-xl items-center justify-center shadow-md flex-row`, { backgroundColor: theme.colors.primary }]}>
                                {isSendingOtp && <ActivityIndicator color="white" style={tw`mr-2`} />}
                                <Text style={tw`text-white text-lg font-bold`}>{isSendingOtp ? 'Sending...' : t.button}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {step === 'otp' && (
                        <View>
                            <Text style={[tw`text-3xl font-bold mb-2`, { color: theme.colors.text }]}>{t.otpTitle}</Text>
                            <Text style={[tw`text-base mb-8`, { color: theme.colors.textSecondary }]}>{t.otpSubtitle} +91 {mobileNumber}</Text>
                            <ImprovedOtpInput label="Enter OTP" onCodeFilled={setOtp} />
                            <TouchableOpacity onPress={handleVerifyOtp} disabled={loading === 'pending'} style={[tw`mt-6 h-14 rounded-xl items-center justify-center shadow-md flex-row`, { backgroundColor: theme.colors.primary }]}>
                                {loading === 'pending' && <ActivityIndicator color="white" style={tw`mr-2`} />}
                                <Text style={tw`text-white text-lg font-bold`}>{loading === 'pending' ? 'Verifying...' : t.verifyButton}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

