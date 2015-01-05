// global variables
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;

var userFileObject;
var csvData;
var firstName;
var lastName;

// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
    console.log('Error: code: ' + error.code);
<<<<<<< HEAD
=======

>>>>>>> 962ecd6cdb7bca33a44c0ccb94648985bdb6593f
}

// this is called when a successful transaction happens
function successCallBack() {
    console.log("DEBUGGING: success");
}

function nullHandler(){};

// called when the application loads
function onDailyLoad(){

    document.addEventListener("deviceready", this.onDeviceReady, false);

    document.getElementById("confirmDailyButton").disabled = false;
    //db = openDatabase(shortName, version, displayName,maxSize);

    console.log('creating table Daily');

    db = openDatabase(shortName, version, displayName,maxSize);
    // this line will try to create the table Daily in the database just created/openned
    db.transaction(function(tx){

        //tx.executeSql( 'DROP TABLE IF EXISTS Daily',nullHandler,nullHandler);

        tx.executeSql( 'CREATE TABLE IF NOT EXISTS Daily(DailyId INTEGER NOT NULL PRIMARY KEY, inputDate TEXT NOT NULL, inputTime TEXT NOT NULL, HeartRate TEXT NOT NULL, RPE TEXT NOT NULL, Weight TEXT NOT NULL, Injury TEXT NOT NULL)',[],nullHandler,errorHandler);
    },errorHandler,successCallBack);


    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM Daily;', [],
                function(transaction, result) {
                    today = getDateStr();
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            thisDate = row.inputDate;
                            if(today == thisDate){
                                console.log("Restoring values...");
                               document.getElementById("txHeartRate").value = row.HeartRate;
                               document.getElementById("txRPE").value = row.RPE;
                               document.getElementById("txWeight").value = row.Weight;
                               document.getElementById("txInjury").value = row.Injury;
                            }
                        }

                    }

                },errorHandler);
    },errorHandler,nullHandler);

}

function onDeviceReady() {
    console.log('onDeviceReady');

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
<<<<<<< HEAD
=======

>>>>>>> 962ecd6cdb7bca33a44c0ccb94648985bdb6593f
}

function onFSWin (fileSystem) {
    console.log('onFSWin');

    // Make file name
    fName =  "userData.csv";
    fileSystem.root.getFile(fName, {create: true, exclusive: false}, onGetFileWin, onFSFail);
    console.log( "Got the file system: "+fileSystem.name +" " +"root entry name is "+fileSystem.root.name );
}

function onGetFileWin(fileEntry) {
    console.log('onGetFileWin');
    //fileEntry.createWriter(gotFileWriter, onFSFail);
    userFileObject = fileEntry;

}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// list the values in the database to the screen using jquery to update the #lbDaily element
function checkDailyValues() {

    if( $('#txHeartRate').val().length!=0  || $('#txRPE').val().length!=0 || $('#txWeight').val().length!=0 ){ //Check emptiness
        if( isNumber($('#txHeartRate').val())  && isNumber($('#txRPE').val()) && isNumber($('#txWeight').val()) ){ // Check isnumber
            if( $('#txHeartRate').val()>0 && $('#txHeartRate').val()<110 && $('#txRPE').val()>0 && $('#txRPE').val()<11 && $('#txWeight').val()>0 && $('#txWeight').val()<200) { // Check isnumber
                return 1;
            }
                return 2; //Wrong numbers
        }
        return 0; //Not numbers
    }
    else{
        return 0; //Empty fields
    }
    return;
}

// this is the function that puts values into the database using the values from the text boxes on the screen
function addDailyToDB() {

    //if(checkDailyValues()) {
        db.transaction(function(transaction) {
            transaction.executeSql('INSERT OR REPLACE INTO Daily(DailyId, inputDate, inputTime, HeartRate, RPE, Weight, Injury) VALUES ((select DailyId from Daily where inputDate = ?),?,?,?,?,?,?)', [getDateStr(), getDateStr(), getTimeStr(), $('#txHeartRate').val(), $('#txRPE').val(), $('#txWeight').val(), $('#txInjury').val()],

                    nullHandler,errorHandler);
        });

        //alert("Your data has been saved.");

        //Need to get user name for csv file creation
        db.transaction(function(transaction) {
            transaction.executeSql('SELECT * FROM User;', [],
                    function(transaction, result) {
                        if (result != null && result.rows != null) {
                            setUserName(result);
                        }
                    },errorHandler);
        },errorHandler,nullHandler);
    //}
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

function setUserName(result){
    
    for (var i = 0; i < result.rows.length; i++) {
        var row = result.rows.item(i);
    }
    firstName = row.FirstName;
    lastName = row.LastName;

    console.log('Got firstName: ' + firstName + ' lastName ' + lastName);
}

function confirmDaily(){

    addDailyToDB(); 

    if(checkDailyValues()==1){
        uploadCsvDaily();
        alert("Data has been sent.");
        window.location = 'newEntry.html';
    }
    if(checkDailyValues()==2){
        alert("Check your data: Heart rate must be between 0 and 110, RPE between 0 and 10, Weight between 0 and 200.");
    }
    if(checkDailyValues()==0){
        alert("Your values have been saved. When the remaining empty fields are completed, click save/send again to send your data.");
    }
}

function uploadCsvDaily(){


    console.log('makeCsvDaily');

    csvData = "inputDate" + "," + "inputTime" + "," + "HeartRate" + "," + "RPE" + "," + "Weight" + "," + "Injury" + "\n";
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM Daily;', [],
                function(transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            csvData += row.inputDate + ',' + row.inputTime + ',' + row.HeartRate + ',' + row.RPE + ',' + row.Weight + ',' + row.Injury + '\n';
                        }

                        fileWrite();
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


function getTimeStr(){
    var today = new Date();
    var hh = today.getHours();
    var mm = today.getMinutes(); 
    var ss = today.getSeconds();


    now = hh +'_'+ mm +'_'+ss;
    return now;
}

function gotFileWriter(writer) {

    //db = openDatabase(shortName, version, displayName,maxSize);
    console.log('gotFileWriter');
    //csvData = "FirstName" + "," + "LastName" + "," + "DOBday" + "," + "DOBmonth" + "," + "DOByear" + "\n";
    console.log('writing:');
    console.log(csvData);
    // Create a new Blob and write it 
    var blob = new Blob([csvData], {type: 'text/plain'});

    writer.write(blob)

    options  = JSON.parse(localStorage.getItem("myOptions"));
    console.log(options);
    options.params.newFileName = firstName + lastName + getDateStr() +'_'+ getTimeStr() + 'dailyData.csv';

    var ft = new FileTransfer();
    console.log('Uploading: ' + userFileObject.toURL());
    console.log('With newFileName: ' + options.params.newFileName);
    ft.upload(options.fileName, encodeURI("http://roeienopdebosbaan.nl/upload.php"), successCallBack, errorHandler, options);

}

function onFSFail(error) {
    console.log('Error: ' + error.message + ' code: ' + error.code);;
}

function fileWrite() {
    userFileObject.createWriter(gotFileWriter, onFSFail);
}
