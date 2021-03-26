import cheerio from "cheerio";
import axios from "axios";
import fastify from "fastify";

const server = fastify();

const getLottoHTML = async () => {
  const response = await axios.get("https://lotto.postjung.com/");
  const html = response.data;
  const $ = cheerio.load(html);
  const $selector = $("#mainbox1");

  if (!$selector.length) {
    return null;
  }

  return {
    date: $selector.find("h1").text(),
    lotteryPrize: {
      first: $selector.find(".xs1 > div.xres").text(),
      lst2digit: $selector.find(".xb2 > div.xres").text(),
      lst3digit: [
        $selector.find(".xb3:eq(0)").find(".xres b:eq(0)").html(),
        $selector.find(".xb3:eq(0)").find(".xres b:eq(1)").html(),
        $selector.find(".xb3:eq(1)").find(".xres b:eq(0)").html(),
        $selector.find(".xb3:eq(1)").find(".xres b:eq(1)").html(),
      ],
    },
  };
};

const getGasolineHTML = async () => {
  const response = await axios.get(
    "https://www.bangchak.co.th/th/oilprice/widget"
  );
  const html = response.data;
  const $ = cheerio.load(html);
  const $selector = $(".oil-price");

  if (!$selector.length) {
    return null;
  }

  return {
    remark: "เบนซินเท่านั้น",
    date: $selector.find(".oil-price__date").text(),
    price: {
      g95: {
        now: $selector
          .find(".oil-price__table > tbody > tr:nth-child(8) > td:nth-child(2)")
          .html(),
        tmr: $selector
          .find(".oil-price__table > tbody > tr:nth-child(8) > td:nth-child(3)")
          .html(),
      },
      g91: {
        now: $selector
          .find(".oil-price__table > tbody > tr:nth-child(7) > td:nth-child(2)")
          .html(),
        tmr: $selector
          .find(".oil-price__table > tbody > tr:nth-child(7) > td:nth-child(3)")
          .html(),
      },
      e20: {
        now: $selector
          .find(".oil-price__table > tbody > tr:nth-child(6) > td:nth-child(2)")
          .html(),
        tmr: $selector
          .find(".oil-price__table > tbody > tr:nth-child(6) > td:nth-child(3)")
          .html(),
      },
      e85: {
        now: $selector
          .find(".oil-price__table > tbody > tr:nth-child(5) > td:nth-child(2)")
          .html(),
        tmr: $selector
          .find(".oil-price__table > tbody > tr:nth-child(5) > td:nth-child(3)")
          .html(),
      },
    },
  };
};

server.get("/lotto", (request, reply) => {
  getLottoHTML()
    .then((r) => {
      reply.send(r);
    })
    .catch((error) => {
      console.error(error);
    });
});

server.get("/gasoline", (request, reply) => {
  getGasolineHTML()
    .then((r) => {
      reply.send(r);
    })
    .catch((error) => {
      console.error(error);
    });
});

// exports.api = functions.https.onRequest((req, res) => {
//   server.ready((err) => {
//     if (err) throw err
//       console.error(err)
//       process.exit(1)
//   })
// })

server.listen(process.env.PORT || 5000, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
