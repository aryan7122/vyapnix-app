import React, { FC, useContext, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Switch, Modal, Pressable, ActivityIndicator } from "react-native";
import {
    ChevronRight, User,BookText,Users, MapPin, MessageCircle, LogOut, Palette, Shield, Lock, Sun, Moon, Zap, Star, Bell, CreditCard, Store, Package, Truck, MessageSquare, User2, LandmarkIcon, PaintBucket, Languages, LucideIcon
} from "lucide-react-native";

import tw from "twrnc";
import tinycolor from 'tinycolor2';
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "../../context/ThemeContext";
import { RoleContext } from "../../context/RoleContext";
import { useLanguage } from "../../context/LanguageContext";
import { settingsScreenData } from "../../data/settingsScreenData";
import { LanguageModal } from "../../components/LanguageModal";
import { useRouter } from 'expo-router';
// --- Components ke liye Prop Types ---
type SectionHeaderProps = { title: string; };

type ItemProps = {
    icon: LucideIcon;
    text: string;
    type?: 'navigate' | 'switch';
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
};

type RoleSwitchProps = {
    role: string;
    onChange: (role: "User" | "Business") => void;
};

// --- Bhasha ke liye Type ---
type Locale = 'en' | 'hi' | 'en-HI';

// --- Dobara Istemal Hone Wale Components (TypeScript ke saath) ---

const SectionHeader: FC<SectionHeaderProps> = ({ title }) => (
    <Text style={tw`text-xs font-semibold uppercase mb-3 mt-2 pl-1 text-gray-400`}>{title}</Text>
);

const Item: FC<ItemProps> = ({ icon: Icon, text, type, value, onValueChange, onPress }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity style={tw`flex-row items-center py-3 px-2`} activeOpacity={0.7} onPress={onPress}>
            <View style={[tw`w-10 h-10 rounded-full items-center justify-center`, { backgroundColor: theme.colors.primary + "20" }]}>
                <Icon color={theme.colors.primary} size={20} />
            </View>
            <Text style={[tw`flex-1 ml-4 text-base font-medium`, { color: theme.colors.text }]}>{text}</Text>
            {type === "switch" ? (
                <Switch value={!!value} onValueChange={onValueChange} trackColor={{ false: "#767577", true: theme.colors.primary }} thumbColor={"#f4f3f4"} />
            ) : (
                <ChevronRight color={theme.colors.textSecondary} size={22} />
            )}
        </TouchableOpacity>
    );
};

const generateCustomColors = (primaryColor: string) => {
    const color = tinycolor(primaryColor);
    return { primary: primaryColor, gradientStart: color.lighten(10).toString(), gradientEnd: primaryColor };
};

const ThemeSelector: FC = () => {
    const { theme, themeMode, setThemeMode, setCustomColors } = useTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const options = [ { key: "light", label: "Light", icon: Sun }, { key: "dark", label: "Dark", icon: Moon },  { key: "custom", label: "Custom", icon: PaintBucket } ]; //{ key: "system", label: "System", icon: Zap },
    const colorPalette = ['#EF4444', '#EC4899', '#DA9100', '#94B447', '#10B981', '#14B8A6', '#3B82F6', '#0EA5E9', '#8B5CF6', '#A78BFA', '#7C3AED', '#D946EF'];
    const handlePress = (key: string) => (key === 'custom' ? setIsModalVisible(true) : setThemeMode(key as any));
    const handleColorSelect = (color: string) => {
        setCustomColors(generateCustomColors(color));
        setThemeMode('custom');
        setIsModalVisible(false);
    };
    return ( <> <View style={[tw`flex-row rounded-lg p-1 mt-2`, { backgroundColor: theme.colors.background }]}> {options.map((opt) => { const isActive = themeMode === opt.key; const Icon = opt.icon; return ( <TouchableOpacity key={opt.key} onPress={() => handlePress(opt.key)} style={[tw`flex-1 flex-row items-center justify-center py-2 rounded-lg`, isActive && [tw`shadow`, { backgroundColor: theme.colors.card }]]}> <Icon size={20} color={isActive ? theme.colors.primary : theme.colors.textSecondary} /> <Text style={[tw`ml-2 text-sm font-medium`, isActive ? { color: theme.colors.primary, fontWeight: "bold" } : { color: theme.colors.textSecondary }]}>{opt.label}</Text> </TouchableOpacity> ); })} </View> <Modal animationType="fade" transparent visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}> <Pressable style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`} onPress={() => setIsModalVisible(false)}> <Pressable style={[tw`p-6 rounded-2xl w-80`, { backgroundColor: theme.colors.card }]} onPress={() => {}}> <Text style={[tw`text-lg font-bold mb-4`, { color: theme.colors.text }]}>Choose a Custom Color</Text> <View style={tw`flex-row flex-wrap justify-center`}> {colorPalette.map((color) => (<TouchableOpacity key={color} style={[tw`w-14 h-14 rounded-full m-2`, { backgroundColor: color, borderWidth: 2, borderColor: theme.colors.border }]} onPress={() => handleColorSelect(color)} />))} </View> </Pressable> </Pressable> </Modal> </> );
};

const RoleSwitch: FC<RoleSwitchProps> = ({ role, onChange }) => {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = settingsScreenData[locale as Locale];
    const options = [t.roles.user, t.roles.business];
    const active = options.indexOf(role);
    return ( <View style={[tw`rounded-xl p-1 flex-row mt-2`, { backgroundColor: theme.colors.background }]}> {options.map((opt, i) => { const isActive = i === active; const roleKey = opt === t.roles.user ? "User" : "Business"; return ( <TouchableOpacity key={opt} onPress={() => onChange(roleKey)} style={[tw`flex-1 py-2 rounded-lg items-center justify-center`, isActive && [tw`shadow`, { backgroundColor: theme.colors.card }]]} activeOpacity={0.8}> <View style={tw`flex-row items-center`}> {roleKey === 'User' ? <User2 size={18} color={isActive ? theme.colors.primary : theme.colors.textSecondary} /> : <LandmarkIcon size={18} color={isActive ? theme.colors.primary : theme.colors.textSecondary} />} <Text style={[tw`text-sm font-semibold ml-2`, { color: isActive ? theme.colors.primary : theme.colors.textSecondary }]}>{opt}</Text> </View> </TouchableOpacity> ); })} </View> );
};

type AppSettingsScreenProps = {
    // Hum ise optional bana rahe hain
    onEditProfilePress?: () => void;
};

// --- Main Screen Component ---
export default function AppSettingsScreen({ onEditProfilePress = () => {} }: AppSettingsScreenProps) {
       const router = useRouter();
    // ✨ FIX 1: Saare hooks ab top-level par hain, kisi bhi condition se pehle.
    const { theme } = useTheme();
    const { role, changeRole } = useContext(RoleContext);
    const { locale, isLoading } = useLanguage();
    const [twoFA, setTwoFA] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [isLangModalVisible, setLangModalVisible] = useState(false);

    // ✨ FIX 2: iconMap ko type de diya gaya hai taaki indexing error na aaye.
    const iconMap: { [key: string]: LucideIcon } = { User, MapPin, Lock, Shield, Star, Bell, Truck, Package, Store, MessageSquare, CreditCard,MessageCircle,Users ,BookText};
    
    // ✨ FIX 3: Translation object ko type-safe tareeke se access kiya gaya hai.
    const t = settingsScreenData[locale as Locale];

    // ✨ FIX 4: `useMemo` hooks ab conditional return se pehle define kiye gaye hain.
    const userSections = useMemo(() => {
        if (!t) return []; // Agar `t` load nahi hua hai to khali array return karein
        return t.userSections.map(section => ({
            ...section,
            items: section.items.map(item => ({
                ...item,
                icon: iconMap[item.icon], // Ab yeh type-safe hai
                value: item.key === 'twoFactorAuth' ? twoFA : item.key === 'appNotifications' ? notifications : undefined,
                onValueChange: item.key === 'twoFactorAuth' ? setTwoFA : item.key === 'appNotifications' ? setNotifications : undefined,
                 onPress: item.type === 'navigate' && item.key === 'editProfile'
                    ? onEditProfilePress // Ab yeh hamesha ek function hoga (ya to asli ya khali)
                    : undefined,
                
            }))
        }));
    }, [t, twoFA, notifications]); // Dependency array mein `t` hai

    const businessSections = useMemo(() => {
        if (!t) return []; // Guard clause
        return t.businessSections.map(section => ({
            ...section,
            items: section.items.map(item => ({ ...item, icon: iconMap[item.icon] }))
        }));
    }, [t]); // Dependency array mein `t` hai

    // ✨ FIX 5: Conditional return ab saare hooks call hone ke BAAD hota hai.
    if (isLoading || !t) {
        return <View style={tw`flex-1 justify-center items-center p-10`}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    const sections = role === "Business" ? [...businessSections, ...userSections] : userSections;

    return (
        <View style={tw`mb-20 pl-4 pr-4 pb-10`}>
            <Animated.View entering={FadeInDown.duration(300)}>
                {/* Role switch card */}
                <View style={[tw`rounded-xl p-2 mb-4`, { backgroundColor: theme.colors.card }]}>
                    <View style={tw`flex-row items-center p-2 pl-4`}>
                        <Palette color={theme.colors.primary} size={20} />
                        <Text style={[tw`ml-4 text-base font-medium`, { color: theme.colors.text }]}>{t.role}</Text>
                    </View>
                    <RoleSwitch role={role === "User" ? t.roles.user : t.roles.business} onChange={changeRole} />
                </View>

                {/* Appearance */}
                <SectionHeader title={t.appearance} />
                <View style={[tw`rounded-xl p-2 mb-4`, { backgroundColor: theme.colors.card }]}>
                    <Item icon={Languages} text={t.language} type="navigate" onPress={() => setLangModalVisible(true)} />
                    <View style={tw`border-b border-gray-200/20 dark:border-gray-700/50 mx-4`}></View>
                    <View style={tw`flex-row items-center p-2 pl-4 mt-1`}>
                        <Palette color={theme.colors.primary} size={20} />
                        <Text style={[tw`ml-4 text-base font-medium`, { color: theme.colors.text }]}>{t.theme}</Text>
                    </View>
                    <ThemeSelector />
                </View>

                {/* Dynamic sections */}
                {sections.map((sec) => (
                    <View key={sec.title}>
                        <SectionHeader title={sec.title} />
                        <View style={[tw`rounded-xl p-2 mb-4`, { backgroundColor: theme.colors.card }]}>
                            {sec.items.map((it) => (
                                <Item key={it.key} icon={it.icon} text={it.text} type={it.type as 'navigate' | 'switch'} value={it.value} onValueChange={it.onValueChange}  onPress={it.onPress} />
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout */}
                <TouchableOpacity style={[tw`flex-row items-center justify-center p-4 mt-2 rounded-xl `, { backgroundColor: theme.colors.card }]}>
                    <LogOut size={20} color={theme.colors.primary} />
                    <Text style={[tw`ml-2 text-base font-bold`, { color: theme.colors.primary }]}>{t.logout}</Text>
                </TouchableOpacity>
            </Animated.View>

            <LanguageModal isVisible={isLangModalVisible} onClose={() => setLangModalVisible(false)} />
        </View>
    );
}

// old