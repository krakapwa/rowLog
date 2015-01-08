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
function onNewEntryLoad(){


    document.addEventListener("deviceready", this.onDeviceReady, false);

}

function onDeviceReady() {
    console.log('onDeviceReady');

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

}

function exitFromApp()
{
    navigator.app.exitApp();
}

function dropTables() {
    db.transaction(function(tx){

        tx.executeSql( 'DROP TABLE IF EXISTS User',nullHandler,nullHandler);
        tx.executeSql( 'DROP TABLE IF EXISTS Daily',nullHandler,nullHandler);
        tx.executeSql( 'DROP TABLE IF EXISTS WUP',nullHandler,nullHandler);
        tx.executeSql( 'DROP TABLE IF EXISTS Survey',nullHandler,nullHandler);


    },errorHandler,successCallBack);

}

// this is called when a successful transaction happens
function successCallBack() {
        window.location = 'index.html';
}
