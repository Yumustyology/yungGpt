import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import {Configuration,OpenAIApi} from 'openai'

const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  

  const openai = new OpenAIApi(configuration);



//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
//   });


  app.get('/',(req,res)=>{
    res.send({
        welcome:"welcome to yungGpt API"
    })
  })
  app.post('/', async(req,res)=>{
    try {
       const question = req.body.question;
       const resp = await  openai.createCompletion({
        model: "text-davinci-003",
        prompt:`${question}`,
        temperature: 0.7,
        // temperature: 0,
        // max_tokens: 3000,
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });
      console.log("resp ",resp.data.choices[0].text);

      res.status(200).send({
        yung:resp.data.choices[0].text
      })

    } catch (error) {
        console.log("error here ",error.message);
        throw(error)
    }
  })

  let PORT = 5000 || process.env.port
  app.listen(PORT,()=>console.log('listening on port 5000'))