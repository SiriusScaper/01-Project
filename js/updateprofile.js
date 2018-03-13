
$(document).ready(function(){
  let database = firebase.database();

  //global variables used in initial ajax call
  let queryURL = 'https://swapi.co/api/species/';
  let speciesData = [];
  let anotherPage;
  let morePagesURL;
  let userMatches = [];

  //recursive function to get information from multiple pages of api results
  //necessary due to the way results are stored on this API
  //called at the end of the initial ajax call
  function speciesPageSearch(){
    if (anotherPage === 'https://swapi.co/api/species/?page=2'||anotherPage === 'https://swapi.co/api/species/?page=3'||anotherPage === 'https://swapi.co/api/species/?page=4'){
      $.ajax({
        url:anotherPage,
        method:'GET'
      }).then(function(response){
        for(var i = 0; i<response.results.length; i++){
          speciesData.push({name: response.results[i].name, match: null, url: response.results[i].url,});
        }
        anotherPage = response.next;
        console.log(speciesData);
        console.log(anotherPage);
        speciesPageSearch();
      })
    } else {
      speciesMatch(speciesData);
    }
  }

  //adds a "match" number to each species between 1 and 100.
  //function wouldn't work as intended unless called at the end of the recursive speciesPageSearch function in an else statement
  //otherwise it would add data to none of the results or only the first 10
  function speciesMatch(array){
    for(var i = 0; i<array.length; i++){
      array[i].match = Math.floor(Math.random()*Math.floor(100));
    }
  }

  $.ajax({
    url: queryURL,
    method:'GET'
  }).then(function(response){
    for(var i = 0; i<response.results.length; i++){
      speciesData.push({name: response.results[i].name, match: null, url: response.results[i].url});
    }
    // console.log(response);
    // console.log(speciesData);
    anotherPage = response.next;
    speciesPageSearch();
  })
  //initial ajax call to swapi to get species information
  $('#parentElement').on('click', '#listenedForId', function(event){
    event.preventDefault();
    updateProfile();
  })

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




  function updateProfile(){
    let user = firebase.auth().currentUser;
    let uid = user.uid;
    let userDataRef = database.ref('userData');
    let newChildRef = database.ref('userData/'+uid);
    let userSpecies = speciesData[Math.floor(Math.random()*Math.floor(speciesData.length))].name;
    let userName = $('#user_name').val().trim();
    let userAge = $('#user_age').val().trim();
    let userGender = $('#user_gender').val().trim();

    console.log(user);
    console.log(userName);
    console.log(userAge);
    console.log(userGender);
    console.log(userSpecies);

    //make userMatches for the new user by taking snapshot
    database.ref().once('value').then(function(snapshot){
      let sv = snapshot.val();
      console.log(sv);
      for(var i = 0; i<sv.userList.length; i++){
        userMatches.push({
          uid:sv.userList[i],
          matchRating:Math.floor(Math.random()*Math.floor(100))
        })
      }
      database.ref('userData/'+uid).update({userMatches:userMatches});
    })

    //update the userlist
    database.ref().once('value').then(function(snapshot){
      let sv = snapshot.val();
      console.log(sv);
      sv.userList.push(firebase.auth().currentUser.uid);
      database.ref().update({userList:sv.userList});
    })

    //update the userQuantity counter
    database.ref('userQuantity').once('value').then(function(snapshot){
      let sv = snapshot.val();
      let updatedVal = parseInt(sv)+1;
      console.log(sv);
      database.ref().update({userQuantity:updatedVal});
    })
    console.log(userMatches);
    //add the new user object to userData
    newChildRef.set({
      uid:uid,
      name:userName,
      age:userAge,
      gender:userGender,
      species:userSpecies,
      userMatches:userMatches,
      matchCounter:0
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //Needs to be updated for actual use with serverx

  // basic quick Sort implementation adjusted for our array of objects (pivot is the first element of the array)
  function quicksortBasic(array) {
    if(array.length < 2) {
      return array;
    }

    var pivot = array[0];
    var lesser = [];
    var greater = [];

    for(var i = 1; i < array.length; i++) {
      if(array[i].matchRating < pivot.matchRating) {
        lesser.push(array[i]);
      } else {
        greater.push(array[i]);
      }
    }

    return quicksortBasic(lesser).concat(pivot, quicksortBasic(greater));
  }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//button for test use
$('#parentElement').on('click', '#listenedForId2', function(event){
  event.preventDefault();
  // database.ref().once('value').then(function(snapshot){
  //   let sv = snapshot.val();
  //   console.log(sv);
  //   for(var i = 0; i<sv.userList.length; i++){
  //     userMatches.push({
  //       uid:sv.userList[i],
  //       matchRating:Math.floor(Math.random()*Math.floor(100))
  //     })
  //   }
  //   console.log(userMatches);
  //   // database.ref('userData/'+uid).update({userMatches:userMatches});
  // })

})


  database.ref('userList').on('child_added', function(){
    database.ref().once('value').then(function(snapshot){
      let sv = snapshot.val();
      console.log(sv);
      for(var i = 0; i<sv.userList.length-1;i++){
        let userI = sv.userList[i];
        //if statement prevents it from firing upon pageload when not needed
        if(sv.userData[userI].userMatches[sv.userData[userI].userMatches.length-1].uid == sv.userList[sv.userList.length-1]){
          return
        } else {
          sv.userData[userI].userMatches.push({
            uid:sv.userList[sv.userList.length-1],
            matchRating:Math.floor(Math.random()*Math.floor(100))
          })
          let updatedMatches = sv.userData[userI].userMatches;
          database.ref('userData/'+sv.userList[i]+'/userMatches').set(updatedMatches)
        }
      }
    })
  })

})//document.ready close

  //when a new child is added update each match data of every user to include the new user
  //snapshot user
  //create a match rating for the newest member and push that plus their user id to each user's matchData except the newest user
  //quick sort matchData for each user
  //update firebase database with the new info



  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //NEED TO DO
  // Get firebase snapshot
  // create user match data
  // push user info to user array on firebase
  // update all user match info on database with the newest child

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //race selection on button click
  //will happen once the user has filled in basic profile details


  // $('#parentDiv').on('click', "#encourage", function(){
  //   let queryURL = 'https://api.giphy.com/v1/gifs/random?tag=you+can+do_it&api_key=Bw2Sm4QKp6nTTXf2FHIX43JXWoQpQCpo'
  //   $.ajax({
  //     queryURL:queryURL,
  //     method:'GET'
  //   }).then(function(response){
  //     console.log(response);
  //   })
  // })

  //"I need encouragement" button?
  //Give them a button to click if they need a boost because some people need a little confidence bump to initiate
  //show them a 'you can do it!' gif chosen at random from giphy
