/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import SignupScreen from './screens/Auth/SignupScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import HomeScreen from './screens/Home/HomeScreen';
import ChatScreen from './screens/Chat/ChatScreen';

import firestore from '@react-native-firebase/firestore'

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3dad89',
  },
};


const Stack = createNativeStackNavigator();

const Navigation = ()=>{
  const [user,setuser] = useState('');
  console.log(user);
  useEffect(()=>{
   const unregister =  auth().onAuthStateChanged(userExist=>{
      if(userExist){
       
        firestore().collection('users')
        .doc(userExist.uid)
        .update({
          status:"online"
        })
        setuser(userExist)


      } 
 
      else setuser("")
    })

    return ()=>{
      unregister()
    }

  },[])
  return (
    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{
         headerTintColor:"#3dad89"
       }}
      
      >
         {user?
         <>
           <Stack.Screen name="home" options={{
          headerRight:()=><MaterialIcons
          name="logout"
          size={34}
          color="red"
          style={{marginRight:10}}
          onPress={()=>{
            firestore().collection('users')
            .doc(user.uid)
            .update({
              status:firestore.FieldValue.serverTimestamp()
            }).then(()=>{
                 auth().signOut()
            })
           
         
          }}
          />,
          title:"One to One Chat"
        }}> 
            {props => <HomeScreen {...props}  user={user} />}
           </Stack.Screen>
             <Stack.Screen name="chat" >
             {props => <ChatScreen {...props} user={user} /> }
           </Stack.Screen>
           </>
       :
        <>
        <Stack.Screen name="login" component={LoginScreen} options={{headerShown:false}}/>

        <Stack.Screen name="signup" component={SignupScreen} options={{headerShown:false}}/>
        
        </>
    }
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const App = () => {
  return (
    <>
      <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="#30d9a3" />
       <View style={styles.container}>
         {/* <Navigation /> */}
         <Navigation />
       </View>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"white"
  }
});
export default App;
