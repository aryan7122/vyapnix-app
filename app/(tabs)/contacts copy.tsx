import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import tw from 'twrnc';
// ✨ FIX: The import path is corrected to point to the 'src' folder at the root level.
import { useTheme } from '../src/context/ThemeContext';
import ContactsListScreen from '../src/screens/Contacts/ContactsListScreen';

export default function ContactsTab() {
    const { theme } = useTheme();
    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            <View style={tw`px-4 h-16 justify-center`}>
                <Text style={[tw`text-2xl font-bold`, { color: theme.colors.text }]}>Contacts</Text>
            </View>
            <ContactsListScreen />
        </SafeAreaView>
    );
}

