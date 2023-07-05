function saveData(name, data){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'Tools/write_data.php'); // 'write_data.php' is the path to the php file described above.
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({filedata: data}));
}