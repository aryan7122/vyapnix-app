import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import {
  Home, User, Plus, ShoppingBag, Users, Search, Map, MessageSquare, Wallet, Heart
} from "lucide-react-native";
import Animated, {
  useSharedValue, withTiming, useAnimatedStyle, Easing
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { LinearGradient } from 'expo-linear-gradient'; // ✨ बदलाव: Expo की लाइब्रेरी का उपयोग करें
import { useTheme } from "../context/ThemeContext";

interface TabItem {
  name: string;
  icon: JSX.Element;
  route?: string;
}

const mainTabs: TabItem[] = [
  { name: "Home", icon: <Home />, route: "/(tabs)/home" },
  { name: "Shop", icon: <ShoppingBag />, route: "/(tabs)/shop" },
  { name: "Add", icon: <Plus /> },
  { name: "Client", icon: <Users />, route: "/(tabs)/client" },
  { name: "Profile", icon: <User />, route: "/(tabs)/profile" },
];

const floatingIcons: TabItem[] = [
  { name: "Search", icon: <Search />, route: "/(tabs)/search" },
  { name: "Map", icon: <Map />, route: "/(tabs)/map" },
  { name: "Chat", icon: <MessageSquare />, route: "/(tabs)/chat" },
  { name: "Wallet", icon: <Wallet />, route: "/(tabs)/wallet" },
  { name: "Like", icon: <Heart />, route: "/(tabs)/like" },
];

export default function BottomNav() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Home");
  const [addActiveIcon, setAddActiveIcon] = useState<JSX.Element | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // ✨ नए थीम सिस्टम का उपयोग
  const { theme } = useTheme();

  const animValues = useRef(floatingIcons.map(() => useSharedValue(0))).current;
  const rotation = useSharedValue(0);

  useEffect(() => {
    animValues.forEach((val) => {
      val.value = withTiming(isMenuOpen ? 1 : 0, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
    });
    rotation.value = withTiming(isMenuOpen ? 45 : 0, { duration: 300 });
  }, [isMenuOpen]);

  const handleFloatingIconPress = (item: TabItem) => {
    const styledIcon = React.cloneElement(item.icon, {
      color: theme.colors.iconColor, // ✨ थीम का उपयोग
      size: 30,
    });
    setAddActiveIcon(styledIcon);
    setActiveTab(item.name);
    setIsMenuOpen(false);
    if (item.route) router.push(item.route);
  };

  const handleMainTabPress = (tab: TabItem) => {
    if (tab.name === "Add") return; // 'Add' पर क्लिक करने से कुछ नहीं होगा
    
    setActiveTab(tab.name);
    // अगर चुना गया टैब फ्लोटिंग मेनू का हिस्सा नहीं है, तो सेंट्रल आइकन को रीसेट करें
    if (!floatingIcons.some(f => f.name === tab.name)) {
      setAddActiveIcon(null);
    }
    if (tab.route) router.push(tab.route);
  };

  const animatedRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const renderFloatingIcons = () =>
    floatingIcons.map((item, i) => {
      const style = useAnimatedStyle(() => {
        const angle = -20 - (i * 35);
        const radius = 110; // थोड़ा कम किया ताकि स्क्रीन से बाहर न जाए
        return {
          transform: [
            { translateX: animValues[i].value * radius * Math.cos((angle * Math.PI) / 180) },
            { translateY: animValues[i].value * radius * Math.sin((angle * Math.PI) / 180) },
            { scale: animValues[i].value },
          ],
          opacity: animValues[i].value,
        };
      });

      return (
        <Animated.View key={item.name} style={[tw`absolute`, style]}>
          <TouchableOpacity
            onPress={() => handleFloatingIconPress(item)}
            // ✨ फ्लोटिंग आइकन्स को कार्ड जैसा लुक दिया गया है
            style={[tw`w-14 h-14 rounded-full items-center justify-center`, theme.shadows.md, { backgroundColor: theme.colors.card }]}
          >
            {/* ✨ फ्लोटिंग आइकन्स का रंग प्राइमरी कलर होगा */}
            {React.cloneElement(item.icon, { color: theme.colors.primary, size: 24 })}
          </TouchableOpacity>
        </Animated.View>
      );
    });

  const Tab = ({ tab }: { tab: TabItem }) => {
    const isActive = activeTab === tab.name;
    return (
      <TouchableOpacity
        onPress={() => handleMainTabPress(tab)}
        style={tw`flex-1 h-full items-center justify-center`}
      >
        <View style={[tw`p-3 rounded-full`, isActive && { backgroundColor: theme.colors.tabBarActive + '20' }]}>
            {React.cloneElement(tab.icon, {
                size: 26,
                // ✨ एक्टिव और इनएक्टिव टैब के रंग थीम से
                color: isActive ? theme.colors.tabBarActive : theme.colors.tabBarInactive,
            })}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`absolute bottom-0 left-0 right-0 items-center`}>
      <View style={[tw`flex-row w-full h-20 items-center justify-around`, { backgroundColor: theme.colors.tabBar, borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
        <Tab tab={mainTabs[0]} />
        <Tab tab={mainTabs[1]} />

        {/* सेंट्रल बटन को बाकी टैब्स के ऊपर रखने के लिए zIndex और पोजिशनिंग */}
        <View style={tw`relative items-center justify-center -mt-8 z-10`}>
          {renderFloatingIcons()}
          <TouchableOpacity
            onPress={() => {
              // अगर कोई फ्लोटिंग आइकन चुना हुआ है, तो उसे रीसेट करें
              if (addActiveIcon) {
                setAddActiveIcon(null);
                setActiveTab("Home");
                router.push('/(tabs)/home');
              } else {
                // वरना मेनू को खोलें/बंद करें
                setIsMenuOpen(!isMenuOpen);
              }
            }}
          >
            {/* ✨ सेंट्रल बटन में ग्रेडिएंट और शैडो का उपयोग */}
            <LinearGradient
              colors={addActiveIcon ? theme.gradients.card : theme.gradients.primaryButton}
              style={[tw`w-16 h-16 rounded-full items-center justify-center`, theme.shadows.lg]}
            >
              {addActiveIcon ? (
                // चुने हुए आइकन का रंग प्राइमरी होगा
                React.cloneElement(addActiveIcon, {color: theme.colors.primary})
              ) : (
                <Animated.View style={animatedRotation}>
                  <Plus size={30} color={theme.colors.iconColor} />
                </Animated.View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Tab tab={mainTabs[3]} />
        <Tab tab={mainTabs[4]} />
      </View>
    </View>
  );
}
