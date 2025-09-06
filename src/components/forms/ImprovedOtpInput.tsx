import React, { useRef, useState, useEffect, FC } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import tw from 'twrnc';
import { KeyRound } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

interface ImprovedOtpInputProps {
    label: string;
    onCodeFilled: (code: string) => void;
}

export const ImprovedOtpInput: FC<ImprovedOtpInputProps> = ({ label, onCodeFilled }) => {
    const { theme } = useTheme();
    const length = 6;
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        if (otp.every(digit => digit !== '')) {
            onCodeFilled(otp.join(''));
        } else {
            onCodeFilled('');
        }
    }, [otp, onCodeFilled]);

    const handleTextChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text.slice(-1);
        setOtp(newOtp);

        if (text && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleContainerPress = () => {
        const firstEmptyIndex = otp.findIndex(digit => digit === '');
        if (firstEmptyIndex !== -1) {
            inputs.current[firstEmptyIndex]?.focus();
        } else {
            inputs.current[length - 1]?.focus();
        }
    };

    return (
        <View style={tw`mb-4`}>
            <Text style={[tw`mb-2 text-base`, { color: theme.colors.textSecondary }]}>{label}</Text>
            <Pressable onPress={handleContainerPress} style={[tw`flex-row items-center h-16 rounded-xl p-2`, { backgroundColor: theme.colors.card }]}>
                <KeyRound size={24} color={theme.colors.textSecondary} style={tw`mx-2`} />
                <View style={tw`flex-1 flex-row justify-between items-center px-1`}>
                    {otp.map((_, index) => (
                        <TextInput
                            key={index}
                            // ref={(ref) => (inputs.current[index] = ref)}
                            ref={(ref: TextInput | null) => {
                                inputs.current[index] = ref; // assign karo
                            }}
                            style={[
                                tw`w-12 h-12 border rounded-lg text-center text-xl font-bold`,
                                {
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text,
                                    backgroundColor: theme.colors.background,
                                }
                            ]}
                            keyboardType="number-pad"
                            maxLength={1}
                            onChangeText={(text) => handleTextChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            value={otp[index]}
                        />
                    ))}
                </View>
            </Pressable>
        </View>
    );
};