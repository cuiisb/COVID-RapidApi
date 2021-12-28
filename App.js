import * as React from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default function App() {
  const [data, setData] = useState();
  const [favorites,setFavorites] = useState(['Pakistan'])

  const ApiCall1 = () => {

    fetch('https://world-population.p.rapidapi.com/worldpopulation', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'world-population.p.rapidapi.com',
        'x-rapidapi-key': '3555972a6fmsh65a61b6f68454d6p1c2b1ejsn62652d2136db',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      });
  };
  
  function WorldwideStatistics({ navigation }) {
    return (
      <View style={styles.container}>
          <View>
            <Text style = {{fontWeight: 'bold', fontSize: 18}}>
              Total Population :
              {data != undefined ? data.body.world_population : ''}
            </Text>
            <Text style = {{fontWeight: 'bold', fontSize: 18}}>
              Confirmed Cases %:{' '}
              {data != undefined
                ? ((278607203 * 100) / data.body.world_population)
                : ''}
            </Text>
            <Text style = {{fontWeight: 'bold', fontSize: 18}}>
              Recovered Cases %:{' '}
              {data != undefined
                ? ((249380419 * 100) / data.body.world_population)
                : ''}
            </Text>
            <Text style = {{fontWeight: 'bold', fontSize: 18}}>
              Total Deaths %:{' '}
              {data != undefined
                ? ((5403154 * 100) / data.body.world_population)
                : ''}
            </Text>
          </View >
          <Button title="Fetch data" onPress={ApiCall1} />
      </View>
    );
  }
  
  const CountryStatistics = ({ route, navigation }) => {
    const { data } = route.params;
    const [countryData,setCountryData] = useState()
    const [fav,setFav] = useState(false)
    
    useEffect(() => {
      fetch(`https://covid-19-data.p.rapidapi.com/country?name=${data}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
          'x-rapidapi-key':
            '3555972a6fmsh65a61b6f68454d6p1c2b1ejsn62652d2136db',
        },
      })
        .then((response) =>response.json())
        .then((json) => {
          setCountryData(json)
        });
    },[data]);

    return(
      <View style={styles.container}>
        
        <Text>Country Name: {countryData != undefined ? countryData[0].country : ''}</Text>
        <Text>Confirmed Cases: {countryData != undefined ? countryData[0].confirmed : ''}</Text>
        <Text>Recovered Cases: {countryData != undefined ? countryData[0].recovered : ''}</Text>
        <Text>Critical Cases: {countryData != undefined ? countryData[0].critical : ''}</Text>
        <Text>Total Deaths: {countryData != undefined ? countryData[0].deaths : ''}</Text>
      </View>
    ); 
  };

  function CountryStatsScreen({ navigation }) {
    const [countriesList, setCountriesList] = useState([]);
    const [searchCountry, setSearchCountry] = useState([]);
    const [search, setSearch] = useState('');

    const UserSearch = (val) => {
      setSearch(val);
      setSearchCountry(countriesList.filter((item) => item.includes(val)));
    };

    useEffect(() => {
      fetch('https://world-population.p.rapidapi.com/allcountriesname', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'world-population.p.rapidapi.com',
          'x-rapidapi-key':
            '3555972a6fmsh65a61b6f68454d6p1c2b1ejsn62652d2136db',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setCountriesList(json.body.countries);
          setSearchCountry(json.body.countries);
        });
    }, []);
    return (
      <>
        <View style={styles.countryList}>
          <TextInput
            placeholder="Search Country"
            style={styles.textInput}
            onChangeText={UserSearch}
          />
          <FlatList
            style={{ width: '80%' , fontWeight: 'bold'}}
            data={searchCountry}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CountryStatistics', { data: item })
                }
                >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </>
    );
  }

  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Worldwide Statistics
        ">
          <Drawer.Screen name="Worldwide Statistics" component={WorldwideStatistics} 
          options = {{
            activeTintColor: '#000000',
            activeBackgroundColor: '#e6e6e6',
          }}
          
          />
          <Drawer.Screen name="List of all countries" component={CountryStatsScreen} />
          <Stack.Screen
            name="CountryStatistics"
            component={CountryStatistics}
            options={{
              drawerItemStyle: { height: 0 },
              headerTintcolor: 'mistyrose'
              
            }}
          />
         
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'olive',
    padding: 8,
    fontWeight: "bold",
  },
  countryList: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'peachpuff'
  },


  textInput: {
    borderWidth: 2,
    borderColor: 'black',
    padding: 10,
    width: '80%',
    fontWeight: 'bold'
  },
});