let myConfig = require('./config/config');
let { MeyCoinClient, GrpcProvider, Amount } = require('@mey-sdk-js/client');
let fs= require('fs');
let meyTestNet = new MeyCoinClient({}, new GrpcProvider({ url: myConfig.ipGrpcProviderTestNet }));
let meyMainNet = new MeyCoinClient({}, new GrpcProvider({ url: myConfig.ipGrpcProviderMainNet }));
const { Client } = require('@elastic/elasticsearch');
const { METHODS } = require('http');
const client = new Client({ node: 'http://localhost:9200' })
let mey=meyMainNet;
// check heighblock and Index in elasticsearch 
let pastheight;
async function saveR(){
    try {
        pastheight=parseInt( fs.readFileSync('countBlock.txt'));
        let currentHeight = await (await mey.blockchain()).bestHeight;
        if(pastheight < currentHeight)
        {
            for(var i=pastheight;i<currentHeight;i++)
            {
                let data = (await mey.getBlockBody(i)).body.txsList;
                if(data.length !=0){
                  await  data.forEach(async (Element)=>{
                        let  ads = {
                            from : Element.from,
                            to : Element.to
                        };
                        let body= {
                          hash: Element.hash,
                          nonce: Element.nonce,
                          from: Element.from,
                          to: Element.to,
                          amount: Element.amount,
                          payload: Element.payload,
                          sign: Element.sign,
                          type:Element.type,
                          limit: Element.limit,
                          price: Element.price,
                          chainIdHash: Element.chainIdHash,
                        }
                       
                       // console.log(Element);
                     await client.index({index:"trans",type:"transac",  body: body});
                     await client.index({index:"trans",type:"address", body: ads});
                    })
                }
           
            }
            pastheight=currentHeight;
            fs.writeFileSync("countBlock.txt",pastheight.toString());
        } 
    } catch(error) {
        console.log(error);
    }
    
}
console.time('Lopp');
saveR();
console.timeEnd('lopp');
//setInterval(saveR(),50000);
