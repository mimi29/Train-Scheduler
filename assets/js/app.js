var config = {
    apiKey: "AIzaSyDCj7WaYTVkIKChuXlYgyvGhy0suSaBTX8",
    authDomain: "ming-app-5b7ce.firebaseapp.com",
    databaseURL: "https://ming-app-5b7ce.firebaseio.com",
    projectId: "ming-app-5b7ce",
    storageBucket: "ming-app-5b7ce.appspot.com",
    messagingSenderId: "112789545628"
};

var tMinutesTillTrain = 0;
var nextTrain = 0;

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

function calculateNextTrain(firstTime, tFrequency) {

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
}

$(document).ready(function () {
    console.log("ready!");

    firebase.database().ref("/trains").on("child_added", function (snapshot) {

        // Console.loging the last user's data
        var trainName = snapshot.val().trainName;
        var dest = snapshot.val().destination;
        var freq = snapshot.val().freq;
        var startTime = snapshot.val().startTime;

        console.log(trainName);
        console.log(dest);
        console.log(startTime);
        console.log(freq);

        calculateNextTrain(startTime, freq);

        // update the table
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(dest),
            $("<td>").text(freq),
            $("<td>").text(moment(nextTrain).format('LT')),
            $("<td>").text(tMinutesTillTrain)
        );
        $("#trainTable").append(newRow);

        // clear out the input field
        $("#trainNameId").val("");
        $("#destinationNameId").val("");
        $("#firstTrainTimeId").val("");
        $("#frequencyTimeId").val("");
    })

    $("#addTrainId").on("click", function (event) {
        event.preventDefault();

        // get user input
        var trainName = $("#trainNameId").val().trim();
        var destination = $("#destinationNameId").val().trim();
        var startTime = $("#firstTrainTimeId").val();
        var freq = $("#frequencyTimeId").val();

        var trainInfo = {
            trainName: trainName,
            destination: destination,
            startTime: startTime,
            freq: freq
        };

        // Uploads employee data to the database
        database.ref("/trains").push(trainInfo);

        // calculate the field 

    })
});