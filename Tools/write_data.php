<?php
$post_data = json_decode(file_get_contents('php://input'), true);
// the directory "data" must be writable by the server
<<<<<<< HEAD
$name = "../Data/".$post_data[''].".csv";
=======
$name = "../Data/".$post_data['filename'].".csv";
>>>>>>> 93a8be2bbb904d704099cfdacc354f4d1d25950f
$data = $post_data['filedata'];
// write the file to disk
file_put_contents($name, $data);
?>
