export const notification = {
  //title: "Title",
  message: "Message",
  type: "default", //success, danger, info, default, warning
  insert: "top", //top, bottom
  container: "top-right",
  dismiss: {
    duration: 2500,
    onScreen: true,
    pauseOnHover: true
  },
  showIcon: true,
  animationIn: ["animated", "animate__flipInX"],
  animationOut: ["animated", "animate__flipOutX"]
};