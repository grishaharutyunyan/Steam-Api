# Steam Item Inspection API

Это API принимает ссылку на осмотр предмета Steam и возвращает данные о предмете в формате JSON.
 
## Запуск сервера  ()

1. Установите зависимости:
    ```sh
    npm install
    ```

2. Запустите сервер:
    ```sh
    node server.js
    ```

Сервер будет запущен на `http://localhost:3000`.

## Эндпоинты

### POST `/inspect`

Принимает ссылку на осмотр предмета и возвращает данные о предмете.

#### Пример запроса
Пример тела запроса
{
    "link": "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M4864527174620853153A37279345455D463242516184977340"
}


Пример ответа

{
    "floatValue": 0.12345678,
    "paintSeed": 123,
    "paintIndex": 2,
    "stickers": [
        {
            "name": "Sticker Name",
            "wear": 0.1
        }
    ]
}
