<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="icon" href="/storage/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="/storage/apple-touch-icon-180x180.png">
        <title>{{config('app.name')}}</title>
        <link rel="manifest" href="/manifest.json">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    </head>
    <body>
        <div id="app"><div>
    </body>
    <script src="{{ mix('js/app.js') }}"></script>
</html>