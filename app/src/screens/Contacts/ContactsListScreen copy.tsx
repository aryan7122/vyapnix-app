import React, { useState, useMemo, FC } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Users, Star, Clock, Phone, MessageSquare } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

// --- Data, UI, aur Contexts ---
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockContacts, contactsScreenData, Contact } from '../../data/contactsData';
import { CustomTabs } from '../../components/ui/CustomTabs';

type Locale = 'en' | 'hi' | 'en-HI';

// Contact Card Component
const ContactCard: FC<{ item: Contact; onPress: () => void }> = ({ item, onPress }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={onPress} style={[tw`flex-row items-center p-3 rounded-lg mb-2`, { backgroundColor: theme.colors.card }]}>
            <Image source={{ uri: item.avatarUrl }} style={tw`w-12 h-12 rounded-full`} />
            <View style={tw`flex-1 ml-4`}>
                <Text style={[tw`text-base font-semibold`, { color: theme.colors.text }]}>{item.name}</Text>
                {item.lastInteraction && (
                    <View style={tw`flex-row items-center mt-1`}>
                        {item.lastInteraction.type === 'call' ? <Phone size={14} color={theme.colors.textSecondary} /> : <MessageSquare size={14} color={theme.colors.textSecondary} />}
                        <Text style={[tw`ml-2 text-xs`, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                            {item.lastInteraction.text ? `${item.lastInteraction.text.substring(0, 20)}...` : item.lastInteraction.time}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>{item.lastInteraction?.time}</Text>
        </TouchableOpacity>
    );
};


export default function ContactsListScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = contactsScreenData[locale as Locale];
    
    const [selectedTab, setSelectedTab] = useState('all');

    const tabs = [
        { key: 'all', label: t.tabs.all, icon: Users },
        { key: 'favorites', label: t.tabs.favorites, icon: Star },
        { key: 'recent', label: t.tabs.recent, icon: Clock },
    ];
    
    const filteredContacts = useMemo(() => {
        if (selectedTab === 'favorites') return mockContacts.filter(c => c.isFavorite);
        // "Recent" ke liye logic yahan aayega
        return mockContacts;
    }, [selectedTab]);

    return (
        <View style={tw`flex-1 px-4`}>
            <CustomTabs tabs={tabs} selectedTab={selectedTab} onTabPress={setSelectedTab} />
            <FlatList
                data={filteredContacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ContactCard item={item} onPress={() => router.push(`/contact-detail?id=${item.id}`)} />
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
// 