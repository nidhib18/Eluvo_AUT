import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { SafeAreaView, Image, Platform, ScrollView } from "react-native";
import { Header } from "@react-navigation/stack";
import Responsive from 'react-native-lightweight-responsive';
import {
  Divider,
  Input,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  evaProps,
  Button,
} from "@ui-kitten/components";
import {Alert} from 'react-native';
import RNRestart from 'react-native-restart';
import {setJSExceptionHandler} from 'react-native-exception-handler';
import { ImageStyles } from "./ImageStyles";
import { LoginStyles } from "./LoginStyles";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { saveUserDetails } from "../helpers/AuthHelpers";
import { constants } from "../resources/Constants";
// import { popUp } from "./Home"

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleSignIn = () => {
    const { username, password } = this.state;

    Auth.signIn({ username, password })

      // If we are successful, navigate to Home screen
      .then((user) => {
        // We need to pass this.props.navigation, so that navigation happens only after user details has completed saving
        this.props.navigation.navigate("Home", {
          username: username,                            
        });
      })

      // On failure, display error in console
      .catch((err) => {
        console.log(err);
        if (err.code == constants.NOTAUTHORISED_EXCEPTION) alert(err.message);
        else if (err.code == constants.USERNOTFOUND_EXCEPTION)
          alert(err.message);
      });
  };
  
  render() {
    return (
      
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#f09874" }}
        behavior="position"
        enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={ImageStyles.mainContainer}>
            <TopNavigation position="absolute" />
            <Divider />

            <Image
              style={ImageStyles.bubbleContainer}
              source={require("../../assets/bubble.png")}
            />

            <Image
              style={ImageStyles.logoContainer}
              source={require("../../assets/logo.png")}
            />

            <Image
              style={ImageStyles.eluvoContainer}
              source={require("../../assets/eluvo.png")}
            />

            <Image
              style={ImageStyles.eluvoTextContainer}
              source={require("../../assets/eluvotext.png")}
            />
            <Image
              style={ImageStyles.squiggleContainer}
              source={require("../../assets/squiggle.png")}
            />

            <Image
              style={ImageStyles.dotsContainer}
              source={require("../../assets/dots.png")}
            />

         <Input
              style={LoginStyles.usernameInput}
              label="Username"
              onChangeText={(value) => this.setState({ username: value })}
              placeholderTextColor={"#f09874"}
              color={"black"}
              height={Responsive.height(24)}
              alignItems={"center"}
            />

            <Input
              style={LoginStyles.passwordInput}
              label="Password"
              secureTextEntry={true}
              onChangeText={
                // Set this.state.password to the value in this Input box
                (value) => this.setState({ password: value })
              }
              placeholderTextColor={"#f09874"}
              color={"black"}
              height={Responsive.height(24)}
            />

            <Button
              style={LoginStyles.submitBtnContainer}
              appearance="outline"
              status="warning"
              onPress={this.handleSignIn}
            >
              Submit
            </Button>

            <Button
              style={LoginStyles.forgotBtnContainer}
              appearance="ghost"
              status="warning"
              onPress={() => this.props.navigation.navigate('Forgot')}
            >
              Forgot Password?
            </Button>
          </Layout>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
