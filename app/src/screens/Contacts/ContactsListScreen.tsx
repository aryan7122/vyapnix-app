import React, { useState, useMemo, FC } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
// ✨ Library install hone ke baad yeh line ab kaam karegi
import { format } from 'date-fns';

import { useTheme } from '../../context/ThemeContext';
import { mockContacts, Contact } from '../../data/contactsData';

// --- Naya aur Behtar Contact Card Component ---
const ContactCard: FC<{ item: Contact; onPress: () => void }> = ({ item, onPress }) => {
    const { theme } = useTheme();
    const lastInteraction = item.interactionHistory?.[0];

    const roleTagStyle = {
        'client': tw`bg-blue-500/20 text-blue-500`, 'business': tw`bg-green-500/20 text-green-500`,
        'employee': tw`bg-purple-500/20 text-purple-500`, 'user': tw`bg-gray-500/20 text-gray-500`,
    }[item.role];
    
    return (
        <TouchableOpacity onPress={onPress} style={[tw`flex-row items-center p-3 rounded-2xl mb-2 mx-4`, { backgroundColor: theme.colors.card }]}>
            <View>
                <Image source={{ uri: item.avatarUrl }} style={tw`w-14 h-14 rounded-full`} />
                {item.isOnline && <View style={[tw`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 bg-green-500`, {borderColor: theme.colors.card}]} />}
            </View>
            <View style={tw`flex-1 ml-4`}>
                <Text style={[tw`text-base font-semibold`, { color: theme.colors.text }]}>{item.name}</Text>
                <View style={[tw`py-0.5 px-2 rounded-full mt-1 self-start`, roleTagStyle]}>
                    <Text style={[tw`text-xs font-bold capitalize`, roleTagStyle]}>{item.role}</Text>
                </View>
            </View>
            {lastInteraction && (
                <View style={tw`items-end`}>
                    <Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>{format(lastInteraction.time, 'p')}</Text>
                    {lastInteraction.direction === 'outgoing' && <ArrowUpRight size={16} color="#22c55e" style={tw`mt-1`} />}
                    {lastInteraction.direction === 'incoming' && <ArrowDownLeft size={16} color="#f97316" style={tw`mt-1`} />}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function ContactsListScreen({ searchQuery, selectedFilter }: { searchQuery: string, selectedFilter: string }) {
    const router = useRouter();
    
    const filteredContacts = useMemo(() => {
        let contacts = [...mockContacts].sort((a, b) => {
            const timeA = a.interactionHistory?.[0]?.time.getTime() || 0;
            const timeB = b.interactionHistory?.[0]?.time.getTime() || 0;
            return timeB - timeA;
        });
        
        if (selectedFilter !== 'all' && selectedFilter !== 'recent') {
             if (selectedFilter === 'favorites') {
                contacts = contacts.filter(c => c.isFavorite);
             } else {
                contacts = contacts.filter(c => c.role === selectedFilter);
             }
        }
        
        if (searchQuery) {
            contacts = contacts.filter(c => 
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.phone.includes(searchQuery)
            );
        }
        return contacts;
    }, [selectedFilter, searchQuery]);

    return (
        <FlatList
            data={filteredContacts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ContactCard item={item} onPress={() => router.push(`/contact-detail?id=${item.id}`)} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
        />
    );
}

