import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import ListItem from '../components/ListItem';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';
import userService from '../services/userService';
import orderService from '../services/orderService';
import sessionService from '../services/sessionService';
import authService from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

const Profile = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // USE LANGUAGE CONTEXT
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  
  const [userData, setUserData] = useState({
    name: 'Ronrur Banahr',
    email: 'ronrur@example.com',
    userId: 'HVØ0033000092',
    phone: '+1 234 567 890',
    deliveriesCompleted: 156,
    activeOrders: 3,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await userService.getProfile();
      if (profile) {
        setUserData(prev => ({ ...prev, ...profile }));
      }
      
      // Load order stats
      const orders = await orderService.getOrders();
      setUserData(prev => ({
        ...prev,
        deliveriesCompleted: orders.length,
        activeOrders: orders.filter(o => o.status === 'active').length,
      }));
    } catch (error) {
      console.log('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation.navigate('Dashboard');
    } else if (tab === 'settings') {
      navigation.navigate('Settings');
    }
  };

  const handleEditProfile = async () => {
    Alert.alert('Edit Profile', 'Profile editing would open here');
  };

  const handleUpdateProfile = async (newData) => {
    try {
      const result = await userService.updateProfile(newData);
      if (result.success) {
        setUserData(prev => ({ ...prev, ...newData }));
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleMyOrders = async () => {
    try {
      const orders = await orderService.getOrders();
      Alert.alert('My Orders', `You have ${orders.length} orders`);
    } catch (error) {
      Alert.alert('Error', 'Failed to load orders');
    }
  };

  const handleAddressBook = async () => {
    try {
      const addresses = await userService.getAddress();
      Alert.alert('Address Book', `You have ${addresses.length} addresses`);
    } catch (error) {
      Alert.alert('Error', 'Failed to load addresses');
    }
  };

  const handlePaymentMethods = () => {
    Alert.alert('Payment Methods', 'Payment methods would open here');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              await sessionService.clearSession();
            } catch (e) {
              // Continue with local logout even if API fails
            }
            navigation.replace('Login');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Profile" />
      
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <Card heavy style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar name={userData.name} size="large" />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userId}>{userData.userId}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>
          </View>
          
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            size="small"
            style={styles.editButton}
          />
        </Card>

        {/* Statistics */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>STATISTICS</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.deliveriesCompleted}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.activeOrders}</Text>
              <Text style={styles.statLabel}>Active Orders</Text>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          
          <ListItem
            label="My Orders"
            value="View all"
            onPress={handleMyOrders}
          />
          
          <ListItem
            label="Address Book"
            value="5 addresses"
            onPress={handleAddressBook}
          />
          
          <ListItem
            label="Payment Methods"
            value="2 cards"
            onPress={handlePaymentMethods}
          />
        </Card>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="primary"
          style={styles.logoutButton}
        />
      </ScrollView>

      <Footer activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
  },
  profileCard: {
    marginBottom: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  userId: {
    fontSize: 14,
    fontFamily: fonts.mono,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.borderLight,
  },
  menuCard: {
    marginBottom: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
});

export default Profile;
