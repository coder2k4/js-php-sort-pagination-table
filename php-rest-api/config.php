<?php

class Connect extends PDO
{
    public function __construct($dsn = 'mysql:host=localhost;dbname=api', $username = 'root', $passwd = 'root', $options = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"))
    {
        parent::__construct($dsn, $username, $passwd, $options);
        $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }
}