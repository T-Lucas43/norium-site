<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['detail' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$body = file_get_contents('php://input');
if ($body === false || strlen($body) > 10240) {
    http_response_code(413);
    echo json_encode(['detail' => 'Pergunta muito grande.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!function_exists('curl_init')) {
    http_response_code(503);
    echo json_encode(['detail' => 'O chat está indisponível no momento.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$backend = 'https://norium-b7bum6defpciy.blueglacier-50a47e6c.eastus2.azurecontainerapps.io/api/public/site/nora';
$curl = curl_init($backend);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT => 32,
    CURLOPT_FOLLOWLOCATION => false,
]);

$response = curl_exec($curl);
$status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$failed = $response === false;
curl_close($curl);

if ($failed || $status < 100) {
    http_response_code(502);
    echo json_encode(['detail' => 'Não foi possível falar com a Nora agora.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($status === 404) {
    http_response_code(503);
    echo json_encode(['detail' => 'O mini chat da Nora está temporariamente indisponível enquanto o sistema é atualizado.'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code($status);
echo $response;
