// global variables
//
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;

var userFileObject;
var csvData;
var firstName;
var lastName;


function errorHandler(transaction, error) {
    alert('Error: code: ' + error.code);
}

function nullHandler() {
}

function successCallBack() {
    console.log("DEBUGGING: success");
}

function successUploadUser() {
    //createEvents();
    window.location = 'warningEvents.html';
}

function nullHandler(){};

// called when the application loads
function onUserInputLoad(){

    $('#index').hide();
    document.addEventListener("deviceready", this.onDeviceReady, false);


    console.log('opening database');
    db = openDatabase(shortName, version, displayName,maxSize);

    console.log('creating table User');
    // this line will try to create the table User in the database just created/openned
    db.transaction(function(tx){

        // you can uncomment this next line if you want the User table to be empty each time the application runs
        //tx.executeSql( 'DROP TABLE IF EXISTS User',nullHandler,nullHandler);

        tx.executeSql( 'CREATE TABLE IF NOT EXISTS User(UserId INTEGER NOT NULL PRIMARY KEY, FirstName TEXT NOT NULL, LastName TEXT NOT NULL, DOBday TEXT NOT NULL, DOBmonth TEXT NOT NULL, DOByear TEXT NOT NULL)',[],nullHandler,errorHandler);
    },errorHandler,successCallBack);

}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function errorEvents(){
    alert('calendar problem');
}
function createEvents(){

    var startDate = new Date();
    startDate.setHours(9);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
	var endDate = new Date();
	var endDateRec = new Date();
    endDate.setHours(9);
    endDate.setMinutes(30);
    endDate.setSeconds(0);

    var title = "rowLog: Fill-in Daily heart rate and RPE";
    var loc = "";
    var notes = "";
    var error = function(message) { alert("Error: " + message); };

    var success = function(message) { 
        console.log('Success createEvents');
        //alert("Success: " + JSON.stringify(message));
    };

	//add event from today till today+14days
	console.log(startDate);
	endDateRec.setDate(startDate.getDate() + 15);
        console.log(endDate);
	console.log(endDateRec);

	var calOptions = window.plugins.calendar.getCalendarOptions();
	calOptions.recurrence = "daily"; // supported are: daily, weekly, monthly, yearly
	calOptions.recurrenceEndDate = endDateRec; // leave null to add events into infinity and beyond
	window.plugins.calendar.createEventWithOptions(title,loc,notes,startDate,startDate,calOptions,success,errorEvents);
        

}

// list the values in the database to the screen using jquery to update the #lbUsers element
function checkUserValues() {


    if( ($('#txDOBday').val().length == 2) && isNumber($('#txDOBday').val()) && ($('#txDOBmonth').val().length == 2)  &&
            isNumber($('#txDOBmonth').val()) && isNumber($('#txDOByear').val()) && ($('#txDOByear').val().length == 4) && ($('#txFirstName').val().length > 0) && ($('#txLastName').val().length > 0) ){

        firstName = $('#txFirstName').val();
        lastName = $('#txLastName').val();

        if(($('#txPassword').val() == "roeienopdebosbaan")){

            $('#lbUsers').html('');
            $("#addUserButtonId").hide();
            $("#confirmUserButtonId").show();
            $("#txPassword").prop('disabled', true);
            $("#txFirstName").prop('disabled', true);
            $("#txLastName").prop('disabled', true);
            $("#txDOBday").prop('disabled', true);
            $("#txDOBmonth").prop('disabled', true);
            $("#txDOByear").prop('disabled', true);
            $('#lbUsers').append('Please double check your answers. If something is wrong, click  Reset. Click "Proceed to forms" to continue.<br><br>');
        }

        else{

            $('#lbUsers').html('');
            $('#lbUsers').append('<br>' + 'Password is wrong, check again.');
        }

        return true;


    } else{

        $('#lbUsers').html('');
        $('#lbUsers').append('<br>' + 'Date of birth must of have 2 digits for day, 2 digits for month and 4 digits for year. First name and last name must be non-empty');
            $("#addUserButtonId").show();

        return false;
    }

}

// this is the function that puts values into the database using the values from the text boxes on the screen
function addUserToDB(callback) {

    //firstName = $('#txFirstName').val();
    //lastName = $('#txLastName').val();

    if(checkUserValues()) {

        // this is the section that actually inserts the values into the User table
        db.transaction(function(transaction) {
            transaction.executeSql('INSERT INTO User(FirstName, LastName, DOBday, DOBmonth, DOByear) VALUES (?,?,?,?,?)',[$('#txFirstName').val(), $('#txLastName').val(), $('#txDOBday').val(), $('#txDOBmonth').val(), $('#txDOByear').val()],
                    nullHandler,errorHandler);
        });

        csvData = 'FirstName, LastName, DOBday, DOBmonth, DOByear\n';
        csvData += $('#txFirstName').val() + ',' + $('#txLastName').val() + ',' + $('#txDOBday').val() + ',' + $('#txDOBmonth').val() + ',' + $('#txDOByear').val() + '\n';

        if (callback) {
            callback();
        }
    }
}

function countRows(test, callBack){
    var x;
    db.transaction(function (tx) {
        $yoursql = 'SELECT * FROM  "'+test+'" ';
        tx.executeSql($yoursql, [], function (tx, results) {
            x = results.rows.length;
            callBack(x);                
        });
    });
}

function confirmUser(){

    if(navigator.connection.type == Connection.NONE){
        alert('Your device is not connected to the internet. Please activate mobile data in your settings and try again.');
    }
    else {
        
        //addUserToDB(uploadCsvUser);
        uploadCsvUser();
    }

    return;

    //document.getElementById("index").innerHTML="Please wait...";
}

function uploadCsvUser(){


    console.log('makeCsvUser');

    $("#pleasewait").dialog({
        autoOpen: true,
        modal: true,
        dialogClass: "dlg-no-close"
    });

    fileWrite(); 
    console.log(userFileObject);
}


function getDateStr(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = dd +'_'+ mm +'_'+yyyy;
    return today;

}

function onFSWin(fileSystem) {
    console.log('onFSWin');

    // Make file name
    fName =  "userData.csv";
    console.log(fName);
    fileSystem.root.getFile(fName, {create: true, exclusive: false}, onGetFileWin, onFSFail);
    console.log( "Got the file system: "+fileSystem.name +" " +"root entry name is "+fileSystem.root.name );
}

function onGetFileWin(fileEntry) {
    alert('onGetFileWin');
    userFileObject = fileEntry;
}

function gotFileWriter(writer) {

    //db = openDatabase(shortName, version, displayName,maxSize);
    console.log('gotFileWriter');
    //csvData = "FirstName" + "," + "LastName" + "," + "DOBday" + "," + "DOBmonth" + "," + "DOByear" + "\n";
    console.log('writing:');
    alert(csvData);
    // Create a new Blob and write it 
    var blob = new Blob([csvData], {type: 'text/plain'});

    writer.write(blob);

                        console.log(firstName);
                        console.log(lastName);

                        var options = new FileUploadOptions();
                        options.fileKey="file";
                        options.fileName=userFileObject.toURL();
                        options.mimeType="text/csv";
                        options.chunkedMode = false;

                        var params = new Object();
                        params.newFileName = firstName + lastName + getDateStr() +'_' + 'UserData.csv';
                        options.params = params;

                        console.log(options);

                        var ft = new FileTransfer();
                        console.log('Uploading: ' + userFileObject.toURL());
                        alert('With newFileName: ' + options.params.newFileName);
                        ft.upload(userFileObject.toURL(), encodeURI("http://roeienopdebosbaan.nl/upload.php"), successUploadUser, errorHandler, options,true);

}

function onFSFail(error) {
    console.log('Error: ' + error.message + ' code: ' + error.code);;
}

function onDeviceReady() {
    console.log('onDeviceReady');
    $('#confirmUserButtonId').hide();

    if (window.webkitRequestFileSystem) {
        console.log('webkit request file system');
        window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onFSWin, onFSFail); 
        }, function(e) {
            console.log('Error', e); 
        });
    } 
    else {
        console.log('webkit request file system else');
        //window.requestFileSystem(window.PERSISTENT, 1024*1024, onFSWin, onFSFail);
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSWin, onFSFail); 
    }


    //Check if user data has already been written, if yes, move to newEntry.html
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM User;', [],
                function(transaction, result) {
                    if (result.rows.length>0) {
                            console.log('user infos OK. Moving to newEntry.html');
                            window.location = 'newEntry.html';
                        }                     
                    else{
                        
                        $('#index').show();
                    }
                },errorHandler);
    },errorHandler,nullHandler);


}

function resetClick() {

        console.log('RESETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt');
        dropTables();
}
function fileWrite() {
    userFileObject.createWriter(gotFileWriter, onFSFail);
} 

function dropTables() {
    db.transaction(function(tx){

        tx.executeSql( 'DROP TABLE IF EXISTS User',nullHandler,nullHandler);
        tx.executeSql( 'DROP TABLE IF EXISTS Daily',nullHandler,nullHandler);
        tx.executeSql( 'DROP TABLE IF EXISTS WUP',nullHandler,nullHandler);
        tx.executeSql( 'DROP TABLE IF EXISTS Survey',nullHandler,nullHandler);

    },errorHandler,successDropTable);

}

function successDropTable(){

        window.location = 'index.html';
}
