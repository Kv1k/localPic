
import React , {useState, useEffect} from 'react';
import {  StyleSheet, ImageBackground,AsyncStorage, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button  } from 'react-native-elements';

import { connect } from 'react-redux';

function HomeScreen({onSubmitPseudo, navigation} ) {
    const [pseudo, setPseudo] = useState()
    const [pseudoIsSubmited, setPseudoIsSubmited] = useState(false);

    useEffect(() => {
      AsyncStorage.getItem('pseudo', (err, value) => {
        setPseudo(value);
        setPseudoIsSubmited(true);
      })
    }, []);
   
    

  
    var result;
    
    
    if(!pseudoIsSubmited){
    
      result=( 
        <Input            
      onChangeText={value => setPseudo(value)}
      placeholder='Kamil'
      placeholderColor='#4d4f52'
      inputStyle= {{marginLeft:2 }}
      placeholderTextColor="#4d4f52"
      containerStyle={ { width: '70%', color:'black'} }
      leftIcon={
          <Icon
          name='user'
          size={24}
          color='#eb4d4b'
          />
      }
      />
      
    )
    }else{
      
     
  
      result= <Text  style={{ marginBottom: 25, color: '#FFFFFF',fontWeight: 'bold',fontSize: 20 }}>Welcome back {pseudo}</Text>

    }

   
    return ( 
        <ImageBackground source={require('../images/home.jpg')} style={styles.container}>
          {result}
                    <Button 
                        type='solid'
                       
                        icon= {
                            <Icon
                                name='arrow-right'
                                size={20}
                                color='#eb4d4b'
                                
                    
                            />
                           
                        } 
                        title=" Go to Map"
                        onPress={() => {setPseudoIsSubmited(true);
                          onSubmitPseudo(pseudo);navigation.navigate('Menu');AsyncStorage.setItem("pseudo",pseudo)}}
                    />
                    
                <View>
          
       </View>
            
          
        </ImageBackground>
      
    );
  }
const styles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},

});


function mapDispatchToProps(dispatch) {
  return {
    onSubmitPseudo: function (pseudo) {
      dispatch({ type: 'savePseudo', pseudo: pseudo })
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(HomeScreen);  
  

