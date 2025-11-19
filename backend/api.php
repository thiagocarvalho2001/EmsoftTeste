<?php
// Configurações de Header
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// 1: Verifica se é POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método não permitido. Use POST."]);
    exit;
}

// 2: Recebe o JSOn e decodifica
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

// Verifica se a parte 2 de decodificação foi feita corretamente
if (!$data || !isset($data['cep'])) {
    http_response_code(400); 
    echo json_encode(["status" => "error", "message" => "Dados inválidos ou incompletos."]);
    exit;
}

// Caminho
$directory = '../data';
$filePath = $directory . '/ceps.json';

// 3: Verifica se a pasta existe e cria se não existir
if (!is_dir($directory)) {
    mkdir($directory, 0777, true);
}

// 4: Lê os dados existentes (se houver)
$currentData = [];
if (file_exists($filePath)) {
    $jsonContent = file_get_contents($filePath);
    $currentData = json_decode($jsonContent, true) ?? [];
}

// 5: Validação de Duplicidade
foreach ($currentData as $record) {
    if ($record['cep'] === $data['cep']) {
        http_response_code(409);
        echo json_encode([
            "status" => "error", 
            "message" => "Este CEP já está cadastrado no sistema."
        ]);
        exit;
    }
}

// 6: Prepara o novo registro com Data e Hora
$newRecord = [
    "cep" => $data['cep'],
    "endereco" => $data['endereco'],
    "bairro" => $data['bairro'],
    "cidade" => $data['cidade'],
    "estado" => $data['estado'],
    "pais" => $data['pais'],
    "dataHora" => date('Y-m-d\TH:i:s')
];

// Adiciona ao array
$currentData[] = $newRecord;

// 7. Salva no arquivo JSON
// verificação LOCK_EX que garante que dois usuários não escrevam ao mesmo tempo corrompendo o arquivo
if (file_put_contents($filePath, json_encode($currentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX)) {
    http_response_code(201); 
    echo json_encode([
        "status" => "success", 
        "message" => "Endereço cadastrado com sucesso!"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Erro ao gravar no servidor."
    ]);
}
?>