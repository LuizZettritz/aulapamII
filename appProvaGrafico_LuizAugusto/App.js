import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Barras from './src/Barras';
import Setores from './src/Setores';
import {Ionicons} from '@expo/vector-icons';

const Tab= createBottomTabNavigator();

function Tabs(){
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        //aqui define os ícones que irão aparecer nas Tabs

        if (route.name === 'Barras') {
          iconName = focused
            ? 'ice-cream-outline'
            : 'ice-cream-outline';
        }else if (route.name === 'Setores') {
          iconName = focused ? 'hardware-chip-outline' : 'hardware-chip-outline';
        }        

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#3f64c7',
      inactiveTintColor: 'gray',      
    }}    
    >  
      <Tab.Screen name= "Barras" component={Barras}></Tab.Screen>
      <Tab.Screen name= "Setores" component={Setores}></Tab.Screen>
   
    </Tab.Navigator>
  );
}

export default function App() {

const Stack= createStackNavigator();
  return (
  <NavigationContainer>
    <Stack.Navigator>
     
    <Stack.Screen 
          name="Barras" 
          component={Tabs}
          options={{headerShown: false}}
          >

      </Stack.Screen>

    <Stack.Screen name="Setores" component={Setores} options={{headerShown: false}}></Stack.Screen>
    


    </Stack.Navigator>
  </NavigationContainer>
  );
}

