const mongoose = require("mongoose");
const DataBaseService = require("./DataBaseService");

exports.averageStandardDeviation = function(){
    var averageStandardDeviation = ((standardDeviationETH() +  standardDeviationBSC()) / 2);
    return averageStandardDeviation;
};


exports.standardDeviationETH = function () {

    var priceHistoryETH = [];
    //get data from db
    var priceHistoryETH = DataBaseService.QueryData(
        "db.posts.find({ created_on: { $gte: new Date(2012, 7, 14), $lt: new Date(2012, 7, 15)}})", priceHistoryETH
    );

    var standardDeviationETH = CalculateStandardDeviation(priceHistoryETH);
    return standardDeviationETH;
};


exports.standardDeviationBSC = function() {

    var priceHistoryBSC = [];
    //get data from db
    var priceHistoryBSC = DataBaseService.QueryData(
        "db.posts.find({ created_on: { $gte: new Date(2012, 7, 14), $lt: new Date(2012, 7, 15)}})", priceHistoryBSC
    );  
    
    var standardDeviationBSC = CalculateStandardDeviation(priceHistoryBSC);
    return standardDeviationBSC;
};


function CalculateStandardDeviation(numbersArr) {
    
    //calculate average 
    var total = 0;
    for(var key in numbersArr) 
       total += numbersArr[key];
    var meanVal = total / numbersArr.length;
  
  
    //calculate standard deviation
    var SDprep = 0;
    for(var key in numbersArr) 
       SDprep += Math.pow((parseFloat(numbersArr[key]) - meanVal),2);
    var SDresult = Math.sqrt(SDprep/numbersArr.length);
    
    return SDresult;
}