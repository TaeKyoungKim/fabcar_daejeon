# fabcar_daejeon
# fabcar를 활용한 웹서버 만들기

fabcar_web 를 만든후에 

fabric-samples 에 있는 기본 필요 파일을 복사에서 fabcar_web 에 붙여 넣기 한다.

bin , chaincode , config . basic-network , fabcar



chaincode 에 있는 javascript 체인 코드를 활용한다.



lib/fabcar.js



npm install fabric-contract-api 이런식으로 설치 해야 하지만 package.json에 관리가 전부 되어 있으므로 

이것을 스크립파일이 알아서 npm install 이라는 명령어를 이용해서 설치를 자동으로 해준다.

```javascript
const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    
}

module.exports = FabCar; 
```





처음 세팅하는 초기화 함수

```javascript
async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cars = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
            },
            {
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'Jin Soo',
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'Max',
            },
            {
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'Adriana',
            },
            {
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'Michel',
            },
            {
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'Aarav',
            },
            {
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'Pari',
            },
            {
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'Valeria',
            },
            {
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'Shotaro',
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
```





'CAR' + i, Buffer.from(JSON.stringify(cars[i])) 는 CAR0 형식으로 cars 배열에 추가 된다.



chaincode에 있는 함수는 

```javascript
async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }


    async createCar(ctx, carNumber, make, model, color, owner) {
        console.info('============= START : Create Car ===========');

        const car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;

                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }
```



queryCar(ctx, carNumber) : carNumber의 인자로 'CAR0' 형식의 값을 받아서 그에 해당하는 정보를 

return 한다.



createCar(ctx, carNumber, make, model, color, owner) : 새로 추가 하고자 하는 정보를 carNumber의 인자로 'CAR11' ->이때 중요한것은 기존에 있는 'CAR0'등의 값과 중복이 되면 안된다.

각각의  make, model, color, owner 의 인자값으로 원하고자 하는 값을 넣어준다.





 queryAllCars(ctx) : 현재 등록된 car정보를 모두 조회 하는 함수

changeCarOwner(ctx, carNumber, newOwner) : car 의 owner 정보를 바꾸는 함수 



fabcar폴더에 startFaric.sh 실행한다.

```shell
./startFabric.sh
```

