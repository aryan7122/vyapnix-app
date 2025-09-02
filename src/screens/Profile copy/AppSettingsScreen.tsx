import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
    ChevronRight,
    User,
    MapPin,
    LogOut,
    Palette,
    Shield,
    Lock,
    Sun,
    Moon,
    Zap,
    Star,
    Bell,
    CreditCard,
    Store,
    Package,
    Truck,
    MessageSquare,
    Settings,
    User2,
    LandmarkIcon,
    PaintBucket,
} from "lucide-react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import { RoleContext } from "../../context/RoleContext";
import tinycolor from 'tinycolor2';
// const ROLE_KEY = "USER_ROLE";

// Section header
const SectionHeader = ({ title }) => (
    <Text style={tw`text-xs font-semibold uppercase mb-3 mt-2 pl-1 text-gray-400`}>
        {title}
    </Text>
);

// Reusable list item
const Item = ({ icon: Icon, text, type, value, onValueChange }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity style={tw`flex-row items-center py-3 px-2`} activeOpacity={0.7}>
            <View
                style={[
                    tw`w-10 h-10 rounded-full items-center justify-center`,
                    { backgroundColor: theme.colors.primary + "20" },
                ]}
            >
                <Icon color={theme.colors.primary} size={20} />
            </View>
            <Text
                style={[
                    tw`flex-1 ml-4 text-base font-medium`,
                    { color: theme.colors.text },
                ]}
            >
                {text}
            </Text>
            {type === "switch" ? (
                <Switch value={!!value} onValueChange={onValueChange} />
            ) : (
                <ChevronRight color={theme.colors.textSecondary} size={22} />
            )}
        </TouchableOpacity>
    );
};

// Helper function (isko component ke bahar rakhein)
const generateCustomColors = (primaryColor: string) => {
    const color = tinycolor(primaryColor);
    return {
        primary: primaryColor,
        gradientStart: color.lighten(10).toString(),
        gradientEnd: primaryColor,
    };
};

const ThemeSelector = () => {
    const { theme, themeMode, setThemeMode, setCustomColors } = useTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const options = [
        { key: "light", label: "Light", icon: Sun },
        { key: "dark", label: "Dark", icon: Moon },
        { key: "system", label: "System", icon: Zap },
        // ✨ FIX #2: Key ko lowercase 'custom' karein
        { key: "custom", label: "Custom", icon: PaintBucket },
    ];
    
   const colorPalette = [
    // Reds & Pinks
    '#EF4444', // Red
    '#EC4899', // Pink

    // Oranges & Yellows
    '#DA9100', // Amber
    '#94B447', // Yellow

    // Greens & Teals
    '#10B981', // Emerald
    '#14B8A6', // Teal

    // Blues
    '#3B82F6', // Blue
    '#0EA5E9', // Sky Blue

    // Purples & Violets (aapke pasand ke)
    '#8B5CF6', // Violet (Original)
    '#A78BFA', // Lighter Violet
    '#7C3AED', // Darker Violet
    '#D946EF', // Fuchsia
];

    const handlePress = (key: string) => {
        if (key === 'custom') {
            setIsModalVisible(true);
        } else {
            setThemeMode(key as any); // 'any' cast as key is one of the valid modes
        }
    };
    
    const handleColorSelect = (color: string) => {
        const newColors = generateCustomColors(color);
        setCustomColors(newColors);
        setThemeMode('custom');
        setIsModalVisible(false);
    };

    return (
        <>
            {/* Theme Selector UI */}
            <View
                style={[
                    tw`flex-row rounded-lg p-1 mt-2`,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                {options.map((opt) => {
                    const isActive = themeMode === opt.key;
                    const Icon = opt.icon;
                    return (
                        <TouchableOpacity
                            key={opt.key}
                            // ✨ FIX #1: Sahi function `handlePress` ko call karein
                            onPress={() => handlePress(opt.key)}
                            style={[
                                tw`flex-1 flex-row items-center justify-center py-2 rounded-lg`,
                                isActive && [tw`shadow`, { backgroundColor: theme.colors.card }],
                            ]}
                        >
                            <Icon size={20} color={isActive ? theme.colors.primary : theme.colors.textSecondary} />
                            <Text
                                style={[
                                    tw`ml-2 text-sm font-medium`,
                                    isActive
                                        ? { color: theme.colors.primary, fontWeight: "bold" }
                                        : { color: theme.colors.textSecondary },
                                ]}
                            >
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Color Picker Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable
                    style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
                    onPress={() => setIsModalVisible(false)}
                >
                    <Pressable 
                        style={[tw`p-6 rounded-2xl w-80`, { backgroundColor: theme.colors.card }]}
                        onPress={() => {}}
                    >
                        <Text style={[tw`text-lg font-bold mb-4`, { color: theme.colors.text }]}>
                            Choose a Custom Color
                        </Text>
                        <View style={tw`flex-row flex-wrap justify-center`}>
                            {colorPalette.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        tw`w-14 h-14 rounded-full m-2`,
                                        { backgroundColor: color, borderWidth: 2, borderColor: theme.colors.border }
                                    ]}
                                    onPress={() => handleColorSelect(color)}
                                />
                            ))}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

// Segmented role switch (compact)
const RoleSwitch = ({ role, onChange }) => {
    const { theme } = useTheme();
    const options = ["User", "Business"];
    const active = options.indexOf(role);

    return (
        <View
            style={[
                tw`rounded-xl p-1 flex-row mt-2`,
                { backgroundColor: theme.colors.background },
            ]}
        >
            {options.map((opt, i) => {
                const isActive = i === active;
                return (
                    <TouchableOpacity
                        key={opt}
                        onPress={() => onChange(opt)}
                        style={[
                            tw`flex-1 py-2 rounded-lg items-center justify-center`,
                            isActive && [tw`shadow`, { backgroundColor: theme.colors.card }],
                        ]}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                tw`text-sm font-semibold flex gap-2`,
                                { color: isActive ? theme.colors.primary : theme.colors.textSecondary },
                            ]}
                        >
                            {opt === 'User' ?
                                <User2 color={theme.colors.primary} size={20} />
                                :
                                <LandmarkIcon  color={theme.colors.primary} size={20} />
                            }

                            {opt}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default function AppSettingsScreen() {
    const { theme } = useTheme();
    const [twoFA, setTwoFA] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const { role, changeRole } = useContext(RoleContext);

    // sections from single object → map to UI
    const userSections = useMemo(
        () => [
            {
                title: "Preferences",
                items: [
                    { icon: MapPin, text: "Manage Addresses", type: "navigate" },
                    { icon: User, text: "Edit Profile", type: "navigate" },
                ],
            },
            {
                title: "Security & Privacy",
                items: [
                    { icon: Lock, text: "Change Password", type: "navigate" },
                    {
                        icon: Shield,
                        text: "2-Factor Authentication",
                        type: "switch",
                        value: twoFA,
                        onValueChange: setTwoFA,
                    },
                ],
            },
            {
                title: "Subscription",
                items: [{ icon: Star, text: "Manage Subscription", type: "navigate" }],
            },
            {
                title: "Notifications",
                items: [
                    {
                        icon: Bell,
                        text: "App Notifications",
                        type: "switch",
                        value: notifications,
                        onValueChange: setNotifications,
                    },
                ],
            },
        ],
        [twoFA, notifications]
    );

    const businessSections = useMemo(
        () => [
            {
                title: "Business",
                items: [
                    { icon: Truck, text: "Delivery Settings", type: "navigate" },
                    { icon: Package, text: "Inventory & Stock", type: "navigate" },
                    { icon: Store, text: "Shop Settings", type: "navigate" },
                    { icon: MessageSquare, text: "Notifications & Messaging", type: "navigate" },
                    { icon: CreditCard, text: "Payments & Ledger", type: "navigate" },
                ],
            },
        ],
        []
    );

    const sections = role === "Business" ? [...businessSections, ...userSections] : userSections; //[...businessSections, ...userSections] 

    return (
        <SafeAreaView style={[tw` pb-20 `, { backgroundColor: theme.colors.background }]}>


            <Animated.View
                style={tw`flex-1 pl-4 pr-4 pb-10 `}
            // contentContainerStyle={tw`pt-20 pb-28 px-4`}
            // showsVerticalScrollIndicator={false}
            >
                {/* Role switch card */}
                <Animated.View
                    entering={FadeInDown.duration(300)}
                    style={[
                        tw`rounded-xl p-2 mb-4`,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <View style={tw`flex-row items-center p-2 pl-4`}>
                        <Palette color={theme.colors.primary} size={20} />
                        <Text style={[tw`ml-4 text-base font-medium`, { color: theme.colors.text }]}>
                            Role
                        </Text>
                    </View>
                    <RoleSwitch role={role} onChange={changeRole} />
                </Animated.View>

                {/* Appearance */}
                <SectionHeader title="Appearance" />
                <View
                    style={[
                        tw`rounded-xl p-2 mb-4`,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <View style={tw`flex-row items-center p-2 pl-4`}>
                        <Palette color={theme.colors.primary} size={20} />
                        <Text style={[tw`ml-4 text-base font-medium`, { color: theme.colors.text }]}>
                            Theme
                        </Text>
                    </View>
                    <ThemeSelector />
                </View>

                {/* Dynamic sections */}
                {sections.map((sec, sIdx) => (
                    <View key={sec.title}>
                        <SectionHeader title={sec.title} />
                        <View
                            style={[
                                tw`rounded-xl p-2 mb-4`,
                                { backgroundColor: theme.colors.card },
                            ]}
                        >
                            {sec.items.map((it, iIdx) => (
                                <Item
                                    key={`${sIdx}-${iIdx}`}
                                    icon={it.icon}
                                    text={it.text}
                                    type={it.type}
                                    value={it.value}
                                    onValueChange={it.onValueChange}
                                />
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout */}
                <TouchableOpacity
                    style={[
                        tw`flex-row items-center justify-center p-4 mt-2 rounded-xl `,
                        { backgroundColor: theme.colors.card },
                    ]}
                >
                    <LogOut size={20} color={theme.colors.primary} />
                    <Text style={[tw`ml-2 text-base font-bold`, { color: theme.colors.primary }]}>
                        Log Out
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}
