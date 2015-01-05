<?php
print_r($_FILES);
$new_csv_file = "newcsv.csv";
move_uploaded_file($_FILES["file"]["tmp_name"], "/srv/www/upload/".$new_csv_file);
?> 
