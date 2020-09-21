<?php

require_once __DIR__ . '/config.php';


class restAPI {

    function fetchAll() {
        $db = new Connect();
        $data = $db->prepare('SELECT * FROM products ORDER BY id');
        $data->execute();
        $products = [];

        while($OutputData = $data -> fetch(PDO::FETCH_ASSOC)) {
            $products[] = array(
                'date' => $OutputData['date'],
                'name' => $OutputData['name'],
                'count' => $OutputData['quantity'],
                'distance' => $OutputData['distance'],
            );
        }

        return json_encode($products);
    }

}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
echo (new restAPI())->fetchAll();