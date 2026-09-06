import React, { createContext, useContext, useState } from 'react';

// ============================================================
// TRANSLATIONS - English, Hindi, Bengali
// ============================================================
const translations = {
  en: {
    // App
    appName: 'MoveQ',
    
    // Navigation
    home: 'Home',
    profile: 'Profile',
    settings: 'Settings',
    myOrders: 'My Orders',
    
    // Dashboard
    sendPackage: 'Send a Package',
    quickReliable: 'Quick & reliable delivery',
    send: 'Send',
    quickActions: 'Quick Actions',
    newShipment: 'New Shipment',
    trackOrder: 'Track Order',
    history: 'History',
    trackYourOrder: 'Track Your Order',
    
    // Promo Slider
    bestPriceDelivery: 'Best Price Delivery',
    fastReliable: 'Fast & Reliable',
    saveMoney: 'Save Money',
    safeSecure: 'Safe & Secure',
    
    // Orders
    noOrders: 'No Orders Found',
    noOrdersSubtitle: "You haven't placed any orders yet",
    createNewOrder: 'Create New Order',
    orderId: 'Order ID',
    from: 'From',
    to: 'To',
    date: 'Date',
    track: 'Track',
    orderDetails: 'Order Details',
    all: 'All',
    pending: 'Pending',
    inTransit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Settings Page
    notifications: 'Notifications',
    preferences: 'Preferences',
    darkMode: 'Dark Mode',
    language: 'Language',
    privacyPolicy: 'Privacy Policy',
    helpSupport: 'Help & Support',
    aboutUs: 'About Us',
    version: 'Version',
    build: 'Build',
    logout: 'Logout',
    pushNotifications: 'Push Notifications',
    emailUpdates: 'Email Updates',
    
    // Profile
    editProfile: 'Edit Profile',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    saveChanges: 'Save Changes',
    
    // Shipment
    senderDetails: 'Sender Details',
    receiverDetails: 'Receiver Details',
    packageDetails: 'Package Details',
    selectPackageType: 'Select Package Type',
    weight: 'Weight (kg)',
    dimensions: 'Dimensions',
    description: 'Description',
    deliveryType: 'Delivery Type',
    standard: 'Standard',
    express: 'Express',
    calculatePrice: 'Calculate Price',
    totalAmount: 'Total Amount',
    placeOrder: 'Place Order',
    
    // Status
    processing: 'Processing',
    orderPlaced: 'Order Placed',
    pickedUp: 'Picked Up',
    outForDelivery: 'Out for Delivery',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    search: 'Search',
    close: 'Close',
    error: 'Error',
    success: 'Success',
  },
  
  hi: {
    // App
    appName: 'MoveQ',
    
    // Navigation
    home: 'होम',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    myOrders: 'मेरे ऑर्डर',
    
    // Dashboard
    sendPackage: 'पैकेज भेजें',
    quickReliable: 'त्वरित और विश्वसनीय डिलीवरी',
    send: 'भेजें',
    quickActions: 'त्वरित कार्य',
    newShipment: 'नई शिपमेंट',
    trackOrder: 'ऑर्डर ट्रैक करें',
    history: 'इतिहास',
    trackYourOrder: 'अपना ऑर्डर ट्रैक करें',
    
    // Promo Slider
    bestPriceDelivery: 'सर्वोत्तम मूल्य डिलीवरी',
    fastReliable: 'तेज और विश्वसनीय',
    saveMoney: 'पैसे बचाएं',
    safeSecure: 'सुरक्षित और सुरक्षित',
    
    // Orders
    noOrders: 'कोई ऑर्डर नहीं मिला',
    noOrdersSubtitle: 'आपने अभी तक कोई ऑर्डर नहीं दिया है',
    createNewOrder: 'नया ऑर्डर बनाएं',
    orderId: 'ऑर्डर आईडी',
    from: 'से',
    to: 'तक',
    date: 'तारीख',
    track: 'ट्रैक करें',
    orderDetails: 'ऑर्डर विवरण',
    all: 'सभी',
    pending: 'लंबित',
    inTransit: 'रास्ते में',
    delivered: 'डिलीवर हो गया',
    cancelled: 'रद्द',
    
    // Settings Page
    notifications: 'सूचनाएं',
    preferences: 'प्राथमिकताएं',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    privacyPolicy: 'गोपनीयता नीति',
    helpSupport: 'सहायता और समर्थन',
    aboutUs: 'हमारे बारे में',
    version: 'संस्करण',
    build: 'बिल्ड',
    logout: 'लॉगआउट',
    pushNotifications: 'पुश नोटिफिकेशन',
    emailUpdates: 'ईमेल अपडेट',
    
    // Profile
    editProfile: 'प्रोफ़ाइल संपादित करें',
    name: 'नाम',
    email: 'ईमेल',
    phone: 'फ़ोन',
    address: 'पता',
    saveChanges: 'बदलाव सहेजें',
    
    // Shipment
    senderDetails: 'भेजने वाले का विवरण',
    receiverDetails: 'प्राप्त करने वाले का विवरण',
    packageDetails: 'पैकेज विवरण',
    selectPackageType: 'पैकेज प्रकार चुनें',
    weight: 'वज़न (किग्रा)',
    dimensions: 'आयाम',
    description: 'विवरण',
    deliveryType: 'डिलीवरी प्रकार',
    standard: 'स्टैंडर्ड',
    express: 'एक्सप्रेस',
    calculatePrice: 'मूल्य गणना करें',
    totalAmount: 'कुल राशि',
    placeOrder: 'ऑर्डर दें',
    
    // Status
    processing: 'प्रोसेसिंग',
    orderPlaced: 'ऑर्डर दिया गया',
    pickedUp: 'पिक अप हो गया',
    outForDelivery: 'डिलीवरी के लिए निकला',
    
    // Common
    loading: 'लोड हो रहा है...',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    back: 'वापस',
    next: 'अगला',
    submit: 'जमा करें',
    search: 'खोजें',
    close: 'बंद करें',
    error: 'त्रुटि',
    success: 'सफल',
  },
  
  bn: {
    // App
    appName: 'MoveQ',
    
    // Navigation
    home: 'হোম',
    profile: 'প্রোফাইল',
    settings: 'সেটিংস',
    myOrders: 'আমার অর্ডার',
    
    // Dashboard
    sendPackage: 'প্যাকেজ পাঠান',
    quickReliable: 'দ্রুত এবং নির্ভরযোগ্য ডেলিভারি',
    send: 'পাঠান',
    quickActions: 'দ্রুত কার্যক্রম',
    newShipment: 'নতুন শিপমেন্ট',
    trackOrder: 'অর্ডার ট্র্যাক করুন',
    history: 'ইতিহাস',
    trackYourOrder: 'আপনার অর্ডার ট্র্যাক করুন',
    
    // Promo Slider
    bestPriceDelivery: 'সর্বোত্তম মূল্য ডেলিভারি',
    fastReliable: 'দ্রুত এবং নির্ভরযোগ্য',
    saveMoney: 'টাকা বাঁচুন',
    safeSecure: 'নিরাপদ এবং সুরক্ষিত',
    
    // Orders
    noOrders: 'কোনো অর্ডার পাওয়া যায়নি',
    noOrdersSubtitle: 'আপনি এখনও কোনো অর্ডার দেননি',
    createNewOrder: 'নতুন অর্ডার তৈরি করুন',
    orderId: 'অর্ডার আইডি',
    from: 'থেকে',
    to: 'প্রতি',
    date: 'তারিখ',
    track: 'ট্র্যাক',
    orderDetails: 'অর্ডার বিবরণ',
    all: 'সব',
    pending: 'মুলতুবি',
    inTransit: 'পথে',
    delivered: 'ডেলিভার হয়েছে',
    cancelled: 'বাতিল',
    
    // Settings Page
    notifications: 'বিজ্ঞপ্তি',
    preferences: 'পছন্দ',
    darkMode: 'ডার্ক মোড',
    language: 'ভাষা',
    privacyPolicy: 'গোপনীয়তা নীতি',
    helpSupport: 'সাহায্য এবং সমর্থন',
    aboutUs: 'আমাদের সম্পর্কে',
    version: 'সংস্করণ',
    build: 'বিল্ড',
    logout: 'লগআউট',
    pushNotifications: 'পুশ নোটিফিকেশন',
    emailUpdates: 'ইমেইল আপডেট',
    
    // Profile
    editProfile: 'প্রোফাইল সম্পাদনা',
    name: 'নাম',
    email: 'ইমেইল',
    phone: 'ফোন',
    address: 'ঠিকানা',
    saveChanges: 'পরিবর্তন সংরক্ষণ',
    
    // Shipment
    senderDetails: 'পাঠানোর বিবরণ',
    receiverDetails: 'গ্রহণের বিবরণ',
    packageDetails: 'প্যাকেজ বিবরণ',
    selectPackageType: 'প্যাকেজ প্রকার নির্বাচন',
    weight: 'ওজন (কেজি)',
    dimensions: 'মাত্রা',
    description: 'বিবরণ',
    deliveryType: 'ডেলিভারি প্রকার',
    standard: 'স্ট্যান্ডার্ড',
    express: 'এক্সপ্রেস',
    calculatePrice: 'মূল্য গণনা',
    totalAmount: 'মোট পরিমাণ',
    placeOrder: 'অর্ডার দিন',
    
    // Status
    processing: 'প্রসেসিং',
    orderPlaced: 'অর্ডার দেওয়া হয়েছে',
    pickedUp: 'পিক আপ হয়েছে',
    outForDelivery: 'ডেলিভারির জন্য বের হয়েছে',
    
    // Common
    loading: 'লোড হচ্ছে...',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত করুন',
    delete: 'মুছুন',
    edit: 'সম্পাদনা',
    back: 'ফিরে',
    next: 'পরবর্তী',
    submit: 'জমা দিন',
    search: 'অনুসন্ধান',
    close: 'বন্ধ',
    error: 'ত্রুটি',
    success: 'সফল',
  },
};

// ============================================================
// LANGUAGE CONTEXT
// ============================================================
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en', 'hi', 'bn'
  
  // Translate function - returns translation or key if not found
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  // Change language
  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };
  
  // Get available languages
  const getAvailableLanguages = () => [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  ];
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t,
      availableLanguages: getAvailableLanguages(),
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ============================================================
// HOOK TO USE LANGUAGE
// ============================================================
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
