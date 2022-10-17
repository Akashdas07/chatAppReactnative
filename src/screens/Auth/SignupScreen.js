import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import {v4 as uuid4} from 'uuid';

export default SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const userSignup = async () => {
    setLoading(true);
    if (!email || !password || !image || !name) {
      alert('All field are required');
      //   ToastAndroid.show("All field are required", ToastAndroid.SHORT);
      setLoading(false);
      return;
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      firestore().collection('users').doc(result.user.uid).set({
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        pic: image,
        status: 'online',
      });
      setLoading(false);
      ToastAndroid.show('Signup Successfully', ToastAndroid.SHORT);
      setEmail('');
      setName('');
      password('');
      image('');
      navigation.navigate('login');
    } catch (err) {
      // alert("something went wrong");
      setLoading(false);
    }
  };

  const pickImageAndUpload = () => {
    launchImageLibrary({quality: 0.5}, fileobj => {
      console.log(fileobj);
      const uploadTask = storage()
        .ref()
        .child(`/userprofile/${Date.now()}`)
        .putFile(fileobj.assets[0].uri);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) alert('image uploaded');
        },
        error => {
          // alert("error uploading image")
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setImage(downloadURL);
          });
        },
      );
    });
  };

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
  else
    return (
      <ScrollView>
        <View style={{backgroundColor: '#fff', height: '100%'}}>
          <View style={styles.box1}>
            <Text style={styles.text}>One to One ChatApp</Text>
            <Image
              style={styles.img}
              source={require('../../assets/chat.png')}
            />
          </View>
          <View style={styles.box2}>
            <>
              <Text style={{fontSize: 20, alignSelf: 'center'}}>Signup</Text>
              <TextInput
                label="Name"
                style={styles.inputPaper}
                value={name}
                onChangeText={text => setName(text)}
                mode="outlined"
                theme={{
                  roundness: 10,
                }}
              />
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
                style={styles.uploadProfile}
                mode="contained"
                onPress={() => pickImageAndUpload()}>
                {image ? 'Uploaded successfully' : 'Upload profile pic'}
              </Button>

              <Button
                style={styles.SubmitButton}
                mode="contained"
                onPress={() => userSignup()}>
                Signup
              </Button>
            </>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={{textAlign: 'center', marginVertical: 15}}>
              Already have an account ? Login
            </Text>
          </TouchableOpacity>
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
  uploadProfile: {
    marginVertical: 13,
    borderRadius: 10,
  },
  SubmitButton: {
    padding: 5,
    marginTop: 20,
    borderRadius: 30,
    fontSize: 25,
  },
});
