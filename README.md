### JStore - simple, flexible, reactive store

#### JStore
 - Actions & Formatters
 - Initial value
 - Custom input & output formatters ( Formatters are Observable )
 - Custom storage
 - Strict storage checking

#### JStoreDispatcher over JStore
 - Lock & unlock
 - Snapshots
 - Actions



##### JStore
    initValue only condition check `if` operator
    clone with last value only if jstore has config property initial value




### ROADMAP
 - JStoreDispatcher: add middlewares  


### For development
###### Переходим в директорию с проектом
```bash
cd folder-name
```

###### Установка зависимостей
```bash
npm i
```

###### Запуск сборки приложения и веб-сервера:
```bash
npm serve
```

###### Сборка приложения без минификации: 
```bash
npm run build
```

###### Сборка приложения с минификацией: 
```bash
npm run build:prod
```
