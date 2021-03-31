let myConfig = require('./config/config');
let { MeyCoinClient, GrpcProvider, Amount, Address } = require('@mey-sdk-js/client');
let fs= require('fs');
let meyTestNet = new MeyCoinClient({}, new GrpcProvider({ url: myConfig.ipGrpcProviderTestNet }));
let meyMainNet = new MeyCoinClient({}, new GrpcProvider({ url: myConfig.ipGrpcProviderMainNet }));
const { Client } = require('@elastic/elasticsearch');
const { GoAwayNotice } = require('@mey-sdk-js/client/types/p2p_pb');
const client = new Client({ node: 'http://localhost:9200' })
let mey=meyMainNet,count=0;
// check heighblock and Index in elasticsearch 
let pastheight;
async function saveR(){
  try {
        pastheight=parseInt( fs.readFileSync('countBlock.txt'));
        let currentHeight = (await mey.blockchain()).bestHeight;
        if(pastheight < currentHeight)
        {
            for(var i=pastheight;i<currentHeight;i++)
            {
                let data = (await mey.getBlockBody(i)).body.txsList;
                if(data.length >0) {
                  data.forEach(async (Element) =>  {
                        let ads = [Element.from,Element.to];
                        let body = {
                            hash: Element.hash,
                            nonce: Element.nonce,
                            from: Element.from,
                            to: Element.to,
                            amount: Element.amount,
                            payload: Element.payload,
                            sign: Element.sign,
                            type: Element.type,
                            limit: Element.limit,
                            price: Element.price,
                            chainIdHash: Element.chainIdHash,
                        };
                        count++;
                        console.log(count);
                    await  client.index({ index: "trans", body: body });
                    ads.forEach(async(result) =>{
                      let {check} = client.exists({ index: "address", type:"docs", id: result});
                    if(!check) {
                      await client.index({ index: "address", type:"docs",id: result , body:{}});
                    }
                    });
                  });
                }
            }  
        } 
        pastheight=currentHeight;
        fs.writeFileSync("countBlock.txt",pastheight.toString());
    } catch (error) {
      console.log(error);
    }  
}
saveR();
setInterval(saveR,5000);





