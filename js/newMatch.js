//THIS MODULE WILL DO THE FOLLOWING
//grab data for current user's best match
//on second click (meaning, I don't like this one, show me someone new) it will
//reduce current match's rating to a negative number before looking for the new match.
//matches are sorted by matchRating and the highest rating is chosen as the new match

$(document).ready(function() {
  let database = firebase.database();
  let currentMatchUID = null;
  //click event for a new patch partner
  $("#parentElement").on("click", "#listenedForId2", function(event) {
    event.preventDefault();
    //switch to hot-or-not selection if first match
    //otherwise clear the old user divs for this user's info

    //Downgrade previous match, cause they sucked
    database
      .ref("userData/" + firebase.auth().currentUser.uid)
      .once("value")
      .then(function(snap) {
        let snapv = snap.val();
        console.log(snapv);
        for (var i = 0; i < snapv.userMatches.length; i++) {
          if (snapv.userMatches[i].uid == currentMatchUID) {
            snapv.userMatches[i].matchRating -= 100;
          }
        }
        console.log(snapv.userMatches);
        database
          .ref("userData/" + firebase.auth().currentUser.uid + "/userMatches")
          .set(snapv.userMatches);
      });

    database
      .ref("userData")
      .once("value")
      .then(function(snapshot) {
        let sv = snapshot.val();
        let thisUser = firebase.auth().currentUser.uid;
        // console.log(sv);
        reverseMatchOrder = quicksortBasic(sv[thisUser].userMatches);
        // console.log(reverseMatchOrder);

        currentMatchUID = reverseMatchOrder[reverseMatchOrder.length - 1].uid;
        let name_toDisplay = sv[currentMatchUID].name;
        let age_toDisplay = sv[currentMatchUID].age;
        let gender_toDisplay = sv[currentMatchUID].gender;
        let species_toDisplay = sv[currentMatchUID].species;
        // console.log(name_toDisplay);
        // console.log(age_toDisplay);
        // console.log(gender_toDisplay);
        // console.log(species_toDisplay);
      });
  });
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  function quicksortBasic(array) {
    if (array.length < 2) {
      return array;
    }

    var pivot = array[0];
    var lesser = [];
    var greater = [];

    for (var i = 1; i < array.length; i++) {
      if (array[i].matchRating < pivot.matchRating) {
        lesser.push(array[i]);
      } else {
        greater.push(array[i]);
      }
    }

    return quicksortBasic(lesser).concat(pivot, quicksortBasic(greater));
  }
});
