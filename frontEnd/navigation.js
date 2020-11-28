import React from 'react';
import {createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import MapScreen from './screens/MapScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

var BottomNavigator = createBottomTabNavigator({
   Map: MapScreen,
   Chat: ChatScreen
},
//la customistation:
{
    defaultNavigationOptions : ({ navigation }) => ({
      tabBarIcon: ({ color, focused }) => {
        var iconName;
        if (navigation.state.routeName == 'Map') {
          
         iconName ="ios-navigate" ;
         focused ? color= '#eb4d4b' : color= 'white'
        } else if (navigation.state.routeName == 'Chat') {

         iconName = "ios-chatboxes";
         
          focused ? color= '#eb4d4b' : color= 'white'
          

        }
        return <Ionicons name={iconName} size={24} color={color} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#eb4d4b',
      inactiveTintColor: 'white',
      style: {
        backgroundColor: '#130f40',
    },
    },
});
  

var StackNavigator = createStackNavigator({
    Home: HomeScreen,
    Menu: BottomNavigator
},
{
    headerMode: 'none'
  }
);

export default Navigation = createAppContainer(StackNavigator)