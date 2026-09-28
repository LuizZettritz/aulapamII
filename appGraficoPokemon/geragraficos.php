<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "pokemonbd";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha na conexão com o banco de dados."]);
    exit;
}

$sql = "SELECT id, nome, votos AS valor FROM pokemon ORDER BY votos DESC";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao consultar os dados."]);
    $conn->close();
    exit;
}

$dados = [];

while ($row = $result->fetch_assoc()) {
    $dados[] = $row;
}

echo json_encode($dados, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
