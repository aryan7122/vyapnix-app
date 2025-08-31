import React, { FC } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'lucide-react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext';

interface UploadFileProps {
    avatarUrl: string;
    onPress: () => void; // Image picker open karne ke liye
    label: string;
}

export const UploadFile: FC<UploadFileProps> = ({ avatarUrl, onPress, label }) => {
    const { theme } = useTheme();

    return (
        <View style={tw`items-center my-6`}>
            <View>
                <Image
                    source={{ uri: avatarUrl }}
                    style={[tw`w-32 h-32 rounded-full border-4`,{borderColor: theme.colors.card}]}
                    // Border ka color theme se aayega
                   
                />
                <TouchableOpacity
                    onPress={onPress}
                    style={[
                        tw`absolute -bottom-1 -right-1 w-10 h-10 rounded-full items-center justify-center border-4`,
                        { backgroundColor: theme.colors.primary, borderColor: theme.colors.background }
                    ]}
                    activeOpacity={0.8}
                >
                    <Camera size={20} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={[tw`mt-4 text-lg font-bold`, { color: theme.colors.text }]}>{label}</Text>
        </View>
    );
};
