// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  // Other config options...
});

var uiConfig = {
  callbacks: {
    signInSuccess: function(currentUser, credential, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.

      return false;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "http://127.0.0.1:5500/index.html",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // ^^ http://127.0.0.1:5500/index.html
    // took out the extras..because..simplicity
    
    //added back in because it's my work and I get to make decisions as well.
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		firebase.auth.FacebookAuthProvider.PROVIDER_ID,
		firebase.auth.TwitterAuthProvider.PROVIDER_ID,
		firebase.auth.GithubAuthProvider.PROVIDER_ID,
		firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: "/index.html",
};

// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);
