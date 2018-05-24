### JStore - simple, flexible, reactive store

#### Install
`yarn add @jashkasoft/rx-jstore`

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
 - Action middleware


#### Examples
    examples/main.ts - JStore
    examples/dispatcher.ts - JStoreDispatcher
    examples/stores - How create custom store
    examples/formatters - How create formatter


##### JStore
    - initValue only condition check `if` operator
    - clone with last value only if jstore has config property initial value
    - formatters run with priority by index ( prev value passed to next formatter )
      return last formatted value
    - middleware
      
    - Base:
        formatters:
            - to number
            - to string
            - trim
        storage:
            - simple storage ( in memory )




### For development
###### Переходим в директорию с проектом
```bash
cd folder-name
```

###### Установка зависимостей
```bash
yarn
```

###### Запуск сборки приложения и веб-сервера:
```bash
yarn run serve
```

###### Сборка приложения с минификацией: 
```bash
yarn run build
```
