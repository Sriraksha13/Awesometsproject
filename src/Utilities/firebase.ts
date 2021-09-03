import firebase from 'firebase';
import {Alert} from 'react-native';

export const storeData = (
    empid: any,
    empName: any,
    startDate: any,
    endDate: any,
    firstHalfLeave: any,
    secondHalfLeave: any,
    
  ) => {
    
        let userRef = firebase.database().ref('storeData/'+empid);
        userRef.set({
          empid: empid,
    empName: empName,
    startDate: startDate,
    endDate: endDate,
    firstHalfLeave: firstHalfLeave,
    secondHalfLeave: secondHalfLeave,
        });
  };