<?php
function get_sequences($head) {
    $sequences = [];
    $dirs = glob($head . '/*', GLOB_ONLYDIR);
    if (!$dirs) {
        return ["error" => "No directories found in path: $head"];
    }
    foreach ($dirs as $dir) {
        $subdirs = glob($dir . '/*', GLOB_ONLYDIR);
        if ($subdirs) {
            $sequences[] = $subdirs;
        }
    }
    return $sequences;
}

$seqs = get_sequences("images");
if (empty($seqs)) {
    error_log("No sequences found in 'images'.");
    echo json_encode(["error" => "No sequences found."]);
    exit;
}
error_log(print_r($seqs, true));
echo json_encode($seqs);
?>
