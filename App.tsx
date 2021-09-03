import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import CalendarPicker from 'react-native-calendar-picker';
import firebase from 'firebase';
import { LogBox } from 'react-native';
import {storeData} from './src/Utilities/firebase';
import {styles} from './src/styles/styles';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

interface myState {
  employeeId: any;
  employeeName: any;
  selectedStartDate: any;
  selectedEndDate: any;
  selectedStart: any;
  selectedEnd: any;
  noOfDays:any,
  data:any
}

var firebaseConfig = {
  apiKey: "AIzaSyBOLQ5XCTI2xCjka0JIGxYKjrcPg9XmD2g",
  authDomain: "awesometsproject-d25d8.firebaseapp.com",
  databaseURL: "https://awesometsproject-d25d8-default-rtdb.firebaseio.com",
  projectId: "awesometsproject-d25d8",
  storageBucket: "awesometsproject-d25d8.appspot.com",
  messagingSenderId: "1060285591959",
  appId: "1:1060285591959:web:6df890606f9956a24c14d2",
  measurementId: "G-9L9H7RZ73W"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends React.Component<{}, myState> {
  constructor(props: any) {
    super(props);
    this.state = {
      employeeId: '',
      employeeName: '',
      selectedStartDate: null,
      selectedEndDate: null,
      selectedStart: false,
      selectedEnd: false,
      noOfDays: 1,
      data: null,
    }
    this.onDateChange = this.onDateChange.bind(this);
    this.onSelectionStart = this.onSelectionStart.bind(this);
    this.onSelectionEnd = this.onSelectionEnd.bind(this);
    this.getEmployeeName = this.getEmployeeName.bind(this);
  }

  componentDidMount() {
    const eid = firebase.database().ref('employees/eid')
    eid.on("value", datasnap => {
      this.setState({
        data: datasnap.val()
      })
    })
  }

  onDateChange(date: any, type: any) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  onSelectionStart() {
    this.setState({
      selectedStart: !this.state.selectedStart
    })
  }
  onSelectionEnd() {
    this.setState({
      selectedEnd: !this.state.selectedEnd
    })
  }

  getEmployeeName() {
    const tempData = this.state.data;
    let flag = 0;
    for (let x in tempData) {
      if (this.state.employeeId == x) {
        flag = 1;
        this.setState({
          employeeName: tempData[x].name
        })
      }
    }
    if (flag == 0) {
      this.setState({
        employeeName: null,
        employeeId: null,
      })
      Alert.alert("No employee found");
    }
  }
 storeData(){
   storeData(this.state.employeeId,this.state.employeeName,this.state.selectedStartDate.toString(),this.state.selectedEndDate.toString(),this.state.selectedStart.toString(),this.state.selectedEnd.toString())
  Alert.alert("Data stored successfully!")
 }

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(2021, 1, 1); // Today
    const maxDate = new Date(2022, 1, 1);
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Employee LMS Portal</Text>
          <View style={styles.view1}>
          <Text style={styles.inputLabel} >Employee ID: </Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              this.setState({
                employeeId: text
              })
            }}
            value={this.state.employeeId}
            placeholder="Enter your employee ID"
            keyboardType="numeric"
          />

          <Text style={styles.empName}>Employee name: {this.state?.employeeName}</Text>
          <TouchableOpacity>
          <Text style={styles.empButton} 
            onPress={() => { this.getEmployeeName() }}
          >Check Employee</Text>
          </TouchableOpacity>
            </View>

          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={minDate}
            maxDate={maxDate}
            todayBackgroundColor="#f2e6ff"
            selectedDayColor="#7300e6"
            selectedDayTextColor="#FFFFFF"
            onDateChange={this.onDateChange}
          />

          <View style={styles.view1} >
            <Text style={styles.dates}>START DATE : {startDate}</Text>
            <Text style={styles.dates}>END DATE : {endDate}</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              value={this.state.selectedStart}
              onValueChange={this.onSelectionStart}
              style={styles.checkbox}
            />
            
            <Text style={styles.label}>Half day leave on Start date</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox
              value={this.state.selectedEnd}
              onValueChange={this.onSelectionEnd}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Half day leave on End date {this.state.noOfDays}</Text>
          </View>
          <TouchableOpacity>
          <Text style={styles.submit} 
            onPress={() => { this.storeData() }}
          >Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

