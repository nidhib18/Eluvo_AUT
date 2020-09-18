import React, { Component } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image, Dimensions, TouchableOpacity,TouchableWithoutFeedback, Slider, StyleSheet, View } from 'react-native';
import { Layout, Card, Modal, Text, Button } from '@ui-kitten/components';
import { TrackingStyles } from "../TrackingStyles";
import TagSelector from 'react-native-tag-selector';
import moment from "moment";
import { storeData, getData } from "../../helpers/StorageHelpers";
import { constants } from "../../resources/Constants";
import { initPainDetails } from "../../models/PainDetails";
import { utcToLocal, localToUtcDate, localToUtcDateTime } from "../../helpers/DateHelpers";
import { mapListItemsToTags } from "../../helpers/TagHelpers"
import { initDietDetails } from '../../models/DietDetails';

const { width } = Dimensions.get('window');

export default class DietCard extends React.Component {


    constructor(props) {
        super(props);
        this.state = { dietVisible: false };
        this.state = {
            selectedTags: [],
            dietValue: 0,
            minValue: 0,
            maxValue: 5,
            selectedFoodType: [], 
            foodTypes:[],
            userDetails: {},       
            userSettings: {},     
            dietDetails: initDietDetails (0,  moment().format('YYYY-MM-DD')) ,
            currentDate: this.props && this.props.route && this.props.route.params && this.props.route.params.currentDate || moment().format('YYYY-MM-DD')    
        };
        this.saveDietDetails = this.saveDietDetails.bind(this);
    }
    setDietVisible(visible) {
        this.setState({ dietVisible: visible });
    }


    getFoodTypes() {
        let url = constants.FOODTYPE_DEV_URL;
        getData(constants.JWTKEY).then((jwt) =>
            fetch(url, {
                //calling API
                method: "GET",
                headers: {
                    Authorization: "Bearer " + jwt, //Passing this will authorize the user
                },
            })
                .then((response) => response.json())
                .then((responseData) => {
                    let foodTypes = [];//getting all possible food type tags from the database  //{} is an object [] an array a value
                    foodTypes = mapListItemsToTags(responseData);
                    
                    this.setState({ foodTypes: foodTypes });
                })
                .catch((err) => console.log(err))
        );
    };

    

    saveDietDetails() {
      
        
        //     // Add the saved level
            let userId = this.state.userDetails.user_id;
            let occurredDate = moment(this.state.currentDate).add(moment().hour(), 'hour').add(moment().minute(), 'minute');
            // Add pain locations
            let foodType = null ;
            
            if (this.state.selectedFoodType.length > 0)
            foodType = this.state.selectedFoodType[0]; 
       

            let diet = { //sending to the database,if type value = 0 then don't send it to the database as it means the user didnt select any tags
                user_id: userId,
                diet_level: this.state.dietValue,
                food_type :foodType, 
                occurred_date: localToUtcDateTime(occurredDate),
                
            };
           
           
            let url = constants.ADDUSERDIET_DEV_URL;
            getData(constants.JWTKEY).then((jwt) =>
                fetch(url, {
                    //calling API
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + jwt, //Passing this will authorize the user
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(diet)
                })
                    .then((response) => {
                        return response.json();
                    })
            );
    
    }

    componentDidMount() //after Ui has been uploaded 
     {
        getData(constants.USERDETAILS).then((data) => {
            // Read back the user details from storage and convert to object
            this.state.userDetails = JSON.parse(data);
            this.setState({
                userDetails: JSON.parse(data),
            });
            this.getFoodTypes();
            
        }).then((data) => {
            getData(constants.USERSETTINGS).then((data) => {
                // Read back the user settings from storage and convert to object
                console.log ("****USER SETTINGS in exercise card****" ,data);
                this.setState({
                  userSettings: JSON.parse(data),
                });
            });
           });
    }
    getUserSettings ()
    { 
      let userId = this.state.userDetails.user_id;
      let url = constants.GETUSERSETTINGS_DEV_URL.replace("[userId]", userId);
      getData(constants.JWTKEY).then((jwt) =>
      fetch(url, {
        //calling API
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwt, //Passing this will authorize the user
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("Completed API call");
    
  }
        )
      )
    }
    render() {

       
        let dietLevel =  0;
    
        let foodTypes = this.state.foodTypes || [] ; 
        let isDietEnabled = (this.state.userSettings && this.state.userSettings.enable_diet) || false;
        return (
            <Layout style={TrackingStyles.container}>
              {isDietEnabled ? (
                    <>
                <TouchableWithoutFeedback onPress={() => { this.setDietVisible(true); }}>
                    <Image
                        style={TrackingStyles.dietButton}
                        source={require('../../../assets/diet.png')}
                    />
                </TouchableWithoutFeedback>
                </>
                )
                : (<></>)
                }
                <Modal style={{
                    shadowColor: '#c8c8c8',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 30,
                }} visible={this.state.dietVisible}>
                    <Card disabled={true}
                        style={TrackingStyles.cardStyle}>
                        <Text style={TrackingStyles.symptomText}>Diet </Text>
                        <TouchableWithoutFeedback onPress={() => {
                            this.setDietVisible(!this.state.dietVisible);
                        }}>
                            <Image
                                style={TrackingStyles.xContainer}
                                source={require('../../../assets/x.png')}
                            />
                        </TouchableWithoutFeedback>
                        <Text style={{ color: '#8A8A8E', textAlign: 'left', top: Responsive.height(15), fontSize: Responsive.font(15), fontWeight: '400' }}>How well did you eat today? </Text>
                        <Slider
                            style={styles.sliderStyle}
                            step={1}
                            minimumValue={this.state.minValue}
                            maximumValue={this.state.maxValue}
                            value={dietLevel}
                            onValueChange={val => this.setState({ dietValue: val })}
                            maximumTrackTintColor='#d3d3d3'
                            minimumTrackTintColor='#f09874'
                        />
                        <View style={styles.textCon}>
                            <Text style={styles.colorGrey}>No Change </Text>
                            <Text style={styles.colorPeach}>
                                {this.state.dietValue + ''}
                            </Text>
                            <Text style={styles.colorGrey}>Poor </Text>
                        </View>
                        
                        <Text style={{ color: '#8A8A8E', textAlign: 'left', top: Responsive.height(65), fontSize: Responsive.font(15), fontWeight: '400' }}>What types of food did you consume today? </Text>
                        <View style={{ top: Responsive.height(75), left: Responsive.width(-10) }}>
                            <TagSelector

                                tagStyle={TrackingStyles.tag}
                                selectedTagStyle={TrackingStyles.tagSelected}
                                maxHeight={70}
                                tags={foodTypes}
                                onChange={(selected) => this.setState({ selectedFoodType: selected })}
                            />
                        </View>

                        <Button
                            style={TrackingStyles.trackButton}
                            appearance='outline'
                            onPress={() => {
                                this.setDietVisible(!this.state.dietVisible);
                                this.saveDietDetails(); 
                            }} > Save!
                            </Button>
                    </Card>

                </Modal>
            </Layout>


        );
    };
}
const styles = StyleSheet.create({

    sliderStyle: {

        top: Responsive.height(28),
        flex: 1,
        width: Responsive.width(292),
        height: Responsive.height(52),
        padding: Responsive.width(17),
        backgroundColor: '#FFF'

    },
    textCon: {
        width: Responsive.width(292),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    colorGrey: {
        color: '#8A8A8E',
        top: Responsive.height(45),
        fontWeight:'400',
        fontSize:Responsive.font(13)

    },
    colorPeach: {
        color: '#f09874',
        top: Responsive.height(45),
        fontWeight:'400',
        fontSize:Responsive.font(13)

    }


});