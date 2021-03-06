# Введение

- О чем этот скринкаст?

- Создание сессий

- Создание API на NodeJS + Mongoose

- Содание приложения на ReactJS

- Постановка задачи

  


Всем привет! Добро пожаловать на скринкаст по созданию полноценного приложения с базовой авторизацией.
> Можно показать на заднем фоне технологии, которые мы используем - это JWT, NodeJS, Mongoose, ReactJS

##### Создание сессий

В нем мы познакомимся с созданием сессий. Я расскажу плюсы и минусы различных подходов. Более подробно мы остановимся на подходе с использованием JWT, который и будет использоваться в дальнейшем

##### Создание API на NodeJS + Mongoose

Затем мы напишем свой собственный API на NodeJS и Mongoose.
Будем придерживаться подхода TDD (test-driven development) Сначала тесты, потом код. Движок для тестирования возьмем Jest.

##### Содание приложения на ReactJS

И в конце создадим приложение на ReactJS для подключения к нашему API.

##### Постановка задачи

Целью нашего скринкаста, как я уже сказал, будет создание приложения с авторизацией.
В целях обучения я намеренно упростил задачу. У нас не будет никаких дополнительных сущностей, кроме самого пользователя. Он будет уметь регистрироваться, авторизоваться и получать список пользователей.


Итак, поехали!



# Создание сессий

- email + password

- Простой токен

- JWT: Access + Refresh

  

Когда в приложении появляются приватные данные, то возникает потребность в аутентификации и авторизации

> Авторизация часто считается синонимом аутентификации, но в нашем случае это не так
> Сначала мы проводим аутентификацию, когда проверяем, есть ли токен в системе. Система говорит - "Да это же наш Вася! Привет, Вася!"
> Дальше мы его авторизуем, то есть говорим, что у данного пользователя есть определенные права на выполнение каких либо действий. Ты, Вася, можешь только читать книгу, но тебе нельзя ее дописывать.

В нашем случае приватными данными является список зарегестрированных пользователей. Для получения его, нужно сообщить бэкенду свой емейл и пароль. Бэкенд проверит, есть ли такой пользователь в хранилище, и если найдет, то даст разрешение к приватным данным. 
##### email + password

Можно было бы сохранить эту пару (емейл + пароль) в браузере и с каждым запросом передавать ее. Но это сильно облегчает работу хакерам, которые смогут перехвать эти данные. Учитывая, что часто пользователи используют один и тот же пароль в разных системах, это может дать хакерам доступ к кошельку, почте и другим сервисам.

##### Простой token

```js
{ [token]: uid }
```
Поэтому древние программисты подумали и решили, а давайте генерировать специальный токен и возвращать пользователю после авторизации. Он записывается в хранилище, как ключ, со значением - id пользователя. Теперь при каждом запросе пользователь передает не свою почту-пароль, а только этот ключ и не боится за свои оригинальные пароли.

В принципе, это уже хорошо. Но такой ключ тоже могут украсть и получить полный доступ к приложению. Но настоящий пароль он не узнает.

Чтобы украденным токеном нельзя было пользоваться вечно мы можем ограничить время его жизни. Через определенное время пользователь не сможет получать данные и ему придется перелогиниться. Но пользователь не хочет, чтобы его выкидвало через какое-то время, даже если оно достаточно большое. В таком случае можно выдавать ему каждый раз новый ключ, с обновленным временем жизни. Это отличная идея, потому что если ключ украдут и воспользуются им, то ключ пользователя перестанет быть валидным и он поймет, что его взломали. Все, что ему нужно - это найти безопасное соединение и залогиниться снова.

Однако, такой подход сильно увеличит нагрузку на сервис, да и что делать с параллельными запросами.

##### JWT: Access + Refresh

И тут на помощь приходит JWT.

`JWT` стал стандартом де-факто для сессий. Суть его в том, что мы определенным образом создаем токены доступа, которые используются для проверки подлинности пользователя. 

Работает он так же. Сервер аутентификации генерирует и выдает нам токен доступа, с помощью которого мы сможем ходить в API. У него также будет ограниченное время жизни, но обновляться он умеет автоматически, без перелогинивания. Для этого выдается второй ключ, который называется Refresh токеном. Когда мы не смогли получить данные по токену доступа, то есть сервер ответит ошибкой `token expired`, в ход идет Refresh токен, с помощью которого мы получим два новеньких Access + Refresh токена. И все повторяется.

Основное преимущество такого подхода - автономность токена доступа. Сервис ресурсов умеет проверять его без сервиса аутентификации, то есть для его проверки не требуется хранить записи валидных токенов доступа в хранилище - нужно знать один единственный ключ (секретный или публичный, в зависимости от выбора метода шифрования), с помощью которого можно подписывать тело токена и сравнить подписи.

Но Refresh токены мы храним - фактически это и есть те сессии, которые обновляются при каждом запросе.

То есть токен доступа у нас многоразовый, но короткоживущий. А Refresh токен живет долго, но его можно использовать только один раз.

В следующем видео мы разберемся подробнее, что из себя представляет JWT токен



# JWT

- Структура

- Защищает ли JWT наши данные?

- Проверка JWT

- Заключение



### Структура

*JWT* состоит из трех частей: заголовок `header`, полезные данные `payload` и подпись `signature`

`token = header.payload.signature` 

##### Заголовок (header)

> { alg: 'HS256', typ: 'JWT'}
Заголовок содержит информацию о самом токене.
alg - это алгоритм хэширования, с помощью которого мы подписываем данные. Он может быть либо симметричным шифрованием, например, HS256 или ассиметричным, например, RS256 с двумя ключами - публичным и приватным.
В первом случае с помощью ключа мы и создаем и проверяем подпись, а во втором - приватный ключ создает подпись, а публичный проверяет его на подлинность, то есть даже если он попадет к злоумышленнику, он ему будет абсолютно бесполезен.

```js
header = { alg: 'HS256', typ: 'JWT'}
```

##### Полезная нагрузка (payload)

Содержит полезные нам данные, которые могут пригодиться приложению. Эти данные называются заявками и могут быть какими угодно, за исключением зарезервированных ключей, список которых можно посмотреть в документации (ссылка в описании).

```js
payload = { uid: 'b08f86af-35da-48f2-8fab-cef3904660bd', exp: '1593540266' }
```

Здесь мы положили только две *заявки*: *id* пользователя и время жизни токена, exp. *Exp* (expiration time) , как раз, является зарезервированным ключом, и представляет наибольший интерес для нас. Время жизни записывается в формате unix - количества секунд, прошедших с начала 1 января 1970 года.

(https://tools.ietf.org/html/rfc7519#section-4.1) [Wiki](https://en.wikipedia.org/wiki/JSON_Web_Token#Standard_fields)

##### Signature
Далее идет самая важная часть токена - его криптографическая подпись. Ради нее все и затевалось. Она состоит из зашифрованных ключом заголовка и полезной нагрузки. Таким образом, если предыдущие части можно подменить - это открытые данные закодированы base64 - никакой криптографии здесь нет - вы можете декодировать их в консоли браузера. То подделать подпись, не зная секретного ключа, невозможно.

1. Сначала мы кодируем header и payload с помощью алгоритма base64
2. Соединяем закодированные части через точку
3. Применяем алгоритм HMAC-SHA256 над полученной строкой и секретным ключом
4. Склеиваем все три части через точку - это и будет наш JWT токен

```js
base64(header)  base64(payload)

`${base64(header)}.${base64(payload)}`
signature = HS256 -> HMAC-SHA256(`${base64(header)}.${base64(payload)}` - unsigned, 'cAtwa1kkEy' -> SECRET_KEY)

// header eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
// payload eyJ1c2VySWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NjYwYmQifQ
// signature -xN_h82PHVTCMA9vdoHrcZxH-x5mb11y1537t3rGzcM
```

```js
const token = `${base64(header)}.${base64(payload)}.${base64(signature)}
// JWT Access Token
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NjYwYmQifQ.-xN_h82PHVTCMA9vdoHrcZxH-x5mb11y1537t3rGzcM
```

Вы можете попробовать создать свой собственный *JWT* на сайте [jwt.io](https://jwt.io/) или проверить токен из описания.
```
atob('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9')
> "{"typ":"JWT","alg":"HS256"}"

atob('eyJ1aWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NjYwYmQiLCJleHAiOiIxNTkzNTQwMjY2In0')
"{"uid":"b08f86af-35da-48f2-8fab-cef3904660bd","exp":"1593540266"}"
```

### Защищает ли JWT наши данные?

Очень важно понимать, что использование *JWT* **НЕ** скрывает и не маскирует данные. Причина, зачем мы используем *JWT* — это проверка, что отправленные данные пришли от авторизованного пользователя. Данные внутри *JWT* закодированы и подписаны, обратите внимание, это не одно и то же, что зашифрованы. Цель кодирования данных — преобразование структуры. Подписанные данные позволяют серверу проверить подлинность пользователя.

### Проверка JWT

Для простоты мы будем подписывать данные с помощью симметричного метода шифрования `HS256`. Никто, кроме сервера аутентификации и сервера приложения не знает секретный ключ. Когда пользователь делает запрос с приложенным к нему токеном, сервер самостоятельно подписывает данные, то есть первые две части токена, и сравнивает их с третьей частью, в которой хранится подпись. Если подписи совпадают, значит *JWT* валидный, пользователю можно доверять. Если подписи не совпадают, значит стоит задуматься — возможно, это хакер провел успешную атаку и украл токен.

### Заключение

Мы прошлись по тому, что такое *JWT*, как он создаётся, как валидируется и как обновляется. Мы рассмотрели только основы этого процесса, дальнейшее углубление выходит за рамки нашего скринкаста, но этого уже достаточно для того, чтобы двигаться дальше.
