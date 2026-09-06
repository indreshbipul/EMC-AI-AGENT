import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Toggle from '../components/Toggle';
import ListItem from '../components/ListItem';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { colors, spacing, borderRadius, fonts } from '../styles/variables';
import authService from '../services/authService';
import sessionService from '../services/sessionService';

// ============================================================
// IMPORT LANGUAGE CONTEXT (Separate)
// ============================================================
import { useLanguage } from '../contexts/LanguageContext';

const Settings = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState({
    notifications: true,
  });
  
  // Language modal visibility
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // ============================================================
  // USE LANGUAGE CONTEXT
  // ============================================================
  const { language, setLanguage, t, availableLanguages } = useLanguage();

  // Get current language display name
  const currentLang = availableLanguages.find(l => l.code === language);
  const currentLangName = currentLang ? currentLang.nativeName : 'English';

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation.navigate('Dashboard');
    } else if (tab === 'profile') {
      navigation.navigate('Profile');
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      console.log('Settings updated:', newSettings);
      return newSettings;
    });
  };

  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  const selectLanguage = (langCode) => {
    setLanguage(langCode);
    setShowLanguageModal(false);
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

  const appVersion = '1.0.0';
  const buildNumber = '2025.01.15';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={t('settings')} />
      
      <ScrollView contentContainerStyle={styles.container}>
        {/* Notifications */}
        <Card heavy style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications').toUpperCase()}</Text>
          
          <Toggle
            label={t('pushNotifications')}
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
          />
          
          <Toggle
            label={t('emailUpdates')}
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
          />
        </Card>

        {/* Preferences */}
        <Card heavy style={styles.section}>
          <Text style={styles.sectionTitle}>{t('preferences').toUpperCase()}</Text>
          
          {/* Language Option */}
          <TouchableOpacity 
            style={styles.languageRow}
            onPress={handleLanguagePress}
          >
            <View>
              <Text style={styles.languageLabel}>{t('language')}</Text>
              <Text style={styles.languageValue}>{currentLangName}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* Support */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          
          <ListItem
            label={t('privacyPolicy')}
            onPress={() => Alert.alert(t('privacyPolicy'), 'Privacy policy would open here')}
          />
          
          <ListItem
            label={t('helpSupport')}
            onPress={() => Alert.alert(t('helpSupport'), 'Help & support would open here')}
          />
          
          <ListItem
            label={t('aboutUs')}
            onPress={() => Alert.alert(t('aboutUs'), 'MoveQ Logistics Platform\nVersion 1.0.0')}
          />
        </Card>

        {/* App Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>APP INFO</Text>
          
          <ListItem
            label={t('version')}
            value={appVersion}
            isMono
            showArrow={false}
          />
          
          <ListItem
            label={t('build')}
            value={buildNumber}
            isMono
            showArrow={false}
          />
        </Card>

        {/* Logout Button */}
        <Button
          title={t('logout')}
          onPress={handleLogout}
          variant="primary"
          style={styles.logoutButton}
        />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            
            <TouchableOpacity 
              style={[styles.languageOption, language === 'en' && styles.languageOptionSelected]}
              onPress={() => selectLanguage('en')}
            >
              <Text style={[styles.languageOptionText, language === 'en' && styles.languageOptionTextSelected]}>
                English
              </Text>
              {language === 'en' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.languageOption, language === 'hi' && styles.languageOptionSelected]}
              onPress={() => selectLanguage('hi')}
            >
              <Text style={[styles.languageOptionText, language === 'hi' && styles.languageOptionTextSelected]}>
                हिंदी (Hindi)
              </Text>
              {language === 'hi' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.languageOption, language === 'bn' && styles.languageOptionSelected]}
              onPress={() => selectLanguage('bn')}
            >
              <Text style={[styles.languageOptionText, language === 'bn' && styles.languageOptionTextSelected]}>
                বাংলা (Bengali)
              </Text>
              {language === 'bn' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

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
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  
  // Language Row Styles
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  languageLabel: {
    fontSize: 15,
    color: colors.text,
  },
  languageValue: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: colors.textLight,
    fontWeight: '300',
  },

  logoutButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  languageOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  languageOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  languageOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textLight,
  },
});

export default Settings;
