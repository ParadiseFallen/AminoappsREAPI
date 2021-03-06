# AminoappsREAPI
![alt tag](https://media-exp1.licdn.com/dms/image/C4D1BAQEwoHfh2Uwlkg/company-background_10000/0?e=2159024400&v=beta&t=rTGD7YioV171nHX4jESQRUe2IXTNlD4pQJwpITeshQk)
Unofficial client for working with rest-api aminoapps.
```typescript 
import * as api from 'aminoapps-reapi' 
let client: api.AminoClient = new api.AminoClient(
    "address@gmail.com", //email addres
    "password", //account password
    "device_id" //your device id
    client.onMessage((message: api.AminoMessage) => 
    {
        message.reply('Ok!')
    })
```
[How to get device id](https://github.com/ParadiseFallen/AminoappsREAPI/wiki/Device-id)
## Installation
This is a [Typescript](https://www.typescriptlang.org/) module available through the [npm registry](https://www.npmjs.com/).

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):
```bash
$ npm i aminoapps-reapi
```
## Docs & Community
* [Documentation](https://github.com/ParadiseFallen/AminoappsREAPI/wiki/)
## License

  [MIT](LICENSE)
  
## Modules
+ `typescript`
+ `@types/node`
+ `sync-request`
+ `ws`
