import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const userLogin = async ()=>{
    setLoading(true)
    if(!email || !password){
           alert("All field are required.");
           setLoading(false);
           return; 
    }
    try{
      const result =  await auth().signInWithEmailAndPassword(email,password)
      console.log(result);
        setLoading(false)
    }catch(err){
        alert("something went wrong");
        setLoading(false);
    }
    }

if (loading)
  return (
    <ActivityIndicator
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      size="large"
      color="#2144C1"
    />
  );
  return (
    <ScrollView>
        <View style={{backgroundColor:'#fff', height:'100%'}}>
      <View style={styles.box1}>
        <Text style={styles.text}>One to One ChatApp</Text>
        <Image style={styles.img} source={require('../../assets/chat.png')} />
      </View>
      <View style={styles.box2}>
        <>
        <Text style={{fontSize:20, alignSelf:'center'}}>Login</Text>
          <TextInput
            label="Email"
            style={styles.inputPaper}
            value={email}
            onChangeText={text => setEmail(text)}
            mode="outlined"
            theme={{
              roundness: 10,
            }}
          />
          <TextInput
            style={styles.inputPaper}
            label="password"
            mode="outlined"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            theme={{
                roundness: 10,
              }}
          />


          <Button
          style={styles.SubmitButton}
            mode="contained"
            // disabled={image ? false : true}
            onPress={() => userLogin()}>
            Login
          </Button>
        </>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('signup')}><Text style={{textAlign:"center", marginVertical:15}}>Don't have an account ? Signup</Text></TouchableOpacity>
      </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: 'green',
    margin: 10,
  },
  img: {
    width: 200,
    height: 200,
  },
  box1: {
    alignItems: 'center',
  },
  box2: {
    paddingHorizontal: 40,
    justifyContent: 'space-evenly',
    // height: '40%',
  },
  inputPaper: {
    marginTop: 13,
    backgroundColor: '#fff',
  },
  uploadProfile:{
    marginVertical: 13,
    borderRadius:10
  },
  SubmitButton:{
    padding:5,
    marginTop:20,
    borderRadius:30,
    fontSize:25
  }
});
