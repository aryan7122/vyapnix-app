// app/_layout.tsx

import "react-native-gesture-handler";
import "../global.css"; // Agar aapne global css banayi hai

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

// Sabhi Providers ko import karein
import ThemeProvider, { useTheme } from "../src/context/ThemeContext";
import { LanguageProvider } from '../src/context/LanguageContext';
import { AuthProvider } from "../src/context/AuthContext"; // <-- YEH SABSE ZARURI HAI
import { RoleProvider } from "@/src/context/RoleContext";

// ThemedStatusBar ko yahan move karein, ya alag file mein rakhein
function ThemedStatusBar() {
    const { theme } = useTheme();

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync("transparent");
            NavigationBar.setButtonStyleAsync(theme.mode ? "light" : "dark");
        }
    }, [theme.mode]);

    return (
        <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={theme.mode ? "light-content" : "dark-content"}
        />
    );
}

export default function RootLayout() {
    return (
        // AuthProvider ko sabse bahar rakhein ya ThemeProvider ke andar
        <ThemeProvider>
            <RoleProvider>
                <LanguageProvider>
                    <AuthProvider>
                        <ThemedStatusBar />
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="(auth)" />
                            {/* Auth screens ab (auth) group se manage honge */}
                        </Stack>
                    </AuthProvider>
                </LanguageProvider>
            </RoleProvider>
        </ThemeProvider>
    );
}