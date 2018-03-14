$(document).ready(function(){
  const database = firebase.database();
  $('#post').on('click', function(event){
    event.preventDefault();
    let msgUser = database.auth().currentUser.uid;
    let msgText = $('#user_Message').val().trim();
  })

})
