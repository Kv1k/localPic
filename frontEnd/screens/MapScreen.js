import React, { useState, useEffect } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import socketIOClient from "socket.io-client";
import {connect} from 'react-redux';


var socket = socketIOClient("http://[IP_ADRESS]:3000")



function MapScreen(props) {
  const [regionN, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    
  });
  const [addPOI, setAddPOI]= useState(false);
  const[listPOI, setListPOI]= useState([])

  const [title, setTitle]= useState();
  const [desc, setDesc]= useState();
  const [visible, setVisible] = useState(false);
  const [tempPOI, setTempPOI] = useState();

  const [listUser, setListUser] = useState([]);
  const [mapRegion, setMapRegion] = useState({latitude: 48.866667,
    longitude: 2.333333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,})


 
    useEffect(() => {
      async function askPermissions() {
        var { status } = await Permissions.getAsync(Permissions.LOCATION)
        if (status === 'granted') {
          
          await Location.watchPositionAsync({distanceInterval: 2, accuracy: Location.Accuracy.Highest},
            (location) => {
              setRegion({
                latitude: location.coords.latitude,
                longitude:  location.coords.longitude,
                
              })
              setMapRegion({latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0156,
                longitudeDelta: 0.012,})
              socket.emit("userLocation", { pseudo: props.pseudo, longitude: location.coords.longitude, latitude: location.coords.latitude });

            } 
            
          );
        }
      }
      askPermissions();
      
      
      AsyncStorage.getItem('POI', (err, value) => {
        if (value) {
          var POI = JSON.parse(value);
          setListPOI(POI);
        }
      });
    }, []);
    
 
    useEffect(() => {
      socket.on('userLocationToAll', (newUser) => {
        var listUserCopy = [...listUser];
        listUserCopy = listUserCopy.filter(user => user.pseudo != newUser.pseudo);
        listUserCopy.push(newUser)
        setListUser(listUserCopy);
      });
    }, [listUser])
  //overlay:
  
  //
 
  
     var selectPOI = (e) => {
       if(addPOI===true){
         setAddPOI(false)
         setVisible(true)
         setTempPOI({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude });
        
       
       }
       
     }
  
    var modalSubmit= ()=>{
      setVisible(false);
      var copyListPOI = [...listPOI, { longitude: tempPOI.longitude, latitude: tempPOI.latitude, title: title, description: desc }];
      AsyncStorage.setItem("POI", JSON.stringify(copyListPOI));
      setListPOI(copyListPOI)
      setDesc();
      setTempPOI();
      setTitle();
      
    }
     
    var markerUser = listUser.map((user, i) => {
      return <Marker key={i} pinColor="red" coordinate={{ latitude: user.latitude, longitude: user.longitude }}
        title={user.pseudo}
      />
    });
  
    var markerPOI = listPOI.map((POI, i) => {
      return <Marker key={i} pinColor="blue" coordinate={{ latitude: POI.latitude, longitude: POI.longitude }}
        title={POI.title}
        description={POI.description}
      />
    });

   var isDisabled= false
  if(addPOI){
    isDisabled=true
  }
  return (

    <View style={{flex:1}}>
      <Overlay 
      overlayStyle={{width:"80%", height: "35%"}}
      isVisible={visible}
      onBackdropPress={()=>setVisible(false)}> 
       <View>
         <Input              
        onChangeText={value => setTitle(value)}
        placeholder='Title'
        inputStyle= {{marginLeft:2 }}
        placeholderTextColor="gray"
        
      />
       <Input              
        onChangeText={value => setDesc(value)}
        placeholder='Description'
        inputStyle= {{marginLeft:2 }}
        placeholderTextColor="gray"
        
      />
      <Button 
        type='solid'
                       
          icon= {
             <Icon
                name='arrow-right'
                size={20}
                color='white'
              />
          } 
           title=" Ajouter la POI"
           buttonStyle={{backgroundColor: '#eb4d4b',}} 
           onPress={() => modalSubmit()}
        />
        
       </View>
       
      
      </Overlay>

   <MapView style={styles.mapStyle} 
      onPress={(e) => { selectPOI(e) }}
      region={mapRegion}
         
    > 
        <Marker
        coordinate={regionN}
        draggable
       
        />
      {markerPOI}
      {markerUser}
    
      </MapView>
   
        <Button
         disabled= {isDisabled}
         type='solid'
          style= {styles.buttonStyle}           
          icon= {
              <Icon
              name='envelope-o'
              size={20}
              color='#ffffff'
                             
                 
              />
                        
          } 
         
         title=" add POI"
         buttonStyle={{backgroundColor: '#eb4d4b',}}
         onPress={() => setAddPOI(true)}
         
        />
       
    </View>
      
      
  
      
   
  );
}

const styles = StyleSheet.create({
  
  mapStyle: {
    width: "100%",
    height: "95.2%"
  },
  buttonStyle:{
    flex:1,
    height:30
    
  }

});

function mapStateToProps(state) {
  return { pseudo: state.pseudo }
}

export default connect(
  mapStateToProps,
  null
)(MapScreen);