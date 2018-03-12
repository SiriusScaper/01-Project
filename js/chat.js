function initChat(user) {
	// Get a Firebase Database ref
	var chatRef = firebase.database().ref('chat');

	// Create a Firechat instance
	var chat = new FirechatUI(
		chatRef,
		document.getElementById('firechat-wrapper')
	);

	// Set the Firechat user
	chat.setUser(user.uid, user.displayName);
}

firebase.auth().onAuthStateChanged(function(user) {
	// Once authenticated, instantiate Firechat with the logged in user
	if (user) {
		initChat(user);
	}
});
