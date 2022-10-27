const axios = require("axios");
const cheerio = require("cheerio");
const Week = require("../models/Week");

async function currentWeek (){
    const url = 'https://www.cbssports.com/nfl/schedule/'
    let dataArr = []
    await axios(url).then((res)=>{
        const html_data = res.data;
        const $ = cheerio.load(html_data);

        const weekSelector = '#PageTitle-header'

        const weeknum = $(weekSelector).text().trim().split(' - ')[1]
        console.log(weeknum)
        dataArr.push(weeknum)
    })
    return dataArr
}

async function weekScrapper(num) {
    const url= `https://www.cbssports.com/nfl/schedule/2022/regular/${num}/`;
    const dataArray = [];
    await axios(url).then((res)=>{
        const html_data = res.data;
        const $ = cheerio.load(html_data);


        const diffSelector = 'div.TableBaseWrapper  tr.TableBase-bodyTr'
        const keysFuture = [
            'AwayLogo',
            'Away',
            'HomeLogo',
            'Home',
            'Time',
            'TV',
            'Venue',
            'Buy_Tickets',
        ];

        const keysHappened = [
            'AwayLogo',
            'Away',
            'HomeLogo',
            'Home',
            'result',
            'gameInfo',
        ];


        $(diffSelector).each((parentIndex, parentElem) => {
            let keyIndex = 0;
            const gameDetails = {};
            if (parentIndex <=15){
                let keys;
                if($(parentElem).children().length>3){
                    keys = keysFuture;
                }
                else{
                    keys = keysHappened
                }
                $(parentElem).children().each((childId, childElem) => {
                    const value = $(childElem).text().trim();
                    const img = $(childElem).find('figure').find('img').attr('data-lazy');
                    const gameInfo = 'https://www.cbssports.com' + $(childElem).find('.CellGame').find('a').attr('href');
                    if(childId<2){
                        gameDetails[keys[keyIndex]] = img;
                        keyIndex++ 
                        gameDetails[keys[keyIndex]] = value;
                        keyIndex++ 
                    }
                    else if(keys===keysHappened){
                        gameDetails[keys[keyIndex]] = value;
                        keyIndex++ 
                        gameDetails[keys[keyIndex]] = gameInfo;
                        keyIndex++ 
                    }
                    else if (value){
                        gameDetails[keys[keyIndex]] = value;
                        keyIndex++ 
                    }
                });
                dataArray.push(gameDetails);
            }
        })
    })
    return dataArray;
}

module.exports ={
    getCurrentWeek: async (req,res) => {
        try {
            const weekN = await currentWeek();
            return res.status(200).json({
                result: weekN,
            })
        } catch (error) {
            console.log(error)
        }
    },
    getSeason: async (req,res) => {
        try {
            let arr = []
            for (let i = 1; i<=18; i++){
                arr.push(i)
            }
            Promise.all(arr.map(async x=>{
                return await weekScrapper(x);
            })).then((values) => {
                    let dateUpdated = Date.now();
                    console.log(values)
                    let parsedValues = values.map((y,e) => {
                        const week = {}
                        week.Week = e+1
                        week.Games = y
                        return week;
                    })
                    Promise.all(parsedValues.map(async x=>{
                        await Week.findOneAndUpdate(
                            {Week: x.Week},
                            {Games: x.Games,
                                updatedAt: dateUpdated},
                            {upsert: true}
                        )
                    }))
                    return res.status(200).json({
                        result: parsedValues,
                    })
                })
        } catch (err) {
            return res.status(500).json({
                err: err.toString(),
            });
        }
    },
    getWeek: async (req,res) => {
        try {
            const weekQ = await Week.find({Week:req.params.id}) 
            return res.status(200).json({
                result: weekQ,
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                err:error.toString(),
            })
        }
    }
}
