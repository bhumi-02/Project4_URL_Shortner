const urlModel = require("../Model/Url_Model");
const validUrl = require('valid-url')
const shortid = require('shortid')
const baseUrl = 'http://localhost:3000'

const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    14442,
    "redis-14442.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("2RS3A6ywtLcNSt8Gr92W8dTkWWqUjDyH", function (err) {
    if (err) throw err;
  });

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});



const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

/*---------------------------------------------- Create Url -----------------------------*/
const shortUrl = async function (req, res) {
    try {
    
        let  longUrl  = req.body.longUrl
        if (!longUrl) {
            return res.status(400).send({ status: false, message: "Long Url is required" })
        }

        let validLongUrl = (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.#?&//=]*)/.test(longUrl.trim()))
        if (!validLongUrl) {
            return res.status(400).send({ status: false, msg: "Please provide a valid longUrl" })
        }

        let duplicateLongUrl = await urlModel.findOne({ longUrl })
        if (duplicateLongUrl) {
            return res.status(400).send({ status: false, message: "This LongUrl already exists", })
        }
    const urlCode = shortid.generate().toLowerCase()
        //const urlCode = shortid.generate(longUrl)

        const shortUrl = baseUrl + '/' + urlCode
        
        let urlBody = {
            longUrl,
            shortUrl,
            urlCode
        }
        let savedData = await urlModel.create(urlBody)

        // let urlDetails = {
        //     longUrl: savedData.longUrl,
        //     shortUrl: savedData.shortUrl,
        //     urlCode: savedData.urlCode
        // }
        return res.status(201).send({ status: true, data: savedData})
    }

    catch (error) {
        return res.status(500).send({ message: error.message })
    }
}
/*---------------------------------------------- Get Url -----------------------*/
const getShortUrl=async function(req,res){
    try{
        let cahcedUrleData = await GET_ASYNC(`${req.params.urlCode}`)
        if (cahcedUrleData) { return res.status(302).redirect(cahcedUrleData.longUrl) }
        let urlCode = req.params.urlCode
        let url = await urlModel.findOne({ urlCode: urlCode })
        console.log(url)
        if (url) {
            return res.status(302).redirect(url.longUrl)
        }
        return res.status(404).send({ status: false, message: "url not found" })
        await SETEXP_ASYNC(`${req.params.urlCode}`,'50', JSON.stringify(url))
    }catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

module.exports = { shortUrl, getShortUrl }