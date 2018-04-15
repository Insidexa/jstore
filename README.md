### JStore - simple, flexible, reactive store

#### JStore
 - Actions & Formatters
 - Initial value
 - Custom input & output formatters ( Formatters are Observable )
 - Custom storage
 - Strict storage checking
 - context run ( maybe with angularjs $scopeApply )

#### JStoreDispatcher over JStore
 - Lock & unlock
 - Snapshots
 - Actions


#### Examples
    dev/main.ts - JStore
    dev/dispatcher.ts - JStoreDispatcher


##### JStore
    - initValue only condition check `if` operator
    - clone with last value only if jstore has config property initial value
    - formatters run with priority by index ( prev value passed to next formatter )
      return last formatted value
      
    - Base:
        formatters:
            - to number
            - to string
            - trim
        storage:
            - simple storage ( in memory )




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
npm run serve
```

###### Сборка приложения с минификацией: 
```bash
npm run build
```
