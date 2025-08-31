import React, { FC, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, ImageBackground, Modal, Pressable } from 'react-native';
import { ArrowLeft, Star, MoreVertical, Phone, MessageSquare, IndianRupee, Briefcase, User, Book, MapPin, ClipboardList, Users, Trash2, Edit, Share2, Shield, Archive, Check, X } from 'lucide-react-native';
import tw from 'twrnc';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockContacts, contactsScreenData, Contact, AttendanceRecord, SalaryRecord, PurchaseRecord } from '../../data/contactsData';
import { LinearGradient } from 'expo-linear-gradient';
import { AttendanceCalendar } from '../../components/ui/AttendanceCalendar';

// --- Chhote, Saaf-Suthre Helper Components ---

const ActionButton: FC<{ icon: FC<any>, label: string }> = ({ icon: Icon, label }) => { const { theme } = useTheme(); return ( <TouchableOpacity style={tw`items-center flex-1`}> <View style={[tw`w-14 h-14 rounded-full items-center justify-center mb-2`, { backgroundColor: theme.colors.primary + '1A' }]}><Icon size={24} color={theme.colors.primary} /></View> <Text style={[tw`text-xs font-medium`, { color: theme.colors.primary }]}>{label}</Text> </TouchableOpacity> ); };
const InfoCard: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => { const { theme } = useTheme(); return ( <View style={[tw`mx-4 mb-4 p-4 rounded-2xl`, { backgroundColor: theme.colors.card }]}><Text style={[tw`text-base font-bold mb-3`, { color: theme.colors.text }]}>{title}</Text>{children}</View> ); };
const DetailRow: FC<{ icon: FC<any>; label: string; value: string | React.ReactNode }> = ({ icon: Icon, label, value }) => { const { theme } = useTheme(); return( <View style={tw`flex-row items-start mb-3`}><Icon size={16} color={theme.colors.textSecondary} style={tw`mr-4 mt-1`} /><View style={tw`flex-1`}><Text style={[tw`text-xs`, { color: theme.colors.textSecondary }]}>{label}</Text>{typeof value === 'string' ? ( <Text style={[tw`text-sm font-medium`, { color: theme.colors.text }]}>{value}</Text> ) : ( value )}</View></View> ); };

// --- ✨ Naye Reusable Dashboard Components ---

// Employee Dashboard
const EmployeeDashboard: FC<{ contact: Contact; t: any }> = ({ contact, t }) => {
    const { theme } = useTheme();
    if (!contact.employeeDetails) return null;
    return (
        <InfoCard title={t.employeeDashboard}>
            <DetailRow icon={Briefcase} label={t.labels.position} value={contact.employeeDetails.position} />
            <DetailRow icon={Users} label={t.labels.department} value={contact.employeeDetails.department} />
            <View style={tw`border-b border-gray-200/10 my-3`} />
            <Text style={[tw`font-semibold mb-3`, { color: theme.colors.text }]}>{t.labels.attendance}</Text>
            {/* <View style={tw`flex-row justify-around mb-4`}>
                {contact.employeeDetails.attendance.map(att => (
                    <View key={att.date} style={tw`items-center`}>
                        <View style={[tw`w-10 h-10 rounded-full items-center justify-center`, {backgroundColor: att.status === 'present' ? theme.colors.primary + '20' : '#ef444420'}]}>
                            {att.status === 'present' ? <Check size={18} color={theme.colors.primary} /> : <X size={18} color={'#ef4444'}/>}
                        </View>
                        <Text style={[tw`text-xs mt-1`, {color: theme.colors.textSecondary}]}>{att.date}</Text>
                    </View>
                ))}
            </View> */}
                        <AttendanceCalendar records={contact.employeeDetails.attendance} />

             <View style={tw`border-b border-gray-200/10 my-3`} />
             <Text style={[tw`font-semibold mb-3`, { color: theme.colors.text }]}>{t.labels.salary}</Text>
             {contact.employeeDetails.salaryRecords.map(sal => (
                 <View key={sal.month} style={[tw`flex-row justify-between items-center mb-2 p-2 rounded-lg`, {backgroundColor: theme.colors.background}]}>
                     <Text style={{color: theme.colors.text}}>{sal.month} Salary</Text>
                     <Text style={{color: sal.status === 'paid' ? '#22c55e' : '#f97316'}}>₹{sal.amount} ({sal.status})</Text>
                 </View>
             ))}
        </InfoCard>
    );
};

// Client Dashboard
const ClientDashboard: FC<{ contact: Contact; t: any }> = ({ contact, t }) => {
    const { theme } = useTheme();
    if (!contact.clientDetails) return null;
    return (
        <InfoCard title={t.clientDashboard}>
            <DetailRow icon={IndianRupee} label={t.labels.balance} value={`₹ ${contact.clientDetails.khataBalance}`} />
            <View style={tw`border-b border-gray-200/10 my-3`} />
            <Text style={[tw`font-semibold mb-3`, { color: theme.colors.text }]}>{t.labels.purchases}</Text>
            {contact.clientDetails.purchaseHistory.map((item, i) => (
                <View key={i} style={[tw`flex-row justify-between items-center mb-2 p-2 rounded-lg`, {backgroundColor: theme.colors.background}]}>
                     <View>
                        <Text style={{color: theme.colors.text}}>{item.item}</Text>
                        <Text style={[tw`text-xs mt-1`, {color: theme.colors.textSecondary}]}>{item.date}</Text>
                     </View>
                     <Text style={{color: theme.colors.textSecondary}}>₹{item.amount}</Text>
                </View>
            ))}
        </InfoCard>
    );
}

// --- Main Contact Detail Screen ---
export default function ContactDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const t = contactsScreenData[locale as 'en' | 'hi' | 'en-HI'];
    const [menuVisible, setMenuVisible] = useState(false);

    const contact = mockContacts.find(c => c.id === id);

    if (!contact) return <SafeAreaView style={[tw`flex-1 items-center justify-center`]}><Text>Contact not found.</Text></SafeAreaView>;

    const roleTagStyle = { 'client': tw`bg-blue-500/20 text-blue-500`, 'business': tw`bg-green-500/20 text-green-500`, 'employee': tw`bg-purple-500/20 text-purple-500`, 'user': tw`bg-gray-500/20 text-gray-500` }[contact.role];
    const menuOptions = [ { label: t.menu.edit, icon: Edit }, { label: t.menu.share, icon: Share2 }, { label: t.menu.block, icon: Shield }, { label: t.menu.archive, icon: Archive }, { label: t.menu.delete, icon: Trash2, isDestructive: true }, ];

    return (
        <SafeAreaView style={[tw`flex-1 mb-20`, { backgroundColor: theme.colors.background }]}>
            <View style={tw`absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 h-20 pt-8`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`p-2 rounded-full bg-black/30`}><ArrowLeft size={24} color={'white'} /></TouchableOpacity>
                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity style={tw`mr-2 p-2 rounded-full bg-black/30`}><Star size={22} color={contact.isFavorite ? '#facc15' : 'white'} fill={contact.isFavorite ? '#facc15' : 'transparent'} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={tw`p-2 rounded-full bg-black/30`}><MoreVertical size={24} color={'white'} /></TouchableOpacity>
                </View>
            </View>

            <ScrollView>
                <ImageBackground source={{ uri: contact.businessDetails?.bannerUrl || 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=2070&auto=format&fit=crop' }} style={tw`h-26 w-full justify-end`}>
                     <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={tw`absolute inset-0`} />
                </ImageBackground>
                <View style={tw`-mt-14 items-center`}>
                     <Image source={{ uri: contact.avatarUrl }} style={[tw`w-28 h-28 rounded-full border-4`, {borderColor: theme.colors.background}]} />
                     <Text style={[tw`text-2xl font-medium mt-2`, { color: theme.colors.text }]}>{contact.name}</Text>
                     <View style={tw`flex-row items-center mt-2`}>
                        <Text style={[tw`text-base `, { color: theme.colors.textSecondary }]}>{contact.phone}</Text>
                        <View style={[tw` ml-3 p-2`, ]}><Text style={[tw`text-xs font-bold p-1 rounded-full  px-2 capitalize`, roleTagStyle]}>{contact.role}</Text></View>
                     </View>
                </View>
                
                <View style={[tw`flex-row justify-around mx-4 my-6 p-4 rounded-2xl`, { backgroundColor: theme.colors.card }]}>
                    <ActionButton icon={Phone} label={t.actions.call} />
                    <ActionButton icon={MessageSquare} label={t.actions.message} />
                    <ActionButton icon={IndianRupee} label={t.actions.pay} />
                    {contact.role === 'business' && <ActionButton icon={MapPin} label={t.actions.directions} />}
                </View>
                
                {contact.role === 'employee' && <EmployeeDashboard contact={contact} t={t} />}
                {contact.role === 'client' && <ClientDashboard contact={contact} t={t} />}
                {contact.interactionHistory && <InfoCard title={t.history}>{contact.interactionHistory.map((item, index) => <View key={index}><DetailRow icon={item.type === 'call' ? Phone : MessageSquare} label={item.time} value={item.text || 'Call made'} /></View>)}</InfoCard>}

            </ScrollView>

             <Modal transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)} animationType="fade">
                <Pressable style={tw`flex-1 bg-black/60`} onPress={() => setMenuVisible(false)}>
                    <View style={[tw`absolute top-20 right-4 p-2 rounded-xl w-48`, { backgroundColor: theme.colors.card }]}>
                        {menuOptions.map((opt) => (
                            <TouchableOpacity key={opt.label} style={tw`flex-row items-center p-3 rounded-lg hover:bg-gray-500/10`} onPress={() => setMenuVisible(false)}>
                                <opt.icon size={20} color={opt.isDestructive ? '#ef4444' : theme.colors.text} />
                                <Text style={[tw`ml-3`, { color: opt.isDestructive ? '#ef4444' : theme.colors.text }]}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

// 