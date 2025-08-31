import React, { useState, useContext, FC } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Mail, Briefcase, Globe, Store, ArrowLeft, Info, MapPin, Tags, ClipboardList, Phone } from 'lucide-react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';

// --- Contexts ---
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { RoleContext } from '../../context/RoleContext';

// --- UI aur Data Imports ---
import { CustomInput, CustomTextArea } from '../../components/forms/FormUI';
import { UploadFile } from '../../components/upload/uploader';
import { editProfileScreenData } from '../../data/editProfileScreenData';

type Locale = 'en' | 'hi' | 'en-HI';



// --- ✨ Naye Organized Components ---

// User Form ke liye data type
type UserFormData = { name: string; bio: string; };
// Business Form ke liye data type
type BusinessFormData = {
    shopName: string; about: string; category: string; services: string; location: string; phone: string; website: string; tags: string;
};

// User Form Component
const UserForm: FC<{ data: UserFormData; handler: (field: keyof UserFormData, value: string) => void; t: any }> = ({ data, handler, t }) => (
    <>
        <CustomInput label={t.nameLabel} icon={User} placeholder={t.namePlaceholder} value={data.name} onChangeText={(text) => handler('name', text)} />
        <CustomInput label={t.emailLabel} icon={Mail} value="aryan.k@example.com" editable={false} />
        <CustomTextArea label={t.bioLabel} placeholder={t.bioPlaceholder} value={data.bio} onChangeText={(text) => handler('bio', text)} />
    </>
);

// Business Form Component
const BusinessForm: FC<{ data: BusinessFormData; handler: (field: keyof BusinessFormData, value: string) => void; t: any }> = ({ data, handler, t }) => (
    <>
        <CustomInput label={t.business.shopNameLabel} icon={Store} placeholder={t.business.shopNamePlaceholder} value={data.shopName} onChangeText={(text) => handler('shopName', text)} />
        <CustomTextArea label={t.business.aboutLabel} placeholder={t.business.aboutPlaceholder} value={data.about} onChangeText={(text) => handler('about', text)} height={100} />
        <CustomInput label={t.business.categoryLabel} icon={Briefcase} placeholder={t.business.categoryPlaceholder} value={data.category} onChangeText={(text) => handler('category', text)} />
        <CustomTextArea label={t.business.servicesLabel} placeholder={t.business.servicesPlaceholder} value={data.services} onChangeText={(text) => handler('services', text)} height={100}/>
        <CustomInput label={t.business.locationLabel} icon={MapPin} placeholder={t.business.locationPlaceholder} value={data.location} onChangeText={(text) => handler('location', text)} />
        <CustomInput label={t.business.phoneLabel} icon={Phone} placeholder={t.business.phonePlaceholder} value={data.phone} onChangeText={(text) => handler('phone', text)} keyboardType="phone-pad" />
        <CustomInput label={t.business.websiteLabel} icon={Globe} placeholder={t.business.websitePlaceholder} value={data.website} onChangeText={(text) => handler('website', text)} />
        <CustomInput label={t.business.tagsLabel} icon={Tags} placeholder={t.business.tagsPlaceholder} value={data.tags} onChangeText={(text) => handler('tags', text)} />
    </>
);


export default function EditProfileForm() {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const { role } = useContext(RoleContext);
    const t = editProfileScreenData[locale as Locale];

    // --- ✨ State ko Objects mein Organize kiya gaya hai ---
    const [avatar, setAvatar] = useState('https://i.pravatar.cc/300?img=5');

    // User Form ke liye State Object
    const [userForm, setUserForm] = useState<UserFormData>({
        name: 'Aryan Kumar',
        bio: 'Exploring the world...',
    });

    // Business Form ke liye State Object
    const [businessForm, setBusinessForm] = useState<BusinessFormData>({
        shopName: 'Digital Solutions Hub',
        about: 'We provide top-notch IT services and consulting to help your business grow in the digital age.',
        category: 'IT Services',
        services: 'Web Development, App Development, Digital Marketing, SEO',
        location: 'Civil Lines, Prayagraj, UP',
        phone: '+91 8877665544',
        website: 'digitalsolutions.com',
        tags: 'web design, marketing, react native, seo',
    });
    
    // --- Data Update karne ke liye Functions ---
    const handleUserChange = (field: keyof UserFormData, value: string) => {
        setUserForm(prev => ({ ...prev, [field]: value }));
    };

    const handleBusinessChange = (field: keyof BusinessFormData, value: string) => {
        setBusinessForm(prev => ({ ...prev, [field]: value }));
    };

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

    const title = role === 'Business' ? t.businessTitle : t.userTitle;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
            <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
                <ScrollView contentContainerStyle={tw`p-6`}>
                 
                    
                    <UploadFile avatarUrl={avatar} onPress={handlePickImage} label={role === 'Business' ? businessForm.shopName : userForm.name} />
                    
                    <View style={tw`mt-6`}>
                        {/* --- ✨ Ab yahan Organized Components ka istemal ho raha hai --- */}
                        {role === 'Business' ? (
                            <BusinessForm data={businessForm} handler={handleBusinessChange} t={t} />
                        ) : (
                            <UserForm data={userForm} handler={handleUserChange} t={t} />
                        )}
                    </View>

                    <TouchableOpacity
                        style={[tw`mt-4 h-14 rounded-xl items-center justify-center`, { backgroundColor: theme.colors.primary }]}
                        onPress={() => {
                            Alert.alert("Saved!", "Your profile has been updated.");
                            onClose(); 
                        }}
                    >
                        <Text style={tw`text-white text-lg font-bold`}>{t.buttonText}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

