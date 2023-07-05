
function save_server_data(name, data) {
  var xhr = new XMLHttpRequest();
  //xhr.addEventListener("load", onComplete);
  xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    filename: name,
    filedata: data
  }));
}

