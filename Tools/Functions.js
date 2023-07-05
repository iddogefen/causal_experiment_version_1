
function save_server_data(name, data) {
  var xhr = new XMLHttpRequest();
  //xhr.addEventListener("load", onComplete);
  xhr.open('POST', 'Tools/write_data.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    filename: name,
    filedata: data
  }));
}
/*
function saveData(name, data){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'Tools/write_data_1.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({filedata: data}));
}


function saveData(name, data){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'Tools/write_data.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({filedata: data}));
}

// call the saveData function after the experiment is over



// Save data to file functions


function save_local_data(name, data){
   var a         = document.createElement('a');
   a.href        = 'data:attachment/csv,' +  encodeURIComponent(data);
   a.target      = '_blank';
   a.download    = name;
   document.body.appendChild(a);
   a.click();
}



*/
function save_local_data(filename, data){
  $.ajax({
    type: 'POST',
    url: 'http://localhost:8000/Tools/write_data_local.php', // Replace this URL with the URL of your PHP script
    data: {
      data: data,
      filename: filename
    },
    success: function(response) {
      console.log(response); // Log the response from the PHP script
    },
    error: function(xhr, status, error) {
      console.error(error); // Log any errors that occur
    }
  });
}


function save_local_data_2(filename, data){
  $.ajax({
    type: 'POST',
    url: 'Tools/write_data_local.php', // Replace this URL with the URL of your PHP script
    data: {
      data: data,
      filename: filename
    },
    success: function(response) {
      console.log(response);
      console.log("yes");// Log the response from the PHP script
    },
    error: function(xhr, status, error) {
      console.error(error); // Log any errors that occur
    }
  });
}


// Functions for loading the CSV files that contained optimized jitter durations
function csvJSON(csv) {
   var lines = csv.split('\n');
   lines.pop(); //remove last line
   var result = [];
   var headers = lines[0].split(',');
   for (var i = 1; i < lines.length; i++) {
     var obj = {};
     var currentline = lines[i].split(',');
     for (var j = 0; j < headers.length; j++) {
         curr_header = headers[j].split('"').join('');
         obj[curr_header] = currentline[j].split('"').join('');
       }
     result.push(obj);
   }
   return result;
}

function readTextFile(file, callback) {
     var rawFile = new XMLHttpRequest();
     rawFile.overrideMimeType("application/json");
     rawFile.open("GET", file, false);
     rawFile.onreadystatechange = function() {
         if (rawFile.readyState === 4 && rawFile.status == "200") {
             callback(rawFile.responseText);
         }
     }
     rawFile.send(null);
}
