import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, FileText, Briefcase, Globe, Store, ArrowLeft } from 'lucide-react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';

// --- Contexts ---
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { RoleContext } from '../../context/RoleContext'; // ✨ FIX: RoleContext import karein

// --- UI aur Data Imports ---
import { CustomInput, CustomTextArea } from '../../components/forms/FormUI';
import { UploadFile } from '../../components/upload/uploader';
import { editProfileScreenData } from '../../data/editProfileScreenData';

type Locale = 'en' | 'hi' | 'en-HI';


export default function EditProfileForm() {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const { role } = useContext(RoleContext); // ✨ FIX: Active role pata karein
    const t = editProfileScreenData[locale as Locale];

    // Form ke liye alag-alag state
    const [name, setName] = useState('Aryan Kumar');
    const [bio, setBio] = useState('Exploring the world...');
    const [shopName, setShopName] = useState('Digital Solutions Hub');
    const [category, setCategory] = useState('IT Services');
    const [website, setWebsite] = useState('digitalsolutions.com');
    const [avatar, setAvatar] = useState('https://i.pravatar.cc/300?img=5');

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    // ✨ FIX: Title ko role ke hisaab se chunein
    const title = role === 'Business' ? t.businessTitle : t.userTitle;

    return (
        <SafeAreaView style={[tw` h-full mb-24`, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={tw`pl-4 pr-4 pb-4`}>
               

                <UploadFile
                    avatarUrl={avatar}
                    onPress={handlePickImage}
                    label={t.uploadLabel}
                />

                {/* ✨ FIX: Form ko role ke hisaab se dikhayein */}
                {role === 'Business' ? (
                    <>
                        {/* --- Business Fields --- */}
                        <CustomInput label={t.business.shopNameLabel} icon={Store} placeholder={t.business.shopNamePlaceholder} value={shopName} onChangeText={setShopName} />
                        <CustomInput label={t.business.categoryLabel} icon={Briefcase} placeholder={t.business.categoryPlaceholder} value={category} onChangeText={setCategory} />
                        <CustomInput label={t.business.websiteLabel} icon={Globe} placeholder={t.business.websitePlaceholder} value={website} onChangeText={setWebsite} />
                    </>
                ) : (
                    <>
                        {/* --- User Fields --- */}
                        <CustomInput label={t.nameLabel} icon={User} placeholder={t.namePlaceholder} value={name} onChangeText={setName} />
                        <CustomInput label={t.emailLabel} icon={Mail} value="aryan.k@example.com" editable={false} />
                        <CustomTextArea label={t.bioLabel} placeholder={t.bioPlaceholder} value={bio} onChangeText={setBio} />
                    </>
                )}

                <TouchableOpacity
                    style={[tw`mt-4 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                        Alert.alert("Saved!", "Your profile has been updated.");
                        onClose(); // Form band karne ke liye function call karein
                    }}                >
                    <Text style={tw`text-white text-lg font-bold`}>{t.buttonText}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}