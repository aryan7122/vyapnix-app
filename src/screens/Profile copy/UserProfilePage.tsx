import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Animated, { FadeInDown, FadeInRight, FadeOutRight } from "react-native-reanimated";
import {
  Settings,
  Mail,
  Phone,
  Star,
  ThumbsUp,
  MapPin,
  Globe,
  Clock,
  Briefcase,
  UserStar,
} from "lucide-react-native";
import tw from "twrnc";
import { useTheme } from "../../context/ThemeContext";
import { RoleContext } from "../../context/RoleContext";

const { width } = Dimensions.get("window");

// --- STEP 1: Define separate data for User and Business ---

// Data for a regular user
const userData = {
  name: "Aryan Kumar",
  email: "aryan.k@example.com",
  phone: "+91 9876543210",
  avatarUrl: "https://i.pravatar.cc/300?img=5",
  followers: 1200,
  following: 340,
  contact: 840,
  bio: "Exploring the world, one city at a time. Tech enthusiast and coffee lover.",
};

// Data for a business account
const businessData = {
  shopName: "Digital Solutions Hub",
  category: "IT Services & Consulting",
  email: "contact@digitalsolutions.com",
  phone: "+91 8877665544",
  avatarUrl: "https://i.pravatar.cc/300?img=10", // A different avatar for business
  followers: 5400,
  following: 50,
  contact: 1250,
  location: "Prayagraj, Uttar Pradesh",
  website: "https://digitalsolutions.com",
  hours: "10:00 AM - 7:00 PM",
  rating: 4.5,
  likes: 2800,

};

export default function UserProfilePage() {
  const { theme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  // Get role and the function to set it from context
  const { role, setRole } = useContext(RoleContext);

  // --- STEP 2: Choose data based on the current role ---
  const profileData = useMemo(() => (role === "Business" ? businessData : userData), [role]);

  // State for rating, initialized from profile data
  const [rating, setRating] = useState(profileData.rating || 4);

  // --- Reusable Star Component ---
  const StarRow = ({ editable = false }) => (
    <View style={tw`flex-row items-center`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => editable && setRating(i)} // Only allow setting rating if editable
          style={tw`mr-1`}
          activeOpacity={0.8}
          disabled={!editable}
        >
          <Star
            size={18}
            color={i <= Math.round(rating) ? theme.colors.primary : theme.colors.textSecondary}
            fill={i <= Math.round(rating) ? theme.colors.primary : "transparent"}
          />
        </TouchableOpacity>
      ))}
      <Text style={[tw`ml-2 text-xs`, { color: theme.colors.textSecondary }]}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );

  // --- Specific component for Business Details ---
  const BusinessDetails = () => (
    <Animated.View entering={FadeInDown.delay(120)}>
      {/* Location, Website, Hours Card */}
      <View style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}>
        <DetailItem icon={MapPin} label="Location" value={profileData.location} />
        <DetailItem icon={Briefcase} label="Category" value={profileData.category} />
        <DetailItem icon={Clock} label="Hours" value={profileData.hours} />
        <DetailItem icon={Globe} label="Website" value={profileData.website} isLink />
      </View>

      {/* Likes and Rating Card */}
      <View style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <View style={tw`flex-row items-center`}>
            <ThumbsUp size={18} color={theme.colors.primary} />
            <Text style={[tw`ml-2 font-semibold`, { color: theme.colors.text }]}>Likes</Text>
          </View>
          <Text style={[tw`text-base font-bold`, { color: theme.colors.text }]}>
            {profileData.likes}
          </Text>
        </View>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <UserStar  size={18} color={theme.colors.primary} />
            <Text style={[tw`ml-2 font-semibold`, { color: theme.colors.text }]}>Likes</Text>
          </View>
          <StarRow />
        </View>
      </View>
    </Animated.View>
  );

  // --- Specific component for User Details ---
  const UserDetails = () => (
    <Animated.View
      entering={FadeInDown.delay(120)}
      style={[tw`mx-4 p-4 rounded-xl mb-4`, { backgroundColor: theme.colors.card }]}
    >
      <Text style={[tw`text-base font-bold mb-2`, { color: theme.colors.text }]}>About Me</Text>
      <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{profileData.bio}</Text>
    </Animated.View>
  );

  // --- Helper for detail items ---
  const DetailItem = ({ icon: Icon, label, value, isLink = false }) => (
    <View style={tw`flex-row items-center mb-2`}>
      <Icon size={16} color={theme.colors.primary} style={tw`mr-3`} />
      <Text style={[tw`w-20 text-sm font-semibold`, { color: theme.colors.text }]}>{label}</Text>
      <Text
        style={[tw`flex-1 text-sm ${isLink ? 'text-blue-500 underline' : ''}`, { color: theme.colors.textSecondary }]}
        onPress={() => isLink && Linking.openURL(`https://${value}`)}
      >
        {value}
      </Text>
    </View>
  );


  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      <View
      // showsVerticalScrollIndicator={false}
      // contentContainerStryle={tw``} // Padding top for the fixed header
      >
        {/* Profile card (Common for both) */}
        <Animated.View
          entering={FadeInDown.delay(60)}
          style={[tw`mx-4 p-4 rounded-xl flex-row items-center`, { backgroundColor: theme.colors.card }]}
        >
          <Image source={{ uri: profileData.avatarUrl }} style={tw`w-20 h-20 rounded-full mr-4`} />
          <View style={tw`flex-1`}>
            <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>
              {role === 'Business' ? profileData.shopName : profileData.name}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Mail size={16} color={theme.colors.primary} />
              <Text style={[tw`ml-2 text-sm`, { color: theme.colors.textSecondary }]}>
                {profileData.email}
              </Text>
            </View>
            <View style={tw`flex-row items-center mt-1`}>
              <Phone size={16} color={theme.colors.primary} />
              <Text style={[tw`ml-2 text-sm`, { color: theme.colors.textSecondary }]}>
                {profileData.phone}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats (Common for both) */}
        <View style={[tw`mx-4 my-4 py-4 rounded-xl flex-row justify-around`, { backgroundColor: theme.colors.card }]}>
          {['Followers', 'Following', 'Contact'].map(stat => (
            <View key={stat} style={tw`items-center`}>
              <Text style={[tw`text-lg font-bold`, { color: theme.colors.text }]}>
                {profileData[stat.toLowerCase()]}
              </Text>
              <Text style={[tw`text-sm`, { color: theme.colors.textSecondary }]}>{stat}</Text>
            </View>
          ))}
        </View>

        {/* --- STEP 3: Conditionally render User or Business details --- */}
        {role === "Business" ? <BusinessDetails /> : <UserDetails />}

      </View>

      {/* Popup menu */}
      {menuVisible && (
        <Animated.View
          entering={FadeInRight.duration(220)}
          exiting={FadeOutRight.duration(180)}
          style={[tw`absolute top-16 right-4 rounded-xl p-3 shadow-lg z-50`, { backgroundColor: theme.colors.card, width: width * 0.55 }]}
        >
          {/* --- Added a button to switch roles --- */}
          <TouchableOpacity
            style={tw`py-2`}
            onPress={() => {
              setRole(role === 'User' ? 'Business' : 'User');
              setMenuVisible(false);
            }}
          >
            <Text style={[tw`text-base`, { color: theme.colors.text }]}>
              Switch to {role === 'User' ? 'Business' : 'User'}
            </Text>
          </TouchableOpacity>

          {["Edit Profile", "Logout"].map((item) => (
            <TouchableOpacity key={item} style={tw`py-2`} onPress={() => setMenuVisible(false)}>
              <Text style={[tw`text-base`, { color: theme.colors.text }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </SafeAreaView>
  );
}