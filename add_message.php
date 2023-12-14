<?php
header('Content-Type: application/json');

// 檢查是否為 POST 請求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}

// 接收 POST 參數
$sender = $_POST['sender'] ?? '';
$message = $_POST['message'] ?? '';

// 驗證參數
if (empty($sender) || empty($message)) {
    echo json_encode(['error' => 'Sender and message are required.']);
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
    $now = date('Y-m-d H:i:s');
    $query = "INSERT INTO chat_message SET sender = :sender, message = :message, msg_time = :msgTime";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':sender', $sender);
    $stmt->bindParam(':message', $message);
    $stmt->bindParam(':msgTime', $now);
    $stmt->execute();

    echo json_encode(['success' => 'Message added successfully.']);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
