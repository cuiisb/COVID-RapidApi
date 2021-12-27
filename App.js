import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react'

export default function App() {
  const [isLoading, setLoading] = React.useState(false);
  const [data, setData] = useState([]);


  useEffect(() => {
    getData();

  }, [setData]);

  const getData = async () => {
    fetch(
      "https://covid-19-data.p.rapidapi.com/report/totals?date=2020-07-21",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "39a5736e21msh8601cd020a5d3b4p19a86fjsn59d30103d2a3",
          "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        setData(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getData();
  if (isLoading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator  />
        <Text>Loading Data from JSON Placeholder API ...</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        height: "40%",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          backgroundColor: "blue",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 27,fontWeight: 'bold', marginBottom: 12 }}>CORONA STATS</Text>
      </View>
      <View style={{ paddingTop: 30 }}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 13,
                borderBottomWidth: 1,
                borderColor: "grey",
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  borderWidth: 2,
                  padding: 17,
                  marginBottom: 10,
                  borderColor: "lightblue",
                  backgroundColor: "lightblue",
                }}
              >
                <Text> Recovered : {item.recovered}</Text>
              </View>
              <View
                style={{
                  borderWidth: 2,
                  padding: 17,
                  marginBottom: 10,
                  borderColor: "lightblue",
                }}
              >
                <Text>Confirmed : {item.confirmed}</Text>
              </View>
              <View
                style={{
                  borderWidth: 2,
                  padding: 17,
                  marginBottom: 10,
                  borderColor: "lightblue",
                  backgroundColor: "lightblue",
                }}
              >
                <Text>Active Cases : {item.active}</Text>
              </View>
              <View
                style={{
                  borderWidth: 2,
                  padding: 17,
                  marginBottom: 10,
                  borderColor: "lightblue",
                }}
              >
                <Text>Total Deaths : {item.deaths}</Text>
              </View>

              <View
                style={{
                  borderWidth: 2,
                  padding: 17,
                  marginBottom: 10,
                  borderColor: "lightblue",
                  backgroundColor: "lightblue",
                }}
              >
                <Text>Critcal Cases : {item.critical}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
