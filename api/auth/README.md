### Google OAuth 2.0

### ТЕСТИМ через endpoint...

### СЕЙЧАС стоят заглушки на http://localhost:1717/api/auth/....

# GET /api/auth/google --> перенаправляет на сервис регестрации через google

после регестрации, сервис дает нам код , для получения токена. Вовращает КОД и ТОКЕН на http://localhost:1717/api/auth/google/callback
после принятия токена делает еще один запрос на сервис для получения данных зарегестрированного пользователя.

### Facebook OAuth 2.0

### ТЕСТИМ через endpoint...

### СЕЙЧАС стоят заглушки на http://localhost:1717/api/auth/....

# GET /api/auth/facebook --> перенаправляет на сервис регестрации через facebook

логика одинаковая, кроме callback.

### СТАТЬЯ

https://xsltdev.ru/nodejs/tutorial/authentication/#google-facebook
http://www.passportjs.org/

# Google

https://medium.com/authpack/easy-google-auth-with-node-js-99ac40b97f4c
https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow

# Facebook

https://medium.com/authpack/facebook-auth-with-node-js-c4bb90d03fc0
https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow?locale=ru_RU
