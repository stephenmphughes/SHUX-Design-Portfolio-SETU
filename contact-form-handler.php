<?php
$errors = '';
$myemail = 'D00273758@student.dkit.ie'; // Your email

if (
    empty($_POST['userType']) ||
    empty($_POST['firstName']) ||
    empty($_POST['lastName']) ||
    empty($_POST['companyName']) ||
    empty($_POST['companyLocation']) ||
    empty($_POST['email']) ||
    empty($_POST['textMessage'])
) {
    $errors .= "Error: All fields are required.\n";
}

$userType = $_POST['userType'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$companyName = $_POST['companyName'];
$companyLocation = $_POST['companyLocation'];
$email_address = $_POST['email'];
$textMessage = $_POST['textMessage'];

if (!filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
    $errors .= "Error: Invalid email address.\n";
}

if (empty($errors)) {
    $to = $myemail;
    $email_subject = "Contact Form: $firstName $lastName";
    $email_body = "You have received a new message:\n" .
        "User Type: $userType\n" .
        "First Name: $firstName\n" .
        "Last Name: $lastName\n" .
        "Company Name: $companyName\n" .
        "Company Location: $companyLocation\n" .
        "Email: $email_address\n" .
        "Message: $textMessage\n";

    $headers = "From: $myemail\r\n";
    $headers .= "Reply-To: $email_address\r\n";

    mail($to, $email_subject, $email_body, $headers);
    header('Location: contact-form-thank-you.html');
    exit();
}
?>


<!DOCTYPE HTML>
<html>
<head>
    <title>Contact Form Handler</title>
</head>
<body>
<!-- Display errors if any -->
<?php
if (!empty($errors)) {
    echo nl2br($errors);
}
?>
</body>
</html>
