import React, { FC, useContext, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking, Dimensions } from "react-native";
import Animated, { FadeInDown, FadeInRight, FadeOutRight } from "react-native-reanimated";
import { Mail, Phone, Star, ThumbsUp, MapPin, Globe, Clock, Briefcase, User as UserIcon, LucideIcon } from "lucide-react-native";
import tw from "twrnc";

// --- Contexts aur Data ---
import { useTheme } from "../../context/ThemeContext";
import { RoleContext } from "../../context/RoleContext";
import { useLanguage } from "../../context/LanguageContext";
import { profileScreenData } from "../../data/profileScreenData";

const { width } = Dimensions.get("window");
type Locale = 'en' | 'hi' | 'en-HI';

// --- Helper Components (ab yeh bhi dynamic hain) ---
type DetailItemProps = { icon: LucideIcon; label: string; value: string; isLink?: boolean; };

const StarRow: FC<{ currentRating: number }> = ({ currentRating }) => {
    const { theme } = useTheme();
    return ( <View style={tw`flex-row items-center`}> {[1, 2, 3, 4, 5].map((i) => ( <View key={i} style={tw`mr-1`}> <Star size={18} color={i <= Math.round(currentRating) ? theme.colors.primary : theme.colors.textSecondary} fill={i <= Math.round(currentRating) ? theme.colors.primary : "transparent"} /> </View> ))} <Text style={[tw`ml-2 text-xs`, { color: theme.colors.textSecondary }]}>{currentRating.toFixed(1)}</Text> </View> );
};

const DetailItem: FC<DetailItemProps> = ({ icon: Icon, label, value, isLink = false }) => {
    const { theme } = useTheme();
    return ( <View style={tw`flex-row items-center mb-3`}> <Icon size={16} color={theme.colors.primary} style={tw`mr-3`} /> <Text style={[tw`w-20 text-sm font-semibold`, { color: theme.colors.text }]}>{label}</Text> <Text style={[tw`flex-1 text-sm ${isLink ? 'text-blue-500 underline' : ''}`, { color: theme.colors.textSecondary }]} onPress={() => isLink && Linking.openURL(`https://${value}`)}>{value}</Text> </View> );
};

// --- Main Profile Page ---
export default function UserProfilePage() {
    const { theme } = useTheme();
    const { role, setRole } = useContext(RoleContext);
    const { locale } = useLanguage();
    const [menuVisible, setMenuVisible] = useState(false);

    // ✨ FIX: Bhasha ke hisaab se sahi text chunein
    const t = profileScreenData[locale as Locale];

    // ✨ FIX: Role aur bhasha ke hisaab se sahi data chunein
    const profileData = useMemo(() => (role === "Business" ? t.business : t.user), [role, t]);
    const stats = useMemo(() => Object.keys(t.stats), [t]);

    // Role ke hisaab se alag-alag UI sections
    const BusinessDetails = () => (
        <Animated.View entering={FadeInDown.delay(120)}>
            <View style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}>
                <DetailItem icon={MapPin} label={t.business.details.location} value={profileData.location} />
                <DetailItem icon={Briefcase} label={t.business.details.category} value={profileData.category} />
                <DetailItem icon={Clock} label={t.business.details.hours} value={profileData.hours} />
                <DetailItem icon={Globe} label={t.business.details.website} value={profileData.website} isLink />
            </View>
            <View style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}>
                <View style={tw`flex-row items-center justify-between mb-3`}>
                    <View style={tw`flex-row items-center`}>
                        <ThumbsUp size={18} color={theme.colors.primary} />
                        <Text style={[tw`ml-2 font-semibold`, { color: theme.colors.text }]}>{t.business.details.likes}</Text>
                    </View>
                    <Text style={[tw`text-base font-bold`, { color: theme.colors.text }]}>{profileData.likes}</Text>
                </View>
                <View style={tw`flex-row items-center justify-between`}>
                    <View style={tw`flex-row items-center`}>
                        <UserIcon size={18} color={theme.colors.primary} />
                        <Text style={[tw`ml-2 font-semibold`, { color: theme.colors.text }]}>{t.business.details.rating}</Text>
                    </View>
                    <StarRow currentRating={profileData.rating} />
                </View>
            </View>
        </Animated.View>
    );

    const UserDetails = () => (
        <Animated.View entering={FadeInDown.delay(120)} style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}>
            <Text style={[tw`text-base font-bold mb-2`, { color: theme.colors.text }]}>{t.user.bioTitle}</Text>
            <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{profileData.bio}</Text>
        </Animated.View>
    );

    return (
        <View>
            {/* Profile card (Common for both) */}
            <Animated.View entering={FadeInDown.delay(60)} style={[tw`mx-4 p-4 rounded-xl flex-row items-center`, { backgroundColor: theme.colors.card }]}>
                <Image source={{ uri: profileData.avatarUrl }} style={tw`w-20 h-20 rounded-full mr-4`} />
                <View style={tw`flex-1`}>
                    <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>{role === 'Business' ? profileData.shopName : profileData.name}</Text>
                    <View style={tw`flex-row items-center mt-1`}>
                        <Mail size={16} color={theme.colors.primary} />
                        <Text style={[tw`ml-2 text-sm`, { color: theme.colors.textSecondary }]}>{profileData.email}</Text>
                    </View>
                    <View style={tw`flex-row items-center mt-1`}>
                        <Phone size={16} color={theme.colors.primary} />
                        <Text style={[tw`ml-2 text-sm`, { color: theme.colors.textSecondary }]}>{profileData.phone}</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Stats (Common for both) */}
            <View style={[tw`mx-4 my-4 py-4 rounded-xl flex-row justify-around`, { backgroundColor: theme.colors.card }]}>
                {stats.map(statKey => (
                    <View key={statKey} style={tw`items-center`}>
                        <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>{profileData[statKey as keyof typeof profileData]}</Text>
                        <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{t.stats[statKey as keyof typeof t.stats]}</Text>
                    </View>
                ))}
            </View>

            {/* Role ke hisaab se details dikhayein */}
            {role === "Business" ? <BusinessDetails /> : <UserDetails />}

            {/* Popup menu (Yeh abhi ke liye aise hi rakha hai) */}
            {menuVisible && (
                <Animated.View entering={FadeInRight.duration(220)} exiting={FadeOutRight.duration(180)} style={[tw`absolute top-16 right-4 rounded-xl p-3 shadow-lg z-50`, { backgroundColor: theme.colors.card, width: width * 0.55 }]}>
                    <TouchableOpacity style={tw`py-2`} onPress={() => { setRole(role === 'User' ? 'Business' : 'User'); setMenuVisible(false); }}>
                        <Text style={[tw`text-base`, { color: theme.colors.text }]}>{role === 'User' ? t.menu.switchToBusiness : t.menu.switchToUser}</Text>
                    </TouchableOpacity>
                    {[t.menu.editProfile, t.menu.logout].map((item) => (
                        <TouchableOpacity key={item} style={tw`py-2`} onPress={() => setMenuVisible(false)}>
                            <Text style={[tw`text-base`, { color: theme.colors.text }]}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            )}
        </View>
    );
}

