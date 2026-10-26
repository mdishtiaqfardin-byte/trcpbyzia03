import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Phone, Lock, User, Calendar, MapPin, CheckCircle, XCircle, 
  HelpCircle, Copy, Check, Upload, Clock, Image, Video, AlertTriangle, 
  ChevronRight, RefreshCw, Trash2, Edit, Plus, Eye, EyeOff, Search, 
  LogOut, Settings, Award, Layers, DollarSign, Smartphone, MessageSquare,
  Globe, ChevronLeft, Play, AlertCircle, Sparkles, Sliders, UserX, UserCheck
} from 'lucide-react';

// --- INITIAL MOCK DATA & STORAGE UTILS ---
const STORAGE_KEYS = {
  USERS: 'trcp_users',
  CURRENT_USER: 'trcp_current_user',
  COLLECTIONS: 'trcp_collections',
  LOCATIONS: 'trcp_locations',
  BOOKINGS: 'trcp_bookings',
  SERVICES: 'trcp_services',
  SETTINGS: 'trcp_settings',
  LANG: 'trcp_lang'
};

const DEFAULT_SETTINGS = {
  bkash: '01847257668',
  nagad: '01971355287',
  rocket: '01788311044'
};

const PRESEEDED_SERVICES = [
  { id: '1', name: 'Live Show - 10 Days', duration: '10 Days', price: 550, type: 'live' },
  { id: '2', name: 'Live Show - 1 Month', duration: '1 Month', price: 1020, type: 'live' },
  { id: '3', name: 'Live Show - 3 Months', duration: '3 Months', price: 1850, type: 'live' },
  { id: '4', name: 'VIP Membership Pass', duration: '6 Months', price: 5000, type: 'membership' }
];

const PRESEEDED_LOCATIONS = [
  {
    id: 'loc_dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    subAreas: [
      { id: 'sub_u3', nameBn: 'উত্তরা সেক্টর ৩', nameEn: 'Uttara Sector 3', type: 'Flat' },
      { id: 'sub_u7', nameBn: 'উত্তরা সেক্টর ৭', nameEn: 'Uttara Sector 7', type: 'Hotel' },
      { id: 'sub_u12', nameBn: 'উত্তরা সেক্টর ১২', nameEn: 'Uttara Sector 12', type: 'Hotel' },
      { id: 'sub_m11', nameBn: 'মিরপুর সাড়ে ১১ ইস্টার্ন হাউজিং', nameEn: 'Mirpur 11.5 Eastern Housing', type: 'Flat' },
      { id: 'sub_m12', nameBn: 'মিরপুর ১২ বাস স্ট্যান্ড', nameEn: 'Mirpur 12 Bus Stand', type: 'Hotel' },
      { id: 'sub_panth', nameBn: 'ফার্মগেট (পান্থপথ)', nameEn: 'Farmgate (Panthapath)', type: 'Flat' },
      { id: 'sub_tej', nameBn: 'ফার্মগেট (তেজতুরি বাজার)', nameEn: 'Farmgate (Tejturi Bazar)', type: 'Hotel' },
      { id: 'sub_dhan', nameBn: 'ধানমণ্ডি (১০R/A)', nameEn: 'Dhanmondi (10R/A)', type: 'Flat' },
      { id: 'sub_gul', nameBn: 'গুলশান (শাহজাদপুর)', nameEn: 'Gulshan (Shahjadpur)', type: 'Hotel' },
      { id: 'sub_ban', nameBn: 'বনানী (সি ব্লক)', nameEn: 'Banani (C Block)', type: 'Flat' },
      { id: 'sub_dhk_other', nameBn: 'অন্যান্য সকল এরিয়া', nameEn: 'All Other Areas', type: 'Hotel' }
    ]
  },
  {
    id: 'loc_ctg',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chittagong',
    subAreas: [
      { id: 'sub_feni', nameBn: 'ফেনী: মহিপাল', nameEn: 'Feni: Mohipal', type: 'Hotel' },
      { id: 'sub_sita', nameBn: 'সীতাকুণ্ড: কলেজ রোড', nameEn: 'Sitakunda: College Road', type: 'Both' },
      { id: 'sub_hata', nameBn: 'হাটহাজারী', nameEn: 'Hathazari', type: 'Both' },
      { id: 'sub_koto', nameBn: 'কোতোয়ালি', nameEn: 'Kotwali', type: 'Hotel' },
      { id: 'sub_gec', nameBn: 'জি ই সি', nameEn: 'GEC Circle', type: 'Flat' },
      { id: 'sub_agra', nameBn: 'আগ্রাবাদ', nameEn: 'Agrabad', type: 'Both' }
    ]
  },
  {
    id: 'loc_cox',
    nameBn: 'কক্সবাজার',
    nameEn: 'Cox\'s Bazar',
    subAreas: [
      { id: 'sub_cox_hotel', nameBn: 'হোটেল জোন', nameEn: 'Hotel Zone', type: 'Hotel' }
    ]
  },
  {
    id: 'loc_raj',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    subAreas: [
      { id: 'sub_bindu', nameBn: 'বিন্দুরমোড়', nameEn: 'Bindur Mor', type: 'Flat' },
      { id: 'sub_sahab', nameBn: 'সাহেব বাজার', nameEn: 'Saheb Bazar', type: 'Both' }
    ]
  },
  {
    id: 'loc_khu',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    subAreas: [
      { id: 'sub_shib', nameBn: 'শীব বাড়ি', nameEn: 'Shib Bari', type: 'Both' }
    ]
  },
  {
    id: 'loc_bar',
    nameBn: 'বরিশাল',
    nameEn: 'Barisal',
    subAreas: [
      { id: 'sub_sador', nameBn: 'সদর রোড', nameEn: 'Sador Road', type: 'Hotel' }
    ]
  },
  {
    id: 'loc_com',
    nameBn: 'কুমিল্লা',
    nameEn: 'Comilla',
    subAreas: [
      { id: 'sub_kandir', nameBn: 'কান্ডিরপাড়', nameEn: 'Kandirpar', type: 'Flat' }
    ]
  },
  {
    id: 'loc_hobi',
    nameBn: 'হবিগঞ্জ',
    nameEn: 'Habiganj',
    subAreas: [
      { id: 'sub_bridge', nameBn: 'নতুন ব্রিজ', nameEn: 'Notun Bridge', type: 'Hotel' },
      { id: 'sub_shaesta', nameBn: 'শায়েস্তানগর', nameEn: 'Shaestanagar', type: 'Flat' },
      { id: 'sub_kali', nameBn: 'কালীবাড়ি', nameEn: 'Kalibari', type: 'Hotel' },
      { id: 'sub_baby', nameBn: 'বেবি স্ট্যান্ড', nameEn: 'Baby Stand', type: 'Flat' }
    ]
  },
  {
    id: 'loc_syl',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    subAreas: [
      { id: 'sub_bondor', nameBn: 'বন্দর বাজার', nameEn: 'Bondor Bazar', type: 'Hotel' },
      { id: 'sub_zinda', nameBn: 'জিন্দাবাজার', nameEn: 'Zindabazar', type: 'Flat' },
      { id: 'sub_modina', nameBn: 'মদিনা মার্কেট', nameEn: 'Modina Market', type: 'Both' },
      { id: 'sub_dorga', nameBn: 'দরগা গেইট', nameEn: 'Dorga Gate', type: 'Hotel' },
      { id: 'sub_amber', nameBn: 'আম্বরখানা', nameEn: 'Amberkhana', type: 'Flat' }
    ]
  }
];

const PRESEEDED_COLLECTIONS = [
  // Medium Category (Codes 01-100)
  { id: 'col_01', code: '05', name: 'Ayesha Rahman', category: 'Medium', photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: true },
  { id: 'col_02', code: '12', name: 'Tania Ahmed', category: 'Medium', photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: true },
  { id: 'col_03', code: '24', name: 'Nusrat Jahan', category: 'Medium', photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: true },
  { id: 'col_04', code: '35', name: 'Rita Chowdhury', category: 'Medium', photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: false },
  
  // Premium Category (Codes 101-200)
  { id: 'col_05', code: '105', name: 'Maya Islam', category: 'Premium', photos: ['https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: true },
  { id: 'col_06', code: '118', name: 'Zara Hossain', category: 'Premium', photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: true },
  { id: 'col_07', code: '142', name: 'Priya Roy', category: 'Premium', photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: true },
  
  // New Special Collection (Codes 301-399)
  { id: 'col_08', code: '305', name: 'Sumi Sultana', category: 'New Special Collection', photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: true },
  { id: 'col_09', code: '312', name: 'Anika Khan', category: 'New Special Collection', photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'], videoUrl: '', isAvailableTodayVideo: true }
];

// TRANSLATIONS DICTIONARY
const TRANSLATIONS = {
  bn: {
    appName: 'TRCP AGENCY',
    tagline: 'প্রিমিয়াম অনলাইন সার্ভিস ও বুকিং প্ল্যাটফর্ম',
    login: 'লগইন',
    register: 'রেজিস্ট্রেশন',
    logout: 'লগ আউট',
    adminLogin: 'অ্যাডমিন পোর্টাল',
    name: 'নাম',
    phone: 'ফোন নম্বর',
    password: '৪-সংখ্যার পাসওয়ার্ড',
    realService: 'রিয়েল সার্ভিস',
    videoService: 'ভিডিও সার্ভিস',
    liveShow: 'লাইভ শো',
    myBookings: 'আমার বুকিং',
    mainArea: 'প্রধান এরিয়া নির্বাচন করুন',
    subArea: 'সাব-এরিয়া নির্বাচন করুন',
    selectDate: 'তারিখ নির্বাচন করুন (পরবর্তী ১০ দিন)',
    availableCollections: 'উপলব্ধ কালেকশন সমূহ',
    duration: 'সময়কাল / ক্যাটাগরি',
    totalPrice: 'মোট চার্জ',
    advancePay: 'অগ্রিম পেমেন্ট',
    duePay: 'বাকি ক্যাশ ইন হ্যান্ড',
    proceedPayment: 'পেমেন্টে এগিয়ে যান',
    copy: 'কপি করুন',
    copied: 'কপি হয়েছে!',
    paymentNotice: 'উক্ত নাম্বারে শুধুমাত্র সেন্ড মানি অথবা ক্যাশ ইন গ্রহন করা হয়। অনুগ্রহ করে সঠিক পেমেন্ট অ্যামাউন্ট ক্যাশ ইন বা সেন্ড মানি করুন।',
    trxType: 'পেমেন্টের ধরন',
    sendMoney: 'সেন্ড মানি',
    cashIn: 'ক্যাশ ইন',
    uploadScreenshot: 'গ্যালারি থেকে স্ক্রিনশট আপলোড করুন',
    last4Digits: 'লাস্ট ৪ ডিজিট লিখুন',
    confirmBooking: 'বুকিং কনফার্ম করুন',
    cancelNotice: 'বুকিং ক্যানসেল করতে হেল্প লাইন এ যোগাযোগ করুন।',
    statusPending: 'পেন্ডিং (অপেক্ষা করুন)',
    statusApproved: 'কনফার্মড / অনুমোদিত',
    statusRejected: 'বাতিলকৃত',
    helpdesk: 'সাহায্যের জন্য হেল্পলাইন',
    adminDashboard: 'অ্যাডমিন ড্যাশবোর্ড',
    clients: 'ক্লায়েন্ট তালিকা',
    bookings: 'বুকিং তালিকা',
    collections: 'কালেকশন ম্যানেজার',
    locations: 'লোকেশন ম্যানেজমেন্ট',
    settings: 'ক্যাশিয়ার নম্বর ও সেটিংস',
    banned: 'ব্লকড / ব্যানড',
    banUser: 'ব্যান করুন',
    unbanUser: 'আনব্যান করুন',
    approve: 'অনুমোদন',
    reject: 'বাতিল',
    addCollection: 'নতুন কালেকশন যোগ করুন',
    code: 'কোড',
    photosMax5: 'ছবি আপলোড (সর্বোচ্চ ৫ টি)',
    videoMax1: 'ভিডিও আপলোড/লিঙ্ক',
    customRate: 'কাস্টম/ম্যানুয়াল রেট (ঐচ্ছিক)',
    availableVideoToday: 'আজকের ভিডিও সার্ভিসে এভেইলএবল',
    placeType: 'প্লেস টাইপ',
    flat: 'ফ্ল্যাট',
    hotel: 'হোটেল',
    both: 'ফ্ল্যাট ও হোটেল',
    langToggle: 'English'
  },
  en: {
    appName: 'TRCP AGENCY',
    tagline: 'Premium Online Service & Booking Platform',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    adminLogin: 'Admin Portal',
    name: 'Full Name',
    phone: 'Phone Number',
    password: '4-Digit Password',
    realService: 'Real Service',
    videoService: 'Video Service',
    liveShow: 'Live Show',
    myBookings: 'My Bookings',
    mainArea: 'Select Main Area',
    subArea: 'Select Sub-Area',
    selectDate: 'Select Date (Next 10 Days)',
    availableCollections: 'Available Profiles',
    duration: 'Duration / Category',
    totalPrice: 'Total Charge',
    advancePay: 'Advance Payment',
    duePay: 'Hand Cash Due',
    proceedPayment: 'Proceed to Payment',
    copy: 'Copy',
    copied: 'Copied!',
    paymentNotice: 'Only Send Money or Cash In accepted to this number. Please send the exact amount.',
    trxType: 'Transaction Method',
    sendMoney: 'Send Money',
    cashIn: 'Cash In',
    uploadScreenshot: 'Upload Gallery Screenshot',
    last4Digits: 'Enter Last 4 Digits',
    confirmBooking: 'Confirm Booking',
    cancelNotice: 'To cancel your booking, please contact our helpline.',
    statusPending: 'Pending Confirmation',
    statusApproved: 'Confirmed / Approved',
    statusRejected: 'Cancelled',
    helpdesk: 'Helpline Support',
    adminDashboard: 'Admin Dashboard',
    clients: 'Client Users',
    bookings: 'Booking Requests',
    collections: 'Collection Manager',
    locations: 'Location Manager',
    settings: 'Cashier Numbers',
    banned: 'Banned',
    banUser: 'Ban Account',
    unbanUser: 'Unban Account',
    approve: 'Approve',
    reject: 'Reject',
    addCollection: 'Add New Collection',
    code: 'Code',
    photosMax5: 'Photos Upload (Max 5)',
    videoMax1: 'Video Upload/Link',
    customRate: 'Custom Rate (Optional)',
    availableVideoToday: 'Available for Today\'s Video Service',
    placeType: 'Place Type',
    flat: 'Flat',
    hotel: 'Hotel',
    both: 'Flat & Hotel',
    langToggle: 'বাংলা'
  }
};

export default function App() {
  // State initialization with localStorage fallback
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEYS.LANG) || 'bn');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    return saved ? JSON.parse(saved) : PRESEEDED_COLLECTIONS;
  });

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    return saved ? JSON.parse(saved) : PRESEEDED_LOCATIONS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : PRESEEDED_SERVICES;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // UI Flow States
  const [activeTab, setActiveTab] = useState('real'); // real, video, live, myBookings, admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  // Client Auth States
  const [authMode, setAuthMode] = useState('login'); // login, register
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');

  // Toast Notification
  const [toast, setToast] = useState('');

  // Image Preview Carousel Modal State
  const [carouselMedia, setCarouselMedia] = useState(null); // { photos: [], videoUrl: '', index: 0 }

  // Sync states to local storage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LANG, lang); }, [lang]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { 
    if (currentUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser)); 
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }, [currentUser]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections)); }, [collections]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations)); }, [locations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const t = TRANSLATIONS[lang];

  // Helper date generator for 10-day window
  const next10Days = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const display = d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push({ iso, display });
    }
    return dates;
  }, [lang]);

  // Handle Client Auth
  const handleClientRegister = (e) => {
    e.preventDefault();
    if (!authName || !authPhone || authPass.length !== 4) {
      setAuthError(lang === 'bn' ? 'দয়া করে সকল তথ্য সঠিকভাবে প্রদান করুন (পাসওয়ার্ড ৪ ডিজিট হতে হবে)।' : 'Please fill all details (Password must be 4 digits).');
      return;
    }
    const existing = users.find(u => u.phone === authPhone);
    if (existing) {
      setAuthError(lang === 'bn' ? 'এই ফোন নম্বরে ইতিপূর্বে অ্যাকাউন্ট খোলা হয়েছে।' : 'Phone number already registered.');
      return;
    }
    const newUser = { id: 'usr_' + Date.now(), name: authName, phone: authPhone, password: authPass, isBanned: false, createdAt: new Date().toISOString() };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setAuthError('');
    showToastMsg(lang === 'bn' ? 'অ্যাকেউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully!');
  };

  const handleClientLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.phone === authPhone && u.password === authPass);
    if (!user) {
      setAuthError(lang === 'bn' ? 'ফোন নম্বর অথবা পাসওয়ার্ড ভুল হয়েছে।' : 'Invalid phone number or password.');
      return;
    }
    if (user.isBanned) {
      setAuthError(lang === 'bn' ? 'আপনার অ্যাকাউন্টটি স্থগিত করা হয়েছে। সহায়তা প্যানেলে যোগাযোগ করুন।' : 'Your account has been banned. Please contact support.');
      return;
    }
    setCurrentUser(user);
    setAuthError('');
    showToastMsg(lang === 'bn' ? 'লগইন সফল হয়েছে!' : 'Logged in successfully!');
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminPhone === '01971355287' && adminPass === '181296') {
      setIsAdminLoggedIn(true);
      setShowAdminModal(false);
      setActiveTab('admin');
      showToastMsg(lang === 'bn' ? 'অ্যাডমিন পোর্টাল আনলক হয়েছে!' : 'Admin portal unlocked!');
    } else {
      showToastMsg(lang === 'bn' ? 'অ্যাডমিন ক্রিডেনশিয়াল ভুল!' : 'Invalid admin credentials!');
    }
  };

  // --- AUTOMATIC MATRIX DISTRIBUTION ENGINE ---
  // Guaranteed rotation without collision across dates/locations
  const getAutoAllocatedCollections = (subAreaId, dateIso) => {
    if (!subAreaId || !dateIso) return [];
    
    // Convert date + area string to numeric hash key
    let hash = 0;
    const key = `${subAreaId}_${dateIso}`;
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const mediumCols = collections.filter(c => c.category === 'Medium');
    const premiumCols = collections.filter(c => c.category === 'Premium');
    const specialCols = collections.filter(c => c.category === 'New Special Collection');

    const rotate = (arr, count, offset) => {
      if (arr.length === 0) return [];
      const start = Math.abs(offset) % arr.length;
      const res = [];
      for (let i = 0; i < Math.min(count, arr.length); i++) {
        res.push(arr[(start + i) % arr.length]);
      }
      return res;
    };

    const selectedMedium = rotate(mediumCols, 3, hash);
    const selectedPremium = rotate(premiumCols, 3, hash + 3);
    const selectedSpecial = rotate(specialCols, 2, hash + 7);

    return [...selectedMedium, ...selectedPremium, ...selectedSpecial];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      {/* GLOBAL TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* PERSISTENT FLOATING HELPLINE WIDGETS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a 
          href="https://wa.me/8801823020470" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 border border-emerald-400"
          title="WhatsApp Helpline: 01823020470"
        >
          <MessageSquare className="w-6 h-6" />
        </a>
        <a 
          href="https://t.me/crsaaadmin03" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-sky-600 hover:bg-sky-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 border border-sky-400"
          title="Telegram Helpline: @crsaaadmin03"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 p-2 rounded-xl font-black text-xl tracking-wider shadow-lg">
              TRCP
            </div>
            <div>
              <h1 className="text-lg font-black text-amber-400 tracking-wide">{t.appName}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">{t.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <button 
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.langToggle}</span>
            </button>

            {/* Admin Portal Toggle Button */}
            {!isAdminLoggedIn ? (
              <button 
                onClick={() => setShowAdminModal(true)}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-lg border border-slate-700 text-xs flex items-center gap-1"
                title="Admin Login"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{t.adminLogin}</span>
              </button>
            ) : (
              <button 
                onClick={() => { setIsAdminLoggedIn(false); setActiveTab('real'); }}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Admin</span>
              </button>
            )}

            {/* Client User Info / Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right text-xs hidden md:block">
                  <p className="font-bold text-amber-300">{currentUser.name}</p>
                  <p className="text-slate-400 text-[10px]">{currentUser.phone}</p>
                </div>
                <button 
                  onClick={() => { setCurrentUser(null); showToastMsg('Logged out'); }}
                  className="bg-slate-800 text-slate-400 hover:text-white p-2 rounded-lg"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* NAVIGATION BAR */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-[61px] z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-around sm:justify-start gap-1 sm:gap-4 px-2 py-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('real')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'real' 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t.realService}</span>
          </button>

          <button 
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'video' 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{t.videoService}</span>
          </button>

          <button 
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'live' 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.liveShow}</span>
          </button>

          {currentUser && (
            <button 
              onClick={() => setActiveTab('myBookings')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'myBookings' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{t.myBookings}</span>
            </button>
          )}

          {isAdminLoggedIn && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'admin' 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'text-emerald-400 hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{t.adminDashboard}</span>
            </button>
          )}
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* CLIENT AUTHENTICATION BANNER / MODAL IF NOT LOGGED IN */}
        {!currentUser && activeTab !== 'admin' && (
          <div className="mb-8 max-w-md mx-auto bg-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-2xl">
            <div className="flex border-b border-slate-800 mb-6">
              <button 
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 font-bold text-center text-sm ${authMode === 'login' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500'}`}
              >
                {t.login}
              </button>
              <button 
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 font-bold text-center text-sm ${authMode === 'register' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500'}`}
              >
                {t.register}
              </button>
            </div>

            {authError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={authMode === 'login' ? handleClientLogin : handleClientRegister} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">{t.name}</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input 
                      type="text" 
                      required 
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      placeholder="e.g. Rahim Uddin"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{t.phone}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input 
                    type="tel" 
                    required 
                    value={authPhone}
                    onChange={e => setAuthPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{t.password}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input 
                    type="password" 
                    maxLength={4}
                    required 
                    value={authPass}
                    onChange={e => setAuthPass(e.target.value)}
                    placeholder="****"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all"
              >
                {authMode === 'login' ? t.login : t.register}
              </button>
            </form>
          </div>
        )}

        {/* LOGGED IN CLIENT CONTENT */}
        {currentUser && (
          <div>
            {/* 1. REAL SERVICE PORTAL */}
            {activeTab === 'real' && (
              <RealServicePortal 
                locations={locations}
                collections={collections}
                next10Days={next10Days}
                getAutoAllocatedCollections={getAutoAllocatedCollections}
                currentUser={currentUser}
                settings={settings}
                setBookings={setBookings}
                bookings={bookings}
                t={t}
                lang={lang}
                showToastMsg={showToastMsg}
                setCarouselMedia={setCarouselMedia}
              />
            )}

            {/* 2. VIDEO SERVICE PORTAL */}
            {activeTab === 'video' && (
              <VideoServicePortal 
                collections={collections}
                currentUser={currentUser}
                settings={settings}
                setBookings={setBookings}
                bookings={bookings}
                t={t}
                lang={lang}
                showToastMsg={showToastMsg}
                setCarouselMedia={setCarouselMedia}
              />
            )}

            {/* 3. LIVE SHOW PORTAL */}
            {activeTab === 'live' && (
              <LiveShowPortal 
                services={services}
                currentUser={currentUser}
                settings={settings}
                setBookings={setBookings}
                bookings={bookings}
                t={t}
                lang={lang}
                showToastMsg={showToastMsg}
              />
            )}

            {/* 4. CLIENT BOOKING HISTORY */}
            {activeTab === 'myBookings' && (
              <ClientBookingHistory 
                currentUser={currentUser}
                bookings={bookings}
                t={t}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* 5. ADMIN DASHBOARD */}
        {activeTab === 'admin' && isAdminLoggedIn && (
          <AdminDashboard 
            users={users}
            setUsers={setUsers}
            collections={collections}
            setCollections={setCollections}
            locations={locations}
            setLocations={setLocations}
            bookings={bookings}
            setBookings={setBookings}
            services={services}
            setServices={setServices}
            settings={settings}
            setSettings={setSettings}
            t={t}
            lang={lang}
            showToastMsg={showToastMsg}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TRCP AGENCY. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>WhatsApp: 01823020470</span>
            <span>Telegram: @crsaaadmin03</span>
          </div>
        </div>
      </footer>

      {/* HIDDEN STRICT ADMIN LOGIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-amber-400" />
              <h3 className="font-bold text-lg text-white">{t.adminLogin}</h3>
            </div>
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.phone}</label>
                <input 
                  type="tel"
                  required
                  value={adminPhone}
                  onChange={e => setAdminPhone(e.target.value)}
                  placeholder="019XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.password}</label>
                <input 
                  type="password"
                  required
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  placeholder="******"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm shadow-lg transition-all"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY PHOTO CAROUSEL SLIDER MODAL */}
      {carouselMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <button 
              onClick={() => setCarouselMedia(null)}
              className="absolute top-4 right-4 z-10 bg-slate-950/70 text-white p-2 rounded-full hover:bg-red-600 transition-all"
            >
              ✕
            </button>

            <div className="relative h-96 bg-black flex items-center justify-center">
              {carouselMedia.photos && carouselMedia.photos.length > 0 ? (
                <img 
                  src={carouselMedia.photos[carouselMedia.index]} 
                  alt="Gallery Slide" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-slate-500 flex flex-col items-center gap-2">
                  <Image className="w-12 h-12" />
                  <span>No Photos Uploaded</span>
                </div>
              )}

              {/* Navigation Arrows */}
              {carouselMedia.photos && carouselMedia.photos.length > 1 && (
                <>
                  <button 
                    onClick={() => setCarouselMedia(prev => ({
                      ...prev,
                      index: (prev.index - 1 + prev.photos.length) % prev.photos.length
                    }))}
                    className="absolute left-4 bg-slate-950/60 hover:bg-amber-500 hover:text-slate-950 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setCarouselMedia(prev => ({
                      ...prev,
                      index: (prev.index + 1) % prev.photos.length
                    }))}
                    className="absolute right-4 bg-slate-950/60 hover:bg-amber-500 hover:text-slate-950 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {carouselMedia.photos && carouselMedia.photos.length > 1 && (
              <div className="p-4 bg-slate-950 flex items-center justify-center gap-2 overflow-x-auto">
                {carouselMedia.photos.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCarouselMedia(prev => ({ ...prev, index: idx }))}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      carouselMedia.index === idx ? 'border-amber-500 scale-105' : 'border-transparent opacity-50'
                    }`}
                  >
                    <img src={url} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. REAL SERVICE PORTAL COMPONENT
// ==========================================
function RealServicePortal({ 
  locations, collections, next10Days, getAutoAllocatedCollections, 
  currentUser, settings, setBookings, bookings, t, lang, showToastMsg, setCarouselMedia 
}) {
  const [selectedMainLoc, setSelectedMainLoc] = useState(locations[0]?.id || '');
  const [selectedSubArea, setSelectedSubArea] = useState('');
  const [selectedDate, setSelectedDate] = useState(next10Days[0]?.iso || '');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('1 Hour');
  
  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [trxType, setTrxType] = useState('sendMoney');
  const [trxScreenshot, setTrxScreenshot] = useState('');
  const [last4Digits, setLast4Digits] = useState('');

  const currentMainObj = locations.find(l => l.id === selectedMainLoc);

  useEffect(() => {
    if (currentMainObj && currentMainObj.subAreas.length > 0) {
      setSelectedSubArea(currentMainObj.subAreas[0].id);
    }
  }, [selectedMainLoc]);

  const allocatedCols = useMemo(() => {
    return getAutoAllocatedCollections(selectedSubArea, selectedDate);
  }, [selectedSubArea, selectedDate, collections]);

  // Pricing Matrix Logic
  const getRate = (category, duration) => {
    if (category === 'Medium') {
      if (duration === '1 Hour') return 2000;
      if (duration === '2 Hours') return 3200;
      if (duration === '3 Hours') return 4500;
      if (duration === 'Night') return 6000;
    } else if (category === 'Premium') {
      if (duration === '1 Hour') return 3000;
      if (duration === '2 Hours') return 4200;
      if (duration === '3 Hours') return 5500;
      if (duration === 'Night') return 8000;
    } else if (category === 'New Special Collection') {
      if (duration === '1 Hour') return 2500;
      if (duration === '2 Hours') return 3800;
      if (duration === '3 Hours') return 5000;
      if (duration === 'Night') return 7000;
    }
    return 2000;
  };

  const totalRate = selectedCollection?.customRates?.[selectedDuration] || getRate(selectedCollection?.category, selectedDuration);

  // ADVANCE CALCULATION RULE
  // If Total == 2000 => 50% advance (1000)
  // If Total > 2000 => Fixed 1230 BDT advance
  const advanceAmount = totalRate === 2000 ? 1000 : (totalRate > 2000 ? 1230 : totalRate);
  const dueAmount = totalRate - advanceAmount;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (trxType === 'sendMoney' && !trxScreenshot) {
      showToastMsg(lang === 'bn' ? 'অনুগ্রহ করে স্ক্রিনশট আপলোড করুন' : 'Please upload screenshot');
      return;
    }
    if (trxType === 'cashIn' && last4Digits.length !== 4) {
      showToastMsg(lang === 'bn' ? 'অনুগ্রহ করে লাস্ট ৪ ডিজিট প্রদান করুন' : 'Please provide last 4 digits');
      return;
    }

    const subObj = currentMainObj?.subAreas.find(s => s.id === selectedSubArea);

    const newBooking = {
      id: 'bk_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      serviceType: 'Real Service',
      code: selectedCollection.code,
      profileName: selectedCollection.name,
      mainArea: lang === 'bn' ? currentMainObj?.nameBn : currentMainObj?.nameEn,
      subArea: lang === 'bn' ? subObj?.nameBn : subObj?.nameEn,
      placeType: subObj?.type,
      date: selectedDate,
      duration: selectedDuration,
      totalRate,
      advancePaid: advanceAmount,
      dueBalance: dueAmount,
      paymentMethod,
      trxType,
      trxScreenshot,
      last4Digits,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setBookings([newBooking, ...bookings]);
    setShowCheckout(false);
    setSelectedCollection(null);
    showToastMsg(lang === 'bn' ? 'পেমেন্ট গ্রহন হয়েছে, কনফার্মেশন এর জন্য অপেক্ষা করুন।' : 'Payment received. Waiting for confirmation.');
  };

  return (
    <div className="space-y-6">
      {/* SELECTION BAR */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>{t.realService} - {t.mainArea}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Main Area Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">{t.mainArea}</label>
            <select 
              value={selectedMainLoc} 
              onChange={e => setSelectedMainLoc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{lang === 'bn' ? loc.nameBn : loc.nameEn}</option>
              ))}
            </select>
          </div>

          {/* Sub Area Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">{t.subArea}</label>
            <select 
              value={selectedSubArea} 
              onChange={e => setSelectedSubArea(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            >
              {currentMainObj?.subAreas.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {lang === 'bn' ? sub.nameBn : sub.nameEn} ({sub.type})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">{t.selectDate}</label>
            <select 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            >
              {next10Days.map(d => (
                <option key={d.iso} value={d.iso}>{d.display}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AVAILABLE COLLECTIONS GRID */}
      <div>
        <h3 className="text-md font-bold text-slate-300 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.availableCollections} ({allocatedCols.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allocatedCols.map(col => (
            <div key={col.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/40 transition-all flex flex-col">
              {/* Photo Slider Thumbnail */}
              <div 
                className="relative h-64 bg-slate-950 cursor-pointer group"
                onClick={() => setCarouselMedia({ photos: col.photos, videoUrl: col.videoUrl, index: 0 })}
              >
                {col.photos && col.photos.length > 0 ? (
                  <img src={col.photos[0]} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Image className="w-10 h-10" />
                  </div>
                )}
                
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black text-amber-400 border border-amber-500/30">
                  CODE: {col.code}
                </div>

                {col.photos && col.photos.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    <span>+{col.photos.length - 1} photos</span>
                  </div>
                )}
              </div>

              {/* Profile Meta */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white text-base">{col.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                      {col.category}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => { setSelectedCollection(col); setShowCheckout(true); }}
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1"
                >
                  <span>Book Now / বুক করুন</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING CHECKOUT MODAL */}
      {showCheckout && selectedCollection && (
        <CheckoutModal 
          selectedCollection={selectedCollection}
          serviceType="Real Service"
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          durationOptions={['1 Hour', '2 Hours', '3 Hours', 'Night']}
          totalRate={totalRate}
          advanceAmount={advanceAmount}
          dueAmount={dueAmount}
          settings={settings}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          trxType={trxType}
          setTrxType={setTrxType}
          trxScreenshot={trxScreenshot}
          setTrxScreenshot={setTrxScreenshot}
          last4Digits={last4Digits}
          setLast4Digits={setLast4Digits}
          handleBookingSubmit={handleBookingSubmit}
          onClose={() => setShowCheckout(false)}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

// ==========================================
// 2. VIDEO SERVICE PORTAL COMPONENT
// ==========================================
function VideoServicePortal({ 
  collections, currentUser, settings, setBookings, bookings, t, lang, showToastMsg, setCarouselMedia 
}) {
  const [selectedCategory, setSelectedCategory] = useState('Medium');
  const [selectedDuration, setSelectedDuration] = useState('10 Mins');
  const [selectedCollection, setSelectedCollection] = useState(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [trxType, setTrxType] = useState('sendMoney');
  const [trxScreenshot, setTrxScreenshot] = useState('');
  const [last4Digits, setLast4Digits] = useState('');

  // Video Services Available Today Filter
  const filteredCols = collections.filter(c => c.isAvailableTodayVideo && c.category === selectedCategory);

  const getVideoRate = (cat, dur) => {
    if (cat === 'Medium') {
      if (dur === '10 Mins') return 750;
      if (dur === '20 Mins') return 1020;
      if (dur === '30 Mins') return 1530;
      if (dur === '60 Mins / 1 Hr') return 2040;
    } else if (cat === 'Premium') {
      if (dur === '10 Mins') return 915;
      if (dur === '20 Mins') return 1230;
      if (dur === '30 Mins') return 1750;
      if (dur === '60 Mins / 1 Hr') return 2550;
    } else if (cat === 'New Special Collection') {
      if (dur === '10 Mins') return 850;
      if (dur === '20 Mins') return 1125;
      if (dur === '30 Mins') return 1630;
      if (dur === '60 Mins / 1 Hr') return 2250;
    }
    return 750;
  };

  const totalRate = selectedCollection?.customRates?.[selectedDuration] || getVideoRate(selectedCategory, selectedDuration);

  // VIDEO SERVICE REQUIRE 100% ONLINE PAYMENT ADVANCE
  const advanceAmount = totalRate;
  const dueAmount = 0;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (trxType === 'sendMoney' && !trxScreenshot) {
      showToastMsg(lang === 'bn' ? 'অনুগ্রহ করে স্ক্রিনশট আপলোড করুন' : 'Please upload screenshot');
      return;
    }
    if (trxType === 'cashIn' && last4Digits.length !== 4) {
      showToastMsg(lang === 'bn' ? 'অনুগ্রহ করে লাস্ট ৪ ডিজিট প্রদান করুন' : 'Please provide last 4 digits');
      return;
    }

    const newBooking = {
      id: 'bk_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      serviceType: 'Video Service',
      code: selectedCollection.code,
      profileName: selectedCollection.name,
      duration: selectedDuration,
      totalRate,
      advancePaid: advanceAmount,
      dueBalance: dueAmount,
      paymentMethod,
      trxType,
      trxScreenshot,
      last4Digits,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setBookings([newBooking, ...bookings]);
    setShowCheckout(false);
    setSelectedCollection(null);
    showToastMsg(lang === 'bn' ? 'পেমেন্ট গ্রহন হয়েছে, কনফার্মেশন এর জন্য অপেক্ষা করুন।' : 'Payment received. Waiting for confirmation.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
          <Video className="w-5 h-5" />
          <span>{t.videoService}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">ক্যাটাগরি নির্বাচন করুন</label>
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            >
              <option value="Medium">Medium Category (Code 01-100)</option>
              <option value="Premium">Premium Category (Code 101-200)</option>
              <option value="New Special Collection">New Collection (Code 301-399)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">সময়কাল নির্বাচন করুন</label>
            <select 
              value={selectedDuration} 
              onChange={e => setSelectedDuration(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            >
              <option value="10 Mins">10 Mins (Face + Fingering)</option>
              <option value="20 Mins">20 Mins (Fingering + Mal Out)</option>
              <option value="30 Mins">30 Mins (Fingering + Mal Out + Nude Dance)</option>
              <option value="60 Mins / 1 Hr">60 Mins / 1 Hr (Full Bath Service)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCols.map(col => (
          <div key={col.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div 
              className="relative h-64 bg-slate-950 cursor-pointer group"
              onClick={() => setCarouselMedia({ photos: col.photos, videoUrl: col.videoUrl, index: 0 })}
            >
              {col.photos && col.photos.length > 0 ? (
                <img src={col.photos[0]} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <Video className="w-10 h-10" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black text-amber-400">
                CODE: {col.code}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-base">{col.name}</h4>
                <p className="text-xs text-amber-400 font-bold mt-1">Charge: {getVideoRate(selectedCategory, selectedDuration)} BDT (100% Online)</p>
              </div>

              <button 
                onClick={() => { setSelectedCollection(col); setShowCheckout(true); }}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1"
              >
                <span>Select & Pay / পেমেন্ট করুন</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCheckout && selectedCollection && (
        <CheckoutModal 
          selectedCollection={selectedCollection}
          serviceType="Video Service"
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          durationOptions={['10 Mins', '20 Mins', '30 Mins', '60 Mins / 1 Hr']}
          totalRate={totalRate}
          advanceAmount={advanceAmount}
          dueAmount={dueAmount}
          settings={settings}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          trxType={trxType}
          setTrxType={setTrxType}
          trxScreenshot={trxScreenshot}
          setTrxScreenshot={setTrxScreenshot}
          last4Digits={last4Digits}
          setLast4Digits={setLast4Digits}
          handleBookingSubmit={handleBookingSubmit}
          onClose={() => setShowCheckout(false)}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

// ==========================================
// 3. LIVE SHOW PORTAL COMPONENT
// ==========================================
function LiveShowPortal({ 
  services, currentUser, settings, setBookings, bookings, t, lang, showToastMsg 
}) {
  const [selectedService, setSelectedService] = useState(services[0] || null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [trxType, setTrxType] = useState('sendMoney');
  const [trxScreenshot, setTrxScreenshot] = useState('');
  const [last4Digits, setLast4Digits] = useState('');

  const liveServices = services.filter(s => s.type === 'live' || s.type === 'membership');

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (trxType === 'sendMoney' && !trxScreenshot) {
      showToastMsg(lang === 'bn' ? 'অনুগ্রহ করে স্ক্রিনশট আপলোড করুন' : 'Please upload screenshot');
      return;
    }
    if (trxType === 'cashIn' && last4Digits.length !== 4) {
      showToastMsg(lang === 'bn' ? 'অনুগ্রহ করে লাস্ট ৪ ডিজিট প্রদান করুন' : 'Please provide last 4 digits');
      return;
    }

    const newBooking = {
      id: 'bk_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      serviceType: selectedService.name,
      code: 'LIVE-SHOW',
      profileName: selectedService.name,
      duration: selectedService.duration,
      totalRate: selectedService.price,
      advancePaid: selectedService.price,
      dueBalance: 0,
      paymentMethod,
      trxType,
      trxScreenshot,
      last4Digits,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setBookings([newBooking, ...bookings]);
    setShowCheckout(false);
    showToastMsg(lang === 'bn' ? 'পেমেন্ট গ্রহন হয়েছে, কনফার্মেশন এর জন্য অপেক্ষা করুন।' : 'Payment received. Waiting for confirmation.');
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto py-4">
        <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-2" />
        <h2 className="text-2xl font-black text-white">{t.liveShow} Packages</h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'bn' ? '১০০% অনলাইন পেমেন্টের মাধ্যমে আপনার মেম্বারশিপ প্যাকেজ সাবস্ক্রাইব করুন।' : 'Subscribe to your live show package via 100% online payment.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {liveServices.map(srv => (
          <div key={srv.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl">
            <div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {srv.duration}
              </span>
              <h3 className="text-xl font-black text-white mt-4">{srv.name}</h3>
              <p className="text-3xl font-extrabold text-amber-400 mt-4">{srv.price} <span className="text-xs text-slate-400">BDT</span></p>
            </div>

            <button 
              onClick={() => { setSelectedService(srv); setShowCheckout(true); }}
              className="mt-6 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      {showCheckout && selectedService && (
        <CheckoutModal 
          selectedCollection={{ name: selectedService.name, code: 'LIVE' }}
          serviceType="Live Show Package"
          selectedDuration={selectedService.duration}
          setSelectedDuration={() => {}}
          durationOptions={[selectedService.duration]}
          totalRate={selectedService.price}
          advanceAmount={selectedService.price}
          dueAmount={0}
          settings={settings}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          trxType={trxType}
          setTrxType={setTrxType}
          trxScreenshot={trxScreenshot}
          setTrxScreenshot={setTrxScreenshot}
          last4Digits={last4Digits}
          setLast4Digits={setLast4Digits}
          handleBookingSubmit={handleBookingSubmit}
          onClose={() => setShowCheckout(false)}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

// ==========================================
// COMMON CHECKOUT MODAL COMPONENT
// ==========================================
function CheckoutModal({
  selectedCollection, serviceType, selectedDuration, setSelectedDuration,
  durationOptions, totalRate, advanceAmount, dueAmount, settings,
  paymentMethod, setPaymentMethod, trxType, setTrxType, trxScreenshot,
  setTrxScreenshot, last4Digits, setLast4Digits, handleBookingSubmit, onClose, t, lang
}) {
  const [copied, setCopied] = useState(false);

  const activeNumber = settings[paymentMethod] || '01847257668';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activeNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTrxScreenshot(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl my-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>

        <h3 className="font-bold text-lg text-amber-400 mb-1">{serviceType} - Checkout</h3>
        <p className="text-xs text-slate-400 mb-4">Code: {selectedCollection.code} | {selectedCollection.name}</p>

        {/* Pricing Summary Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 mb-4">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{t.duration}:</span>
            <span className="font-bold text-white">{selectedDuration}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{t.totalPrice}:</span>
            <span className="font-bold text-amber-400">{totalRate} BDT</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="text-amber-400 font-bold">{t.advancePay}:</span>
            <span className="font-black text-amber-400 text-sm">{advanceAmount} BDT</span>
          </div>
          {dueAmount > 0 && (
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t.duePay}:</span>
              <span className="font-bold text-emerald-400">{dueAmount} BDT</span>
            </div>
          )}
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">পেমেন্ট মেথড সিলেক্ট করুন</label>
            <div className="grid grid-cols-3 gap-2">
              {['bkash', 'nagad', 'rocket'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-3 rounded-xl font-extrabold text-xs capitalize border transition-all ${
                    paymentMethod === m 
                      ? 'bg-amber-500 text-slate-950 border-amber-500' 
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Number Display with Copy Button */}
          <div className="bg-slate-950 border border-amber-500/30 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{paymentMethod} Cashier Number</p>
              <p className="text-base font-black text-amber-400">{activeNumber}</p>
            </div>
            <button
              type="button"
              onClick={handleCopyNumber}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.copy}</span>
            </button>
          </div>

          {/* Payment Instructions Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.paymentNotice}</span>
            </p>
            <p className="text-[11px] text-slate-300">
              বরাবর <strong className="text-amber-400">{advanceAmount} BDT</strong> সেন্ড মানি অথবা ক্যাশ ইন করুন।
            </p>
          </div>

          {/* Transaction Type Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">{t.trxType}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTrxType('sendMoney')}
                className={`py-2 text-xs font-bold rounded-xl border ${
                  trxType === 'sendMoney' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {t.sendMoney}
              </button>
              <button
                type="button"
                onClick={() => setTrxType('cashIn')}
                className={`py-2 text-xs font-bold rounded-xl border ${
                  trxType === 'cashIn' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {t.cashIn}
              </button>
            </div>
          </div>

          {/* File Upload OR Last 4 Digits Input */}
          {trxType === 'sendMoney' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{t.uploadScreenshot}</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400"
              />
              {trxScreenshot && (
                <div className="mt-2 h-20 w-20 rounded-lg overflow-hidden border border-amber-500/40">
                  <img src={trxScreenshot} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{t.last4Digits}</label>
              <input 
                type="text" 
                maxLength={4}
                value={last4Digits}
                onChange={e => setLast4Digits(e.target.value)}
                placeholder="e.g. 4821"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all text-sm"
          >
            {t.confirmBooking}
          </button>

          <p className="text-[11px] text-slate-500 text-center">
            {t.cancelNotice}
          </p>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. CLIENT BOOKING HISTORY COMPONENT
// ==========================================
function ClientBookingHistory({ currentUser, bookings, t, lang }) {
  const myBookings = bookings.filter(b => b.userId === currentUser.id);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        <span>{t.myBookings} ({myBookings.length})</span>
      </h2>

      {myBookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
          আপনার কোনো বুকিং রেকর্ড পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map(bk => (
            <div key={bk.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-base">{bk.serviceType} - Code: {bk.code}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    bk.status === 'Approved' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : bk.status === 'Rejected' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {bk.status === 'Approved' ? t.statusApproved : bk.status === 'Rejected' ? t.statusRejected : t.statusPending}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-0.5">
                  <p>Profile: {bk.profileName} | Duration: {bk.duration}</p>
                  {bk.mainArea && <p>Location: {bk.mainArea} ({bk.subArea}) - Place: {bk.placeType}</p>}
                  <p>Date: {bk.date || 'Today'}</p>
                  <p className="text-amber-400">Advance Paid: {bk.advancePaid} BDT | Hand Cash Due: {bk.dueBalance} BDT</p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500 shrink-0">
                <p>Booking ID: {bk.id}</p>
                <p>{new Date(bk.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. ADMIN DASHBOARD COMPONENT
// ==========================================
function AdminDashboard({ 
  users, setUsers, collections, setCollections, locations, setLocations, 
  bookings, setBookings, services, setServices, settings, setSettings, t, lang, showToastMsg 
}) {
  const [adminTab, setAdminTab] = useState('bookings'); // bookings, clients, collections, locations, settings

  // New Collection Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Medium');
  const [newPhotos, setNewPhotos] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isAvailableVideo, setIsAvailableVideo] = useState(true);

  const handleAddCollection = (e) => {
    e.preventDefault();
    if (!newCode || !newName) {
      showToastMsg('Code and Name are required!');
      return;
    }

    if (collections.length >= 500) {
      showToastMsg('Maximum 500 profile capacity reached!');
      return;
    }

    const newCol = {
      id: 'col_' + Date.now(),
      code: newCode,
      name: newName,
      category: newCategory,
      photos: newPhotos,
      videoUrl: newVideoUrl,
      isAvailableTodayVideo: isAvailableVideo
    };

    setCollections([newCol, ...collections]);
    setNewCode('');
    setNewName('');
    setNewPhotos([]);
    setNewVideoUrl('');
    showToastMsg('New collection added successfully!');
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newPhotos.length > 5) {
      showToastMsg('Maximum 5 photos allowed per collection!');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleUserBan = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
    showToastMsg('User status updated');
  };

  const handleApproveBooking = (bkId) => {
    setBookings(bookings.map(b => b.id === bkId ? { ...b, status: 'Approved' } : b));
    showToastMsg('Booking Approved');
  };

  const handleRejectBooking = (bkId) => {
    // Delete/Remove booking from both admin and client records
    setBookings(bookings.filter(b => b.id !== bkId));
    showToastMsg('Fake/Invalid Booking Cancelled & Deleted');
  };

  const handleDeleteCollection = (id) => {
    setCollections(collections.filter(c => c.id !== id));
    showToastMsg('Collection deleted');
  };

  const toggleVideoAvailability = (id) => {
    setCollections(collections.map(c => c.id === id ? { ...c, isAvailableTodayVideo: !c.isAvailableTodayVideo } : c));
    showToastMsg('Video availability toggled');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-emerald-500/30 p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-emerald-400 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            <span>{t.adminDashboard}</span>
          </h2>
          <p className="text-xs text-slate-400">Strict Credentials Access Granted | Zero Leakage Mode Active</p>
        </div>

        {/* ADMIN INTERNAL NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <button 
            onClick={() => setAdminTab('bookings')}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${adminTab === 'bookings' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
          >
            Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setAdminTab('clients')}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${adminTab === 'clients' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
          >
            Clients ({users.length})
          </button>
          <button 
            onClick={() => setAdminTab('collections')}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${adminTab === 'collections' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
          >
            Collections ({collections.length})
          </button>
          <button 
            onClick={() => setAdminTab('settings')}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${adminTab === 'settings' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* 1. ADMIN BOOKINGS MANAGER */}
      {adminTab === 'bookings' && (
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-300">Client Booking Requests</h3>
          {bookings.length === 0 ? (
            <div className="bg-slate-900 p-8 text-center text-slate-500 rounded-2xl">No booking requests.</div>
          ) : (
            bookings.map(bk => (
              <div key={bk.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{bk.serviceType} - Code: {bk.code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      bk.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {bk.status}
                    </span>
                  </div>
                  <p className="text-xs text-amber-300 font-semibold">Client: {bk.userName} ({bk.userPhone})</p>
                  <p className="text-xs text-slate-400">Advance: {bk.advancePaid} BDT | Due: {bk.dueBalance} BDT</p>
                  <p className="text-xs text-slate-400">Method: {bk.paymentMethod.toUpperCase()} ({bk.trxType})</p>
                  
                  {bk.trxType === 'sendMoney' && bk.trxScreenshot && (
                    <div className="mt-2 h-20 w-20 rounded-lg overflow-hidden border border-slate-700">
                      <img src={bk.trxScreenshot} alt="trx" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {bk.trxType === 'cashIn' && (
                    <p className="text-xs text-amber-400 font-bold">Last 4 Digits: {bk.last4Digits}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {bk.status !== 'Approved' && (
                    <button 
                      onClick={() => handleApproveBooking(bk.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      {t.approve}
                    </button>
                  )}
                  <button 
                    onClick={() => handleRejectBooking(bk.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Cancel & Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. ADMIN CLIENT USER CREDENTIALS LOOKUP */}
      {adminTab === 'clients' && (
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-300">Registered Client Users Credentials</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Password</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3 text-amber-400 font-mono">{u.phone}</td>
                    <td className="p-3 text-emerald-400 font-mono">{u.password}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {u.isBanned ? t.banned : 'Active'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => toggleUserBan(u.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-[10px] ${u.isBanned ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                      >
                        {u.isBanned ? t.unbanUser : t.banUser}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ADMIN COLLECTION MANAGER */}
      {adminTab === 'collections' && (
        <div className="space-y-6">
          {/* Add Collection Form */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-md font-bold text-amber-400">{t.addCollection} (Max 500 Capacity)</h3>
            
            <form onSubmit={handleAddCollection} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.code}</label>
                <input 
                  type="text" 
                  required
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="e.g. 08, 115, 308"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.name}</label>
                <input 
                  type="text" 
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Salma Begum"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select 
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="Medium">Medium Category</option>
                  <option value="Premium">Premium Category</option>
                  <option value="New Special Collection">New Special Collection</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs text-slate-400 mb-1">{t.photosMax5}</label>
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950"
                />
              </div>

              <div className="sm:col-span-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input 
                    type="checkbox" 
                    checked={isAvailableVideo}
                    onChange={e => setIsAvailableVideo(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>{t.availableVideoToday}</span>
                </label>

                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg"
                >
                  Save Collection Profile
                </button>
              </div>
            </form>
          </div>

          {/* Collection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {collections.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-amber-400 text-sm">CODE: {c.code}</span>
                    <button 
                      onClick={() => toggleVideoAvailability(c.id)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        c.isAvailableTodayVideo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {c.isAvailableTodayVideo ? 'Video ON' : 'Video OFF'}
                    </button>
                  </div>
                  <p className="font-bold text-white text-sm">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.category}</p>
                </div>

                <button 
                  onClick={() => handleDeleteCollection(c.id)}
                  className="mt-4 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-1.5 rounded-lg text-xs font-bold transition-all"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ADMIN CASHIER SETTINGS */}
      {adminTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl max-w-md space-y-4">
          <h3 className="text-md font-bold text-amber-400">Cashier Numbers Settings</h3>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">bKash Cashier Number</label>
            <input 
              type="text" 
              value={settings.bkash}
              onChange={e => setSettings({ ...settings, bkash: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Nagad Cashier Number</label>
            <input 
              type="text" 
              value={settings.nagad}
              onChange={e => setSettings({ ...settings, nagad: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Rocket Cashier Number</label>
            <input 
              type="text" 
              value={settings.rocket}
              onChange={e => setSettings({ ...settings, rocket: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button 
            onClick={() => showToastMsg('Cashier settings updated')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg"
          >
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
}