

// Save data to file functions
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
      console.log(response);
      console.log("yes");// Log the response from the PHP script
      // Log the response from the PHP script
    },
    error: function(xhr, status, error) {
      console.error(error); // Log any errors that occur
    }
  });
}

