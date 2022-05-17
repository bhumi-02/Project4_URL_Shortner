const urlModel = require("../Model/Url_Model");
const validUrl = require('valid-url')
const shortid = require('shortid')
const baseUrl='http://localhost:3000'
/*---------------------------------------------- Create Url -----------------------------*/
const shortUrl=async function(req,res){
    try{
    let {longUrl}=req.body
    if (!validUrl.isUri(longUrl)) {
        return res.status(401).json('Invalid base URL')
    }
    const urlCode = shortid.generate(longUrl)
    const shortUrl = baseUrl + '/' + urlCode
    const newUrl={longUrl,shortUrl,urlCode}
    const short=await urlModel.create(newUrl)
    return res.status(201).send({status:true,data:short})
}
    catch (error){
        return res.status(500).send({message:error.message})
    }
}
/*---------------------------------------------- Create Url -----------------------*/
const getShortUrl=async function(req,res){
    try{
    let{urlCode}=req.params
    let url=await urlModel.findOne({urlCode:urlCode})
    if(url){
        return res.redirect(url.longUrl)
    }
    return res.send({status:false,message:"url not found"})
}
catch (error){
    return res.status(500).send({message:error.message})
}
}

module.exports={shortUrl,getShortUrl}