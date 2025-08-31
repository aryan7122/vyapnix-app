import { Users, Star, Clock, Briefcase, Store } from 'lucide-react-native';

// --- Types (Inmein koi badlav nahi) ---
export type ContactRole = 'user' | 'business' | 'employee' | 'client';
export type AttendanceRecord = { date: string; status: 'present' | 'absent' | 'leave'; checkIn?: string; checkOut?: string; hoursWorked?: number; };
export type SalaryRecord = { month: string; amount: number; status: 'paid' | 'pending'; };
export type PurchaseRecord = { item: string; amount: number; date: string; };

export type Contact = {
    id: string;
    name: string;
    avatarUrl: string;
    phone: string;
    role: ContactRole;
    isFavorite: boolean;
    isOnline?: boolean;
    interactionHistory?: {
        type: 'call' | 'sms';
        direction?: 'incoming' | 'outgoing';
        time: Date;
        text?: string;
    }[];
    businessDetails?: { bannerUrl: string; category: string; rating: number; location: string; services: string[]; };
    employeeDetails?: {
        position: string;
        department: string;
        attendance: AttendanceRecord[];
        salaryRecords: SalaryRecord[];
    };
    clientDetails?: {
        khataBalance: number;
        purchaseHistory: PurchaseRecord[];
    };
};

// --- Screen ka poora Text ---
export const contactsScreenData = {
    en: {
        title: "Contacts",
        searchPlaceholder: "Search contacts...",
        // ✨ FIX: Saare filters yahan jod diye gaye hain
        filters: [
            { key: 'all', label: 'All', icon: Users },
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'favorites', label: 'Favorites', icon: Star },
            { key: 'business', label: 'Business', icon: Store },
            { key: 'clients', label: 'Clients', icon: Briefcase },
            { key: 'employees', label: 'Employees', icon: Users },
        ],
        // ✨ FIX: Header menu ka text yahan jod diya gaya hai
        headerMenu: {
            addContact: "Add New Contact",
            blockedList: "Blocked List",
            archivedList: "Archived List",
        },
        detailTitle: "Contact Info",
        actions: { call: "Call", message: "Message", pay: "Pay", directions: "Directions" },
        businessInfo: "Business Info",
        employeeDashboard: "Employee Dashboard",
        clientDashboard: "Client Dashboard",
        history: "History",
        labels: { category: "Category", location: "Location", services: "Services", position: "Position", department: "Department", balance: "Balance Due", purchases: "Purchases", attendance: "Attendance", salary: "Salary" },
        menu: { edit: "Edit", share: "Share", block: "Block", archive: "Archive", delete: "Delete" },
    },
    hi: {
        title: "संपर्क",
        searchPlaceholder: "संपर्क खोजें...",
        filters: [
            { key: 'all', label: 'सभी', icon: Users },
            { key: 'recent', label: 'हाल के', icon: Clock },
            { key: 'favorites', label: 'पसंदीदा', icon: Star },
            { key: 'business', label: 'बिजनेस', icon: Store },
            { key: 'clients', label: 'क्लाइंट', icon: Briefcase },
            { key: 'employees', label: 'कर्मचारी', icon: Users },
        ],
        headerMenu: { addContact: "नया संपर्क जोड़ें", blockedList: "ब्लॉक की गई सूची", archivedList: "आर्काइव सूची" },
        detailTitle: "संपर्क जानकारी",
        actions: { call: "कॉल", message: "संदेश", pay: "पे", directions: "दिशा" },
        businessInfo: "व्यापार की जानकारी",
        employeeDashboard: "कर्मचारी डैशबोर्ड",
        clientDashboard: "ग्राहक डैशबोर्ड",
        history: "हिस्ट्री",
        labels: { category: "श्रेणी", location: "स्थान", services: "सेवाएं", position: "पद", department: "विभाग", balance: "बकाया राशि", purchases: "खरीदारी", attendance: "उपस्थिति", salary: "वेतन" },
        menu: { edit: "एडिट", share: "शेयर", block: "ब्लॉक", archive: "आर्काइव", delete: "डिलीट" },
    },
    'en-HI': {
        title: "Contacts",
        searchPlaceholder: "Contacts search karein...",
        filters: [
            { key: 'all', label: 'Sabhi', icon: Users },
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'favorites', label: 'Favorites', icon: Star },
            { key: 'business', label: 'Business', icon: Store },
            { key: 'clients', label: 'Clients', icon: Briefcase },
            { key: 'employees', label: 'Employees', icon: Users },
        ],
        headerMenu: { addContact: "Naya Contact jodein", blockedList: "Blocked List", archivedList: "Archived List" },
        detailTitle: "Contact ki Jaankari",
        actions: { call: "Call", message: "Message", pay: "Pay", directions: "Directions" },
        businessInfo: "Business ki Jaankari",
        employeeDashboard: "Employee ka Dashboard",
        clientDashboard: "Client ka Dashboard",
        history: "History",
        labels: { category: "Category", location: "Location", services: "Services", position: "Position", department: "Department", balance: "Balance Baaki Hai", purchases: "Purchases", attendance: "Attendance", salary: "Salary" },
        menu: { edit: "Edit", share: "Share", block: "Block", archive: "Archive", delete: "Delete" },
    }
};

// --- Sample Data ---
export const mockContacts: Contact[] = [
    {
        id: '1', name: 'Rohan Sharma', avatarUrl: 'https://i.pravatar.cc/300?img=11', phone: '+91 98765 11111', role: 'client', isFavorite: true, isOnline: true,
        interactionHistory: [
            { type: 'sms', time: new Date(2025, 7, 30, 18, 30), text: 'Okay, will send the payment...' },
            { type: 'call', direction: 'incoming', time: new Date(2025, 7, 29, 11, 0) },
        ],
        clientDetails: {
            khataBalance: 500,
            purchaseHistory: [
                { item: 'Custom T-Shirt', amount: 800, date: '25 Aug, 2025' },
                { item: 'Jeans Alteration', amount: 200, date: '15 Aug, 2025' },
            ]
        }
    },
    {
        id: '2', name: 'Priya\'s Boutique', avatarUrl: 'https://i.pravatar.cc/300?img=20', phone: '+91 98765 22222', role: 'business', isFavorite: true, isOnline: true,
        interactionHistory: [ { type: 'call', direction: 'incoming', time: new Date(2025, 7, 28, 15, 20) } ],
        businessDetails: { bannerUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=2070&auto=format&fit=crop', category: 'Fashion Store', rating: 4.8, location: 'Civil Lines, Prayagraj', services: ['Custom Tailoring', 'Bridal Wear', 'Alterations'] }
    },
    {
        id: '3', name: 'Amit Kumar', avatarUrl: 'https://i.pravatar.cc/300?img=33', phone: '+91 98765 33333', role: 'employee', isFavorite: false, isOnline: false,
        interactionHistory: [ { type: 'call', direction: 'outgoing', time: new Date(2025, 7, 31, 10, 15) } ],
        employeeDetails: {
            position: 'Delivery Staff',
            department: 'Logistics',
            attendance: [
               { date: '2025-08-01', status: 'present', checkIn: '09:02 AM', checkOut: '06:10 PM', hoursWorked: 9.1 },
                { date: '2025-08-02', status: 'present', checkIn: '08:58 AM', checkOut: '06:05 PM', hoursWorked: 9.1 },
                { date: '2025-08-04', status: 'absent' },
                { date: '2025-08-05', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: 9.0 },
                { date: '2025-08-06', status: 'leave' },
                { date: '2025-08-25', status: 'present', checkIn: '09:15 AM', checkOut: '06:30 PM', hoursWorked: 9.2 },
                { date: '2025-08-26', status: 'present', checkIn: '09:05 AM', checkOut: '06:00 PM', hoursWorked: 8.9 },
            ],
            salaryRecords: [
                { month: 'July', amount: 15000, status: 'paid' },
                { month: 'August', amount: 15000, status: 'pending' },
            ]
        }
    },
    {
        id: '4', name: 'Neha Singh', avatarUrl: 'https://i.pravatar.cc/300?img=25', phone: '+91 98765 44444', role: 'user', isFavorite: false,
        interactionHistory: [ { type: 'sms', time: new Date(2025, 7, 24, 14, 0), text: 'Hey! Long time no see. Are you free this weekend?' } ]
    },
];

//