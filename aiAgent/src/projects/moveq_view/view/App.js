import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// ============================================================
// IMPORT PAGE COMPONENTS
// ============================================================
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import Dashboard from './src/pages/Dashboard';
import ShipmentForm from './src/pages/ShipmentForm';
import ShipmentForm2 from './src/pages/ShipmentForm2';
import ShipmentForm3 from './src/pages/ShipmentForm3';
import ShipmentForm4 from './src/pages/ShipmentForm4';
import OrderConfirmation from './src/pages/OrderConfirmation';
import Profile from './src/pages/Profile';
import Settings from './src/pages/Settings';
import Loader from './src/components/Loader.jsx';
import MyOrders from './src/pages/MyOrders.jsx';
import TrackOrder from './src/pages/TrackOrder.jsx'

// ============================================================
// IMPORT LANGUAGE CONTEXT (Separate - No Code Structure Change)
// ============================================================
import { LanguageProvider } from './src/contexts/LanguageContext';

const Stack = createNativeStackNavigator();

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  return (
    // ============================================================
    // WRAP WITH LANGUAGE PROVIDER (Only this - no other changes)
    // ============================================================
    <LanguageProvider>
      
      <NavigationContainer>
        <StatusBar style="dark" />
        
        <Stack.Navigator 
          initialRouteName="Dashboard"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {/* Auth Screens */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          
          {/* Main Screens */}
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ShipmentForm" component={ShipmentForm} />
          <Stack.Screen name="ShipmentForm2" component={ShipmentForm2} />
          <Stack.Screen name="ShipmentForm3" component={ShipmentForm3} />
          <Stack.Screen name="ShipmentForm4" component={ShipmentForm4} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="MyOrder" component={MyOrders} />
          <Stack.Screen name="TrackOrder" component={TrackOrder} />
          
          {/* Other Screens */}
          <Stack.Screen name="gs" component={Loader} />
        </Stack.Navigator>
        
      </NavigationContainer>
      
    </LanguageProvider>
  );
}
