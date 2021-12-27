import * as React from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {
  const [data, setData] = useState();
  const [favorites,setFavorites] = useState(['Pakistan'])

  const worldApi = () => {

    fetch("https://world-population.p.rapidapi.com/worldpopulation", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "world-population.p.rapidapi.com",
		"x-rapidapi-key": "4495e7e706mshc177c614d5b6cd3p1cf73ajsnd3ea3543af90"
	}
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
            <Text>
              Total Population :
              {data != undefined ? data.body.world_population : ''}
            </Text>
            <Text>
              Confirmed Cases %:{' '}
              {data != undefined
                ? ((278607203 * 100) / data.body.world_population)
                : ''}
            </Text>
            <Text>
              Recovered Cases %:{' '}
              {data != undefined
                ? ((249380419 * 100) / data.body.world_population)
                : ''}
            </Text>
            <Text>
              Total Deaths %:{' '}
              {data != undefined
                ? ((5403154 * 100) / data.body.world_population)
                : ''}
            </Text>
          </View>
          <Button title="Fetch data" onPress={worldApi} />
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
          "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
		"x-rapidapi-key": "4495e7e706mshc177c614d5b6cd3p1cf73ajsnd3ea3543af90",
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
          "x-rapidapi-host": "world-population.p.rapidapi.com",
		      "x-rapidapi-key": "4495e7e706mshc177c614d5b6cd3p1cf73ajsnd3ea3543af90"
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
            style={{ width: '80%' }}
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
          <Drawer.Screen name="Worldwide Statistics" component={WorldwideStatistics} />
          <Drawer.Screen name="List of all countries" component={CountryStatsScreen} />
          <Stack.Screen
            name="CountryStatistics"
            component={CountryStatistics}
            options={{
              drawerItemStyle: { height: 0 },
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
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  countryList: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },


  textInput: {
    borderWidth: 2,
    borderColor: 'black',
    padding: 5,
    width: '80%',
  },
});