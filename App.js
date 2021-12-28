import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Input } from 'react-native-elements';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from 'expo-constants';

const World = () => {
  const [getCovid, setCovid] = useState();
  const [getPop, setPop] = useState();
  const [getData, setData] = useState();

  const getDataFromAPI = async () => {
    fetch('https://covid-19-data.p.rapidapi.com/totals', {
      method: 'GET',
      headers: {
        'x-rapidapi-key": "4495e7e706mshc177c614d5b6cd3p1cf73ajsnd3ea3543af90',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setCovid(result);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const getDataFromAPI2 = async () => {
    fetch('https://world-population.p.rapidapi.com/worldpopulation', {
      method: 'GET',
      headers: {
        'x-rapidapi-key": "4495e7e706mshc177c614d5b6cd3p1cf73ajsnd3ea3543af90',
        'x-rapidapi-host': 'world-population.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.body.world_population);
        setPop(result.body.world_population);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  useEffect(() => {
    getDataFromAPI();
  }, [setCovid]);

  useEffect(() => {
    getDataFromAPI2();
  }, [setPop]);

  if (getCovid && getPop) {
    return (
      <>
        <View style={styles.container}>
          <FlatList
            refreshing={false}
            onRefresh={getDataFromAPI}
            keyExtractor={(item, index) => item.key}
            data={getCovid}
            renderItem={({ item, index }) => (
              <View>
                <Text style={styles.card}>{getPop}</Text>
                <Text style={styles.label}>Total World Population</Text>

                <Text style={[styles.card, { backgroundColor: 'gold' }]}>
                  {item.confirmed}
                </Text>

                <Text style={styles.label}>Total Cases</Text>
                <Text style={styles.label}>
                  {((item.confirmed / getPop) * 100).toFixed(3)}%
                </Text>

                <Text style={[styles.card, { backgroundColor: 'darkorange' }]}>
                  {item.recovered}
                </Text>
                <Text style={styles.label}>Recovered</Text>
                <Text style={styles.label}>
                  {((item.recovered / getPop) * 100).toFixed(3)}%
                </Text>

                <Text style={[styles.card, { backgroundColor: 'firebrick' }]}>
                  {item.deaths}
                </Text>
                <Text style={styles.label}>Total Deaths</Text>
                <Text style={styles.label}>
                  {((item.deaths / getPop) * 100).toFixed(3)}%
                </Text>

                <Text
                  style={[
                    styles.label,
                    { backgroundColor: 'lightgrey', marginTop: 20 },
                  ]}>
                  Last Updated
                </Text>

                <Text style={[styles.label, { backgroundColor: 'lightgrey' }]}>
                  {item.lastUpdate}
                </Text>
              </View>
            )}
          />
        </View>
      </>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#6545a4" size="large" />
        <Text style={{ alignSelf: 'center' }}>Loading....</Text>
      </View>
    );
  }
};

const Countries = ({ navigation }) => {
  const [getCountries, setCountries] = useState();
  const [getText, setText] = useState();

  const getDataFromAPI = async () => {
    fetch('https://covid-19-data.p.rapidapi.com/help/countries', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '4495e7e706mshc177c614d5b6cd3p1cf73ajsnd3ea3543af90',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        var res = result.map((item) => {
          return item.name;
        });
        setCountries(res);
        setText(res);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

 
  useEffect(
    () => {
      getDataFromAPI();
    },
    [setCountries],
    
  );

  return (
    <View>
      <Input
        placeholder="Enter Country Name"
        style={{ padding: 10 }}
        onChangeText={(v) => {
          setText(v)
        }}
      />
      <FlatList
        refreshing={false}
        onRefresh={getDataFromAPI}
        keyExtractor={(item, index) => item.key}
        data={getCountries}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              width: '100%',
              padding: 10,
              backgroundColor: 'lightgreen',
              margin: 1,
            }}
            onPress={() => {
              navigation.navigate('Country Details', item);
            }}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const CountryStats = ({ navigation, route }) => {
  const [getData, setData] = useState();
  const [getPop, setPop] = useState('Not Found');
  

  const getDataFromAPI = async () => {
    fetch(
      `https://covid-19-data.p.rapidapi.com/country?name=${encodeURIComponent(
        route.params
      )}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
          'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.confirmed);
        setData(result);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const getDataFromAPI2 = async () => {
    fetch(
      `https://world-population.p.rapidapi.com/population?country_name=${encodeURIComponent(
        route.params
      )}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key':
            'bbc0c72044msh8ff2f36a950ab26p14e44bjsn91e599057dc9',
          'x-rapidapi-host': 'world-population.p.rapidapi.com',
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.body.population);
        
        setPop(result.body.population);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  useEffect(() => {
    getDataFromAPI2();
  }, [setPop]);

  useEffect(() => {
    getDataFromAPI();
  }, [setData]);

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={false}
        onRefresh={getDataFromAPI}
        keyExtractor={(item, index) => item.key}
        data={getData}
        renderItem={({ item, index }) => (
          <View>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 30,
                marginTop: 18,
              }}>
              {item.country}
            </Text>
            <Text style={styles.card}>{getPop}</Text>
            <Text style={styles.label}>Total Population</Text>

            <Text style={[styles.card, { backgroundColor: 'gold' }]}>
              {item.confirmed}
            </Text>

            <Text style={styles.label}>Total Cases</Text>
            <Text style={styles.label}>
              {((item.confirmed / getPop) * 100).toFixed(3)}%
            </Text>

            <Text style={[styles.card, { backgroundColor: 'darkorange' }]}>
              {item.recovered}
            </Text>
            <Text style={styles.label}>Recovered</Text>
            <Text style={styles.label}>
              {((item.recovered / getPop) * 100).toFixed(3)}%
            </Text>

            <Text style={[styles.card, { backgroundColor: 'firebrick' }]}>
              {item.deaths}
            </Text>
            <Text style={styles.label}>Total Deaths</Text>
            <Text style={styles.label}>
              {((item.deaths / getPop) * 100).toFixed(3)}%
            </Text>

            <Text
              style={[
                styles.label,
                { backgroundColor: 'grey', marginTop: 18 },
              ]}>
              Last Updated
            </Text>

            <Text style={[styles.label, { backgroundColor: 'grey' }]}>
              {item.lastUpdate}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const FavCountries = ({ navigation }) => {
  const [getCountries, setCountries] = useState();

  useEffect(() => {
    
  }, [setCountries]);

  return (
    <View>
      <FlatList
        refreshing={false}
        keyExtractor={(item, index) => item.key}
        data={getCountries}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              width: '100%',
              padding: 11,
              backgroundColor: 'lightblue',
              margin: 1,
            }}
            onPress={() => {
              navigation.navigate('Country Details', item);
            }}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="World Stats" component={World} />
      <Drawer.Screen name="Countries Stats" component={MyStack} />
      <Drawer.Screen name="Favourite Countries" component={FavCountries} />
    </Drawer.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Countries" component={Countries} />
      <Stack.Screen name="Country Details" component={CountryStats} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },

  card: {
    fontWeight: 'bold',
    backgroundColor: 'lightblue',
    fontSize: 24,
    width: 'fit-content',
    padding: 27,
    borderRadius: 45,
    alignSelf: 'center',
    marginTop: 18,
  },
  label: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});