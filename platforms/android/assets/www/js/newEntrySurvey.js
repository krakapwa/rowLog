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

function successUploadSurvey() {
    alert('Your data have been sent!');
    window.location = 'newEntry.html';
}

function nullHandler(){};

// called when the application loads
function onSurveyLoad(){

    document.addEventListener("deviceready", this.onDeviceReady, false);

    console.log('creating table Survey');

    db = openDatabase(shortName, version, displayName,maxSize);
    // this line will try to create the table Survey in the database just created/openned
    db.transaction(function(tx){

        //tx.executeSql( 'DROP TABLE IF EXISTS Survey',nullHandler,nullHandler);

        tx.executeSql( 'CREATE TABLE IF NOT EXISTS Survey(SurveyId INTEGER NOT NULL PRIMARY KEY, inputDate TEXT NOT NULL, inputTime TEXT NOT NULL, Q1 TEXT NOT NULL, Q2 TEXT NOT NULL, Q3 TEXT NOT NULL, Q4 TEXT NOT NULL, Q5 TEXT NOT NULL, Q6 TEXT NOT NULL, Q7 TEXT NOT NULL, Q8 TEXT NOT NULL, Q9 TEXT NOT NULL, Q10 TEXT NOT NULL, Q11 TEXT NOT NULL, Q12 TEXT NOT NULL, Q13 TEXT NOT NULL, Q14 TEXT NOT NULL, Q15 TEXT NOT NULL, Q16 TEXT NOT NULL, Q17 TEXT NOT NULL, Q18 TEXT NOT NULL, Q19 TEXT NOT NULL, Q20 TEXT NOT NULL, Q21 TEXT NOT NULL, Q22 TEXT NOT NULL, Q23 TEXT NOT NULL, Q24 TEXT NOT NULL, Q25 TEXT NOT NULL, Q26 TEXT NOT NULL, Q27 TEXT NOT NULL, Q28 TEXT NOT NULL, Q29 TEXT NOT NULL, Q30 TEXT NOT NULL, Q31 TEXT NOT NULL, Q32 TEXT NOT NULL, Q33 TEXT NOT NULL, Q34 TEXT NOT NULL, Q35 TEXT NOT NULL, Q36 TEXT NOT NULL, Q37 TEXT NOT NULL, Q38 TEXT NOT NULL, Q39 TEXT NOT NULL, Q40 TEXT NOT NULL, Q41 TEXT NOT NULL, Q42 TEXT NOT NULL, Q43 TEXT NOT NULL, Q44 TEXT NOT NULL, Q45 TEXT NOT NULL, Q46 TEXT NOT NULL, Q47 TEXT NOT NULL, Q48 TEXT NOT NULL, Q49 TEXT NOT NULL, Q50 TEXT NOT NULL, Q51 TEXT NOT NULL, Q52 TEXT NOT NULL, Q53 TEXT NOT NULL, Q54 TEXT NOT NULL, Q55 TEXT NOT NULL, Q56 TEXT NOT NULL, Q57 TEXT NOT NULL, Q58 TEXT NOT NULL, Q59 TEXT NOT NULL, Q60 TEXT NOT NULL, Q61 TEXT NOT NULL, Q62 TEXT NOT NULL, Q63 TEXT NOT NULL, Q64 TEXT NOT NULL, Q65 TEXT NOT NULL, Q66 TEXT NOT NULL, Q67 TEXT NOT NULL, Q68 TEXT NOT NULL, Q69 TEXT NOT NULL, Q70 TEXT NOT NULL, Q71 TEXT NOT NULL, Q72 TEXT NOT NULL, Q73 TEXT NOT NULL, Q74 TEXT NOT NULL, Q75 TEXT NOT NULL, Q76 TEXT NOT NULL, Q77 TEXT NOT NULL)',[],nullHandler,errorHandler);
    },errorHandler,successCallBack);

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
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSWin, onFSFail); 
    }

    //Need to get user name for csv file creation
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM User;', [],
                function(transaction, result) {
                    setUserName(result);
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

// list the values in the database to the screen using jquery to update the #lbSurvey element
function checkSurveyValues() {

    $('#lbSurvey').html('');

        $('#lbSurvey').append('<br>' + 'Please double check your answers. If something is wrong, click ' + '<a href="index.html">Reset</a>');
        $('#lbUsers').append('<br>' + 'Click confirm to proceed');

        return true;
}

// this is the function that puts values into the database using the values from the text boxes on the screen
function addSurveyToDB() {

    if(checkSurveyValues()) {
        db.transaction(function(transaction) {
            transaction.executeSql('INSERT INTO Survey(inputDate, inputTime, Q1 , Q2 , Q3 , Q4 , Q5 , Q6 , Q7 , Q8 , Q9 , Q10 , Q11 , Q12 , Q13 , Q14 , Q15 , Q16 , Q17 , Q18 , Q19 , Q20 , Q21 , Q22 , Q23 , Q24 , Q25 , Q26 , Q27 , Q28 , Q29 , Q30 , Q31 , Q32 , Q33 , Q34 , Q35 , Q36 , Q37 , Q38 , Q39 , Q40 , Q41 , Q42 , Q43 , Q44 , Q45 , Q46 , Q47 , Q48 , Q49 , Q50 , Q51 , Q52 , Q53 , Q54 , Q55 , Q56 , Q57 , Q58 , Q59 , Q60 , Q61 , Q62 , Q63 , Q64 , Q65 , Q66 , Q67 , Q68 , Q69 , Q70 , Q71 , Q72 , Q73 , Q74 , Q75 , Q76 , Q77 ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[getDateStr(), getTimeStr(), $('input[name="Q1"]:checked').val(), $('input[name="Q2"]:checked').val(), $('input[name="Q3"]:checked').val(), $('input[name="Q4"]:checked').val(), $('input[name="Q5"]:checked').val(), $('input[name="Q6"]:checked').val(), $('input[name="Q7"]:checked').val(), $('input[name="Q8"]:checked').val(), $('input[name="Q9"]:checked').val(), $('input[name="Q10"]:checked').val(), $('input[name="Q11"]:checked').val(), $('input[name="Q12"]:checked').val(), $('input[name="Q13"]:checked').val(), $('input[name="Q14"]:checked').val(), $('input[name="Q15"]:checked').val(), $('input[name="Q16"]:checked').val(), $('input[name="Q17"]:checked').val(), $('input[name="Q18"]:checked').val(), $('input[name="Q19"]:checked').val(), $('input[name="Q20"]:checked').val(), $('input[name="Q21"]:checked').val(), $('input[name="Q22"]:checked').val(), $('input[name="Q23"]:checked').val(), $('input[name="Q24"]:checked').val(), $('input[name="Q25"]:checked').val(), $('input[name="Q26"]:checked').val(), $('input[name="Q27"]:checked').val(), $('input[name="Q28"]:checked').val(), $('input[name="Q29"]:checked').val(), $('input[name="Q30"]:checked').val(), $('input[name="Q31"]:checked').val(), $('input[name="Q32"]:checked').val(), $('input[name="Q33"]:checked').val(), $('input[name="Q34"]:checked').val(), $('input[name="Q35"]:checked').val(), $('input[name="Q36"]:checked').val(), $('input[name="Q37"]:checked').val(), $('input[name="Q38"]:checked').val(), $('input[name="Q39"]:checked').val(), $('input[name="Q40"]:checked').val(), $('input[name="Q41"]:checked').val(), $('input[name="Q42"]:checked').val(), $('input[name="Q43"]:checked').val(), $('input[name="Q44"]:checked').val(), $('input[name="Q45"]:checked').val(), $('input[name="Q46"]:checked').val(), $('input[name="Q47"]:checked').val(), $('input[name="Q48"]:checked').val(), $('input[name="Q49"]:checked').val(), $('input[name="Q50"]:checked').val(), $('input[name="Q51"]:checked').val(), $('input[name="Q52"]:checked').val(), $('input[name="Q53"]:checked').val(), $('input[name="Q54"]:checked').val(), $('input[name="Q55"]:checked').val(), $('input[name="Q56"]:checked').val(), $('input[name="Q57"]:checked').val(), $('input[name="Q58"]:checked').val(), $('input[name="Q59"]:checked').val(), $('input[name="Q60"]:checked').val(), $('input[name="Q61"]:checked').val(), $('input[name="Q62"]:checked').val(), $('input[name="Q63"]:checked').val(), $('input[name="Q64"]:checked').val(), $('input[name="Q65"]:checked').val(), $('input[name="Q66"]:checked').val(), $('input[name="Q67"]:checked').val(), $('input[name="Q68"]:checked').val(), $('input[name="Q69"]:checked').val(), $('input[name="Q70"]:checked').val(), $('input[name="Q71"]:checked').val(), $('input[name="Q72"]:checked').val(), $('input[name="Q73"]:checked').val(), $('input[name="Q74"]:checked').val(), $('input[name="Q75"]:checked').val(), $('input[name="Q76"]:checked').val(), $('input[name="Q77"]:checked').val()],

                    nullHandler,errorHandler);
        });






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

function setUserName(result){
    
    for (var i = 0; i < result.rows.length; i++) {
        var row = result.rows.item(i);
    }
    firstName = row.FirstName;
    lastName = row.LastName;

    console.log('Got firstName: ' + firstName + ' lastName ' + lastName);
}

function confirmSurvey(){
    addSurveyToDB(); 
    uploadCsvSurvey();
}

function uploadCsvSurvey(){


    console.log('makeCsvSurvey');

    csvData = "inputDate,inputTime, Q1 , Q2 , Q3 , Q4 , Q5 , Q6 , Q7 , Q8 , Q9 , Q10 , Q11 , Q12 , Q13 , Q14 , Q15 , Q16 , Q17 , Q18 , Q19 , Q20 , Q21 , Q22 , Q23 , Q24 , Q25 , Q26 , Q27 , Q28 , Q29 , Q30 , Q31 , Q32 , Q33 , Q34 , Q35 , Q36 , Q37 , Q38 , Q39 , Q40 , Q41 , Q42 , Q43 , Q44 , Q45 , Q46 , Q47 , Q48 , Q49 , Q50 , Q51 , Q52 , Q53 , Q54 , Q55 , Q56 , Q57 , Q58 , Q59 , Q60 , Q61 , Q62 , Q63 , Q64 , Q65 , Q66 , Q67 , Q68 , Q69 , Q70 , Q71 , Q72 , Q73 , Q74 , Q75 , Q76 , Q77 \n";
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM Survey;', [],
                function(transaction, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            csvData += row.inputDate + ',' + row.inputTime + ',' + row.Q1 + ',' + row.Q2 + ',' + row.Q3 + ',' + row.Q4 + ',' + row.Q5 + ',' + row.Q6 + ',' + row.Q7 + ',' + row.Q8 + ',' + row.Q9 + ',' + row.Q10 + ',' + row.Q11 + ',' + row.Q12 + ',' + row.Q13 + ',' + row.Q14 + ',' + row.Q15 + ',' + row.Q16 + ',' + row.Q17 + ',' + row.Q18 + ',' + row.Q19 + ',' + row.Q20 + ',' + row.Q21 + ',' + row.Q22 + ',' + row.Q23 + ',' + row.Q24 + ',' + row.Q25 + ',' + row.Q26 + ',' + row.Q27 + ',' + row.Q28 + ',' + row.Q29 + ',' + row.Q30 + ',' + row.Q31 + ',' + row.Q32 + ',' + row.Q33 + ',' + row.Q34 + ',' + row.Q35 + ',' + row.Q36 + ',' + row.Q37 + ',' + row.Q38 + ',' + row.Q39 + ',' + row.Q40 + ',' + row.Q41 + ',' + row.Q42 + ',' + row.Q43 + ',' + row.Q44 + ',' + row.Q45 + ',' + row.Q46 + ',' + row.Q47 + ',' + row.Q48 + ',' + row.Q49 + ',' + row.Q50 + ',' + row.Q51 + ',' + row.Q52 + ',' + row.Q53 + ',' + row.Q54 + ',' + row.Q55 + ',' + row.Q56 + ',' + row.Q57 + ',' + row.Q58 + ',' + row.Q59 + ',' + row.Q60 + ',' + row.Q61 + ',' + row.Q62 + ',' + row.Q63 + ',' + row.Q64 + ',' + row.Q65 + ',' + row.Q66 + ',' + row.Q67 + ',' + row.Q68 + ',' + row.Q69 + ',' + row.Q70 + ',' + row.Q71 + ',' + row.Q72 + ',' + row.Q73 + ',' + row.Q74 + ',' + row.Q75 + ',' + row.Q76 + ',' + row.Q77 + "\n";
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

    console.log('gotFileWriter');
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
    params.newFileName = firstName + lastName + getDateStr() +'_'+ 'RestQ.csv';
    options.params = params;

    console.log(options);

    var ft = new FileTransfer();
    console.log('Uploading: ' + userFileObject.toURL());
    console.log('With newFileName: ' + options.params.newFileName);
    ft.upload(options.fileName, encodeURI("https://roeienopdebosbaan.nl/upload.php"), successUploadSurvey, errorHandler, options,true);

}

function onFSFail(error) {
    console.log('Error: ' + error.message + ' code: ' + error.code);;
}

function fileWrite() {
    userFileObject.createWriter(gotFileWriter, onFSFail);
}
