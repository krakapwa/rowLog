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
}

// this is called when a successful transaction happens
function successCallBack() {
    console.log("DEBUGGING: success");
}

function successUploadWUP() {
    alert('Your data have been sent!');
    window.location = 'newEntry.html';
}

function nullHandler(){};

// called when the application loads
function onWUPLoad(){

    document.addEventListener("deviceready", this.onDeviceReady, false);

    //db = openDatabase(shortName, version, displayName,maxSize);

    console.log('creating table WUP');

    db = openDatabase(shortName, version, displayName,maxSize);
    // this line will try to create the table WUP in the database just created/openned
    db.transaction(function(tx){

        //tx.executeSql( 'DROP TABLE IF EXISTS WUP',nullHandler,nullHandler);

        tx.executeSql( 'CREATE TABLE IF NOT EXISTS WUP(WUPId INTEGER NOT NULL PRIMARY KEY, inputDate TEXT NOT NULL, inputTime TEXT NOT NULL, RPE TEXT NOT NULL, HRRWUP TEXT NOT NULL, HRR60 TEXT NOT NULL)',[],nullHandler,errorHandler);
    },errorHandler,successCallBack);


    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM WUP;', [],
                function(transaction, result) {
                    today = getDateStr();
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            thisDate = row.inputDate;
                            if(today == thisDate){
                                console.log("Restoring values...");
                               document.getElementById("txHRRWUP").value = row.HRRWUP;
                               document.getElementById("txHRR60").value = row.HRR60;
                               document.getElementById("txRPE").value = row.RPE;
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
    //Need to get user name for csv file creation
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM User;', [],
                function(transaction, result) {
                    if (result != null && result.rows != null) {
                        setUserName(result);
                    }
                },errorHandler);
    },errorHandler,nullHandler);

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
    userFileObject = fileEntry;

}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// list the values in the database to the screen using jquery to update the #lbWUP element
function checkWUPValues() {

    if( $('#txHRRWUP').val().length!=0 || $('#txHRR60').val().length!=0 || $('#txRPE').val().length!=0 ){
        if( isNumber($('#txHRRWUP').val())  && isNumber($('#txHRR60').val()) && isNumber($('#txRPE').val())){
            if( $('#txHRRWUP').val()>0 && $('#txHRRWUP').val()<200 && $('#txHRR60').val()>0 && $('#txHRR60').val()<110 && $('#txRPE').val()>0 && $('#txRPE').val()<11) { // Check isnumber
            return 1;
        }else{
            return 2;
        }
    }
        return 0;
    }
    else{
        return 0;
    }
    return;
}

// this is the function that puts values into the database using the values from the text boxes on the screen
function addWUPToDB() {
    console.log('adding WUP values to DB');
    //if(checkWUPValues()) {
        db.transaction(function(transaction) {
            transaction.executeSql('INSERT OR REPLACE INTO WUP(WUPId, inputDate, inputTime, RPE, HRRWUP, HRR60) VALUES ((select WUPId from WUP where inputDate = ?),?,?,?,?,?)', [getDateStr(), getDateStr(), getTimeStr(), $('#txRPE').val(), $('#txHRRWUP').val(), $('#txHRR60').val()],

                    nullHandler,errorHandler);
        });


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

function confirmWUP(){

    addWUPToDB(); 

    if(navigator.connection.type == Connection.NONE){
        alert('Your device is not connected to the internet. Please activate mobile data in your settings and try again.');
    }
    else{
        if(checkWUPValues()==1){
            //document.getElementById("newEntryWUP").innerHTML="Please wait...";
            uploadCsvWUP();
        }
        if(checkWUPValues()==2){
            alert("Check your data: Heart rate must be between 0 and 110, RPE between 0 and 10.");
        }
        if(checkWUPValues()==0){
            alert("Your data have been saved. They will be sent when all fields are non-empty.");
        }
    }
}

function uploadCsvWUP(){


    console.log('makeCsvWUP');

    $("#pleasewait").dialog({
        autoOpen: false,
        modal: true,
        dialogClass: "dlg-no-close"
    });

    csvData = "inputDate" + "," + "inputTime" + "," + "RPE" + "," + "HRRWUP" + "," + "HRR60" + "\n";
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM WUP;', [],
                function(transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            csvData += row.inputDate + ',' + row.inputTime + ',' + row.RPE + ',' + row.HRRWUP + ',' + row.HRR60 + '\n';
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

    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=userFileObject.toURL();
    options.mimeType="text/csv";
    //options.headers = {
    //    Connection: "close"
    //}
    //options.chunkedMode = false;

    var params = new Object();
    params.newFileName = firstName + lastName + getDateStr() +'_'+ 'WUP.csv';
    options.params = params;

    console.log(options);

    var ft = new FileTransfer();
    console.log('Uploading: ' + userFileObject.toURL());
    console.log('With newFileName: ' + options.params.newFileName);
    ft.upload(options.fileName, encodeURI("https://roeienopdebosbaan.nl/upload.php"), successUploadWUP, errorHandler, options,true);

}

function onFSFail(error) {
    console.log('Error: ' + error.message + ' code: ' + error.code);;
}

function fileWrite() {
    userFileObject.createWriter(gotFileWriter, onFSFail);
}
