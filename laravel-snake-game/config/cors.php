<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration determines the settings for cross-origin resource
    | sharing or "CORS". This determines what cross-origin operations may
    | execute in web browsers. You are free to adjust these settings.
    |
    */

'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:4200'], // Adjust as needed
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'allow_credentials' => true,


    'max_age' => 0,

    'supports_credentials' => true,

];
