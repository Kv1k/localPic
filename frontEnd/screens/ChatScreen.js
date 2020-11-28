import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView} from 'react-native';
import { Input, ListItem, Button  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import socketIOClient from "socket.io-client";
import {connect} from 'react-redux';


var socket = socketIOClient("http://[IP ADRESS]:3000")



function ChatScreen(props) {
    const [currentMessage, setCurrentMessage]= useState('');
    const [listMessage, setListMessage]=useState([]);
    
    
   
    
    useEffect(() => { 
    
        socket.on('sendMessageToAll', (information)=> {
           
            setListMessage([...listMessage, information]);
            console.log(listMessage)
            
        });
       
      }, [listMessage]);


      var allMessage= listMessage.map((information,i)=>{
          return(
            <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{information.message}</ListItem.Title>
              <ListItem.Subtitle>{information.pseudo}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
          )
      })
     
    return (
      <View style ={styles.container}>
            <ScrollView>
               
               {allMessage}
            

            </ScrollView>
           
                <Input
                   
                    placeholder= 'Your message'
                    value={currentMessage}
                    
                    onChangeText={value => setCurrentMessage(value)}      
                />
                <Button
                     type='solid'
                    onPress={()=>{socket.emit("sendMessage", {message: currentMessage, pseudo:props.pseudoToDisplay}), setCurrentMessage('')}}
                     icon= {
                         <Icon
                             name='envelope-o'
                             size={20}
                             color='#ffffff'
                             
                 
                         />
                        
                     } 
                     title=" Send"
                     buttonStyle={{backgroundColor: '#eb4d4b',}}
                />

          
           
       
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
     marginTop:'10%'
     
    },
});

function mapStateToProps(state) {
    return { pseudoToDisplay: state.pseudo }
  }
    
export default connect(
    mapStateToProps, 
    null
)(ChatScreen);