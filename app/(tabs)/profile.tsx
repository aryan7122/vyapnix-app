import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import tw from "twrnc";
import { ArrowLeft, Settings } from "lucide-react-native";

// --- Contexts ---
import { useTheme } from "../src/context/ThemeContext";

// --- Aapke Components ---
import AppSettingsScreen from "../src/screens/Profile/AppSettingsScreen";
import UserProfilePage from "../src/screens/Profile/UserProfilePage";
import EditProfileForm from "../src/screens/Profile/EditProfileForm"; // ✨ Ise import karein
import { RoleContext } from "../src/context/RoleContext";

export default function Profile() {
    const { theme } = useTheme();
    const { role } = useContext(RoleContext);

    // ✨ FIX 1: State banayein jo batayega ki form dikhana hai ya nahi
    const [isEditing, setIsEditing] = useState(false);

    // Function jo state ko badlega (true/false karega)
    const toggleEditMode = () => {
        setIsEditing(prevState => !prevState);
    };


    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            {/* Header (Yeh hamesha dikhega) */}
            <View style={tw`flex-row items-center gap-10 center justify-between px-4 h-16`}>
                <Text style={[tw`text-lg font-bold flex gap-4  items-center`, { color: theme.colors.text }]}>
                    {isEditing && (
                        <TouchableOpacity onPress={toggleEditMode} style={tw` -ml-2`}>
                            <ArrowLeft size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    )}
                    {role} Profile
                </Text>
                {/* Setting icon abhi ke liye hide kar dete hain jab form khula ho */}
                {!isEditing && (
                    <TouchableOpacity>
                        <Settings size={22} color={theme.colors.iconColor} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ✨ FIX 2: Condition ke hisaab se component dikhayein */}
                {isEditing ? (
                    // Agar 'isEditing' true hai, to form dikhayein
                    <EditProfileForm onClose={toggleEditMode} />
                ) : (
                    // Agar 'isEditing' false hai, to profile aur settings dikhayein
                    <>
                        <UserProfilePage />
                        <AppSettingsScreen onEditProfilePress={toggleEditMode} />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// old