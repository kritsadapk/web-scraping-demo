import cheerio from 'cheerio'
import axios from 'axios'
import fastify from 'fastify'
import functions from 'firebase-functions'

const server = fastify()


const getHTML = async () =>{
  const response = await axios.get('https://lotto.postjung.com/')
  const html = response.data
  const $ = cheerio.load(html)
  const $selector = $("#mainbox1")  

  if (!$selector.length) {
    return null
  }

  return {
    date: $selector.find('h1').text(),
    lotteryPrize:{
      first: $selector.find('.xs1 > div.xres').text(),
      lst2digit: $selector.find('.xb2 > div.xres').text(),
      lst3digit: [
        $selector.find('.xb3:eq(0)').find('.xres b:eq(0)').html(),
        $selector.find('.xb3:eq(0)').find('.xres b:eq(1)').html(),
        $selector.find('.xb3:eq(1)').find('.xres b:eq(0)').html(),
        $selector.find('.xb3:eq(1)').find('.xres b:eq(1)').html(),
      ],
    }
  }
 
}


server.get('/lotto', (request, reply) => {
  getHTML().then(r=>{
    reply.send(r)
  }).catch(error=>{
    console.error(error)
  }) 
})

// exports.api = functions.https.onRequest((req, res) => {
//   server.ready((err) => {
//     if (err) throw err
//       console.error(err)
//       process.exit(1)
//   })
// })

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})