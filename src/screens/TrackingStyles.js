import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
export const TrackingStyles = {
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  painButton: {
    position: "absolute",
    top: 200,
    width: 100,
    height: 100,
    right: 100,
    resizeMode: "contain",
  },

  moodButton: {
    position: "absolute",
    top: 200,
    width: 100,
    height: 100,
    right: -5,
    resizeMode: "contain",
  },

  bloodButton: {
    position: "absolute",
    top: 200,
    width: 100,
    height: 100,
    right: -100,
    resizeMode: "contain",
  },

  digestionButton: {
    position: "absolute",
    top: 195,
    width: 100,
    height: 100,
    right: -200,
    resizeMode: "contain",
  },

  exerciseButton: {
    position: "absolute",
    top: 200,
    width: 100,
    height: 100,
    right: -300,
    resizeMode: "contain",
  },

  medicationButton: {
    position: "absolute",
    top: 200,
    width: 100,
    height: 100,
    right: -400,
    resizeMode: "contain",
  },
  saveButton: {
    position: "absolute",
    top: 195,
    width: 90,
    height: 90,
    right: -500,
    resizeMode: "contain",
  },

  trackButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 470,
    left: 15,
    backgroundColor: "#f09874",
    borderRadius: 25,
    width: width - 90,
  },

  doneButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: -400,
    left: 290,
  },
  girlSaveContainer: {
    left: 10,
    height: 253,
    width: 289,
    top: -80,
  },

  saveText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 28,
    top: 300,
  },
  saveLogText: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
    top: 330,
    color: "#B3B3B3",
  },

  cardStyle: {
    width: width - 55,
    height: 529,
    borderRadius: 20,
    top: -30,
    backgroundColor: "#ffffff",
  },
  symptomText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  tagStyle: {
    alignSelf: "center",
    fontSize: 12,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    height: 32,
    margin: 2,
    color: "white",
    backgroundColor: "#f09874",
    borderRadius: 25,
  },
  tag: {
    alignSelf: "center",
    borderRadius: 25,
    fontSize: 12,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    height: 32,
    margin: 2,
    backgroundColor: "#EBF1FD",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fbfbfb",
  },
};