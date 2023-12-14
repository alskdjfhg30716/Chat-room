<?php
header('Content-Type: application/json');

// 檢查是否為 GET 請求
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}

// 資料庫連線設定
$host = 'localhost';
$dbName = 'db_course';
$user = 'root';
$pass = 'root';
$dsn = "mysql:host=$host;dbname=$dbName";

try {
    $pdo = new PDO($dsn, $user, $pass);
    $query = "SELECT * FROM chat_message ORDER BY msg_time";
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['messages' => $messages]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
