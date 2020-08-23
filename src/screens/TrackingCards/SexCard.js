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
import { initSexDetails } from '../../models/SexDetails';


const { width } = Dimensions.get('window');

export default class SexCard extends React.Component {
   
    
    constructor(props) {
        super(props);
        this.state = { sexVisible: false };
        this.state = {
            selectedTags: [],
            sexValue: 0,
            selectedSexualActivity: [],
            sexualActivity:[],
            minValue: 0,
            maxValue: 5,
            userDetails:{}, 
            sexDetails: initSexDetails(0,  moment().format('YYYY-MM-DD')) ,
            //isSexDataAvailable: false,
            currentDate: this.props && this.props.route && this.props.route.params && this.props.route.params.currentDate || moment().format('YYYY-MM-DD')    
        };
        this.saveSexDetails = this.saveSexDetails.bind(this);
    }
    setSexVisible(visible) {
        this.setState({ sexVisible: visible });
         
    }


    getSexualActivity() {
        let url = constants.SEXUALACTIVITY_DEV_URL;
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
                    let sexualActivity = [];//getting all possible sexual activity tags from the database  //{} is an object [] an array a value
                    sexualActivity = mapListItemsToTags(responseData);
                    
                    this.setState({ sexualActivity: sexualActivity });
                })
                .catch((err) => console.log(err))
        );
    };
 


    saveSexDetails() {
      
     
        //     // Add the saved sex level
            let userId = this.state.userDetails.user_id;
            let occurredDate = moment(this.state.currentDate).add(moment().hour(), 'hour').add(moment().minute(), 'minute');
            // Add sexual activity
            let sexualActivity = null ;
        
            if (this.state.selectedSexualActivity.length > 0)
                sexualActivity = this.state.selectedSexualActivity[0]; 
       

            let sex = { //sending to the database,if sex type value = 0 then don't send it to the database as it means the user didnt select any tags
                user_id: userId,
                sex_level: this.state.sexValue,
                sexual_activity :sexualActivity, 
                occurred_date: localToUtcDateTime(occurredDate),
                
            };
           
           
            let url = constants.ADDUSERSEX_DEV_URL;
            getData(constants.JWTKEY).then((jwt) =>
                fetch(url, {
                    //calling API
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + jwt, //Passing this will authorize the user
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sex)
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
            this.getSexualActivity();
            
        });
    }


    render() {

        let sexLevel = 0;

        
        let sexualActivity = this.state.sexualActivity || [] ; // get all the possible value from the list item , if not then empty array .

        return (
            <Layout style={TrackingStyles.container}>
                <TouchableWithoutFeedback onPress={() => { this.setSexVisible(true); }}>
                    <Image
                        style={TrackingStyles.sexButton}
                        source={require('../../../assets/sex.png')}
                    />
                </TouchableWithoutFeedback>

                <Modal style={{
                    shadowColor: '#c8c8c8',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 30,
                }} visible={this.state.sexVisible}>
                    <Card disabled={true}
                        style={ TrackingStyles.cardStyle }>
                        <Text style={TrackingStyles.symptomText}>Sex </Text>
                        <TouchableWithoutFeedback onPress={() => {
                            this.setSexVisible(!this.state.sexVisible);
                        }}>
                            <Image
                                style={TrackingStyles.xContainer}
                                source={require('../../../assets/x.png')}
                            />
                        </TouchableWithoutFeedback>
                        <Text style={{ color: '#8A8A8E', textAlign: 'left', top: Responsive.height(15), fontSize: Responsive.font(15), fontWeight: '400' }}>Did you do any sexual activities today </Text>
                        <Slider
                            style={styles.sliderStyle}
                            step={5}
                            minimumValue={this.state.minValue}
                            maximumValue={this.state.maxValue}
                            value={sexLevel}
                            onValueChange={val => this.setState({ sexValue: val })}
                            maximumTrackTintColor='#d3d3d3'
                            minimumTrackTintColor='#f09874'
                        />
                        <View style={styles.textCon}>
                            <Text style={styles.colorGrey}>Didn't Have Sex </Text>
                            <Text style={styles.colorPeach}>
                                {this.state.sexValue + ''}
                            </Text>
                            <Text style={styles.colorGrey}>Had Sex </Text>
                        </View>
                        <Text style={{ color: '#8A8A8E', textAlign: 'left', top: Responsive.height(65), fontSize: Responsive.font(15), fontWeight: '400' }}>Add more detail: </Text>
                        <View style={{top: Responsive.height(80), left: Responsive.width(-10), width:Responsive.width(310)}}>
                            <TagSelector
                                tagStyle={TrackingStyles.tag}
                                selectedTagStyle={TrackingStyles.tagSelected}
                                maxHeight={70}
                                tags={sexualActivity}
                                onChange={(selected) => this.setState({  selectedSexualActivity: selected })}
                            />
                        </View>

                        <Button
                            style={TrackingStyles.trackButton}
                            appearance='outline'
                            onPress={() => {
                                this.setSexVisible(!this.state.sexVisible);
                                this.saveSexDetails(); 
                            }} > Track!
                            </Button>
                    </Card>
                    
                </Modal>
            </Layout>


        );
    };
}
const styles = StyleSheet.create({

    sliderStyle: {
        alignSelf: 'center',
        top: Responsive.height(38),
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
        fontWeight: '400',
        top: Responsive.height(52),

    },
    colorPeach: {
        color: '#f09874',
        fontWeight: '400',
        top: Responsive.height(52),

    },


});