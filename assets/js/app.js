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
var trainRef = database.ref('/trains');

$(document).ready(function () {

    function updateTrainArrival() {      

        trainRef.on('value', function(snapshot) {
            var i=1;
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                var trainName = childData.trainName;
                var dest = childData.destination;
                var freq = childData.freq;
                var startTime = childData.startTime;
    
                calculateNextTrain(startTime, freq);
                var cell3 = $('#trainTable tr:eq(' + i + ') td:eq(' + 3 + ')');
                cell3.text(moment(nextTrain).format('LT'));
                var cell4 = $('#trainTable tr:eq(' + i + ') td:eq(' + 4 + ')');
                cell4.text(tMinutesTillTrain);
                i += 1;
            });
        });
    }

    trainRef.on("child_added", function (snapshot) {

        // Console.loging the last user's data
        var trainName = snapshot.val().trainName;
        var dest = snapshot.val().destination;
        var freq = snapshot.val().freq;
        var startTime = snapshot.val().startTime;

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

        // Uploads new train to the database
        trainRef.push(trainInfo);
    })

    function calculateNextTrain(firstTime, tFrequency) {
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    
        // Current Time
        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    
        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
    
        // Minute Until Train
        tMinutesTillTrain = tFrequency - tRemainder;
    
        // Next Train
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
    }
    
    function updateClock() {
        var clockTime = moment().format("HH:mm:ss");      
         $('#currentTimeId').text(clockTime);
    }

    updateTrainArrival();
    var myVar = setInterval(updateTrainArrival, 60000);
    var currentT = setInterval(updateClock, 1000);
});