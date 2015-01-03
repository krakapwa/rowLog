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

var lcStorage;


// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
    console.log('Error: code: ' + error.code);
}

// this is called when a successful transaction happens
function successCallBack() {
    console.log("DEBUGGING: success");
}

function nullHandler(){};

// called when the application loads
function onUserInputLoad(){

    document.addEventListener("deviceready", this.onDeviceReady, false);

}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function createEvents(){

    var now = new Date();
    var startDate = now; // beware: month 0 = january, 11 = december
    var endDate = new Date(2015,05,10,0,0,0,0,0);
    var title = "My nice event";
    var location = "Home";
    var notes = "Some notes about this event.";
    var success = function(message) { alert("Success: " + JSON.stringify(message)); };
    var error = function(message) { alert("Error: " + message); };


  window.plugins.calendar.createEvent(title,location,notes,startDate,startDate,success,error);
}

// list the values in the database to the screen using jquery to update the #lbUsers element
function checkUserValues() {

    $('#lbUsers').html('');

    if( ($('#txDOBday').val().length == 2) && isNumber($('#txDOBday').val()) && ($('#txDOBmonth').val().length == 2)  &&
            isNumber($('#txDOBmonth').val()) && isNumber($('#txDOByear').val()) && ($('#txDOByear').val().length == 4) && ($('#txFirstName').val().length > 0) && ($('#txLastName').val().length > 0) ){

        firstName = $('#txFirstName').val();
        lastName = $('#txLastName').val();

        if(($('#txPassword').val() == "roeienopdebosbaan")){

            $('#lbUsers').append('<br>' + 'Please double check your answers. If something is wrong, click ' + '<a href="index.html">Reset</a>');
            $('#lbUsers').append('<br>' + 'Click confirm to proceed');
            document.getElementById("addUserButton").disabled = true;
            document.getElementById("confirmUserButton").disabled = false;
        }
        else{

            $('#lbUsers').append('<br>' + 'Password is wrong, check again.');
        }

        return true;


    } else{

        $('#lbUsers').append('<br>' + 'Date of birth must of have 2 digits for day, 2 digits for month and 4 digits for year. First name and last name must be non-empty');
        document.getElementById("addUserButton").disabled = false;

        return false;
    }

}

// this is the function that puts values into the database using the values from the text boxes on the screen
function addUserToDB() {


    if(checkUserValues()) {

    // this is the section that actually inserts the values into the User table
        db.transaction(function(transaction) {
            transaction.executeSql('INSERT INTO User(FirstName, LastName, DOBday, DOBmonth, DOByear) VALUES (?,?,?,?,?)',[$('#txFirstName').val(), $('#txLastName').val(), $('#txDOBday').val(), $('#txDOBmonth').val(), $('#txDOByear').val()],
                    nullHandler,errorHandler);
        });

        csvData = 'FirstName, LastName, DOBday, DOBmonth, DOByear\n';
        csvData += $('#txFirstName').val() + ',' + $('#txLastName').val() + ',' + $('#txDOBday').val() + ',' + $('#txDOBmonth').val() + ',' + $('#txDOByear').val() + '\n';
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
    //countRows('User',console.log);
    firstName = $('#txFirstName').val();
    lastName = $('#txLastName').val();
    uploadCsvUser();
    createEvents();
    alert('Event added.');
    //window.location = 'newEntry.html';
}

function uploadCsvUser(){


    console.log('makeCsvUser');

    fileWrite(); 
    console.log(userFileObject);
    //uploadFile(userFileObject);
}

function uploadFile(userFileObject){

    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM User;', [],
                function(transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                        }

                        firstName = row.FirstName;
                        lastName = row.LastName;
                        console.log(firstName);
                        console.log(lastName);

                        var options = new FileUploadOptions();
                        options.fileKey="file";
                        options.fileName=userFileObject.toURL();
                        options.mimeType="text/csv";

                        var params = new Object();

                        params.newFileName = firstName + lastName + getDateStr() + 'userData.csv';
                        options.params = params;

                        localStorage.setItem("myOptions",JSON.stringify(options));
                        myOptions  = JSON.parse(localStorage.getItem("myOptions"));
                        console.log(myOptions);

                        var ft = new FileTransfer();
                        console.log('Uploading: ' + userFileObject.toURL());
                        console.log('With newFileName: ' + options.newFileName);
                        ft.upload(userFileObject.toURL(), encodeURI("http://roeienopdebosbaan.nl/upload.php"), successCallBack, errorHandler, options);
                    }

                },errorHandler);
    },errorHandler,nullHandler);
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

function onFSWin (fileSystem) {
    console.log('onFSWin');

    // Make file name
    fName =  "userData.csv";
    console.log(fName);
    fileSystem.root.getFile(fName, {create: true, exclusive: false}, onGetFileWin, onFSFail);
    console.log( "Got the file system: "+fileSystem.name +" " +"root entry name is "+fileSystem.root.name );
}

function onGetFileWin(fileEntry) {
    console.log('onGetFileWin');
    //fileEntry.createWriter(gotFileWriter, onFSFail);
    userFileObject = fileEntry;

}

function gotFileWriter(writer) {

    //db = openDatabase(shortName, version, displayName,maxSize);
    console.log('gotFileWriter');
    //csvData = "FirstName" + "," + "LastName" + "," + "DOBday" + "," + "DOBmonth" + "," + "DOByear" + "\n";
    console.log('writing:');
    console.log(csvData);
    // Create a new Blob and write it 
    var blob = new Blob([csvData], {type: 'text/plain'});

    writer.write(blob);
    uploadFile(userFileObject);

    // writer.onwriteend = function(evt) {
    //           console.log('File contents have been written. File path: ' + userFileObject.fullPath);
    //               var reader = new FileReader();
    //               reader.readAsText(userFileObject);
    //               reader.onload = function(evt) {
    //                   console.log('File contents:'
    //                       + evt.target.result);
    //               };
    //           };

}

function onFSFail(error) {
    console.log('Error: ' + error.message + ' code: ' + error.code);;
}

function onDeviceReady() {
    console.log('onDeviceReady');

    document.getElementById("confirmUserButton").disabled = true;
    // This alert is used to make sure the application is loaded correctly
    // you can comment this out once you have the application working
    console.log('opening database');
    db = openDatabase(shortName, version, displayName,maxSize);
    //if (!window.openDatabase) {
        // not all mobile devices support databases  if it does not, thefollowing alert will display
        // indicating the device will not be albe to run this application
       // alert('Databases are not supported in this browser.');
        //return;
    //}, 


    console.log('creating table User');
    // this line will try to create the table User in the database just created/openned
    db.transaction(function(tx){

        // you can uncomment this next line if you want the User table to be empty each time the application runs
        //tx.executeSql( 'DROP TABLE IF EXISTS User',nullHandler,nullHandler);

        tx.executeSql( 'CREATE TABLE IF NOT EXISTS User(UserId INTEGER NOT NULL PRIMARY KEY, FirstName TEXT NOT NULL, LastName TEXT NOT NULL, DOBday TEXT NOT NULL, DOBmonth TEXT NOT NULL, DOByear TEXT NOT NULL)',[],nullHandler,errorHandler);
    },errorHandler,successCallBack);

    // Check if User infos are already done
    var table = 'User';
    countRows(table,function(result_count){
        console.log('There are ' + result_count + ' rows in table ' + table );
        if(result_count > 0){
            confirmUser();
        }	
    });

    if (window.webkitRequestFileSystem) {
        console.log('webkit request file system');
        //window.webkitRequestFileSystem(window.PERSISTENT, 1024*1024,onFSWin,onFSFail);
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
                },errorHandler);
    },errorHandler,nullHandler);
}

function fileWrite() {
    userFileObject.createWriter(gotFileWriter, onFSFail);
} 
