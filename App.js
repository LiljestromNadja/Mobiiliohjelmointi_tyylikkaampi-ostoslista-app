import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View, Keyboard, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, update, remove } from 'firebase/database';
import { useEffect, useState } from 'react';

//Tyylikkäämpi ostoslista - React Native Elements -komponentit
import { Header } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import { Input, Button, Stack } from '@rneui/themed';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "ostoslista-firebase-app.firebaseapp.com",
  projectId: "ostoslista-firebase-app",
  storageBucket: "ostoslista-firebase-app.appspot.com",
  messagingSenderId: "",
  appId: ""
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Luodaan tietokantakahva
const database = getDatabase(app);


export default function App() {


  const [amount, setAmount] = useState('');
  const [product, setProduct]  =useState('');
  const [items, setItems] = useState([]);

  


  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    setItems(Object.values(data));
    console.log('LOG, data:  ',data);
    console.log('LOG, Object.values:  ',Object.values(data));
    })
    }, []);


  
    const saveItem = () => {
      if (product == undefined || amount == undefined) {
        Alert.alert("Please fill both fields");

      } else {
        
        const newRef = push(ref(database, "items/"));
        const newKey = newRef.key;
        const newItem = {
          product: product,
          amount: amount,
          id: newKey,
        }; //HUOM CONSOLE LOGEISSA PILKUN JA PLUSSAN ERO! 
        update(ref(database, "items/" + newKey), newItem);
        console.log('Added item: ', newItem);
        console.log('Added item, key:', newItem.id);
        setProduct();
        setAmount();
        Keyboard.dismiss();
        
      }
    };
  
    const deleteItem = (id) => {
      remove(ref(database, "items/" + id));
      console.log('Deleted item, id: ', id);
    };
    
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };




  return (
    
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { marginTop: 10, color: '#fff' } }}
      />      
      <View style={styles.container}>      
      <FlatList 
        style={{marginTop: 20, marginLeft : "5%"}}
        keyExtractor={item => item.id} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}> {item.amount} {item.product} </Text>
        <Icon size={10} reverse color="lightblue" type="material" name="check" onPress={() => deleteItem(item.id)}> </Icon></View>} 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      /> 
      
      <View>
      <Input 
        style={styles.input}
        label = ''
        placeholder='Amount'  
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/> 
      <Input
        style={styles.input}
        label = ''
        placeholder='Product'  
        onChangeText={(product) => setProduct(product)}
        value={product}/>  

       <View style={styles.button}>
       <Button  color={'primary'} onPress={saveItem} title="SAVE"/>
       </View>

       </View>
      <StatusBar style="auto" />   
    </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
   input: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center', 

    
   }, 
   button: {
    alignContent:'center', 
    margin: 20,
    marginLeft: 50, 
    marginRight: 50
   }
});




/**
 *      <TextInput placeholder='Amount' keyboardType="numeric" style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>    
 */