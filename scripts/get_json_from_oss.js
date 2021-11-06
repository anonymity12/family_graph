// url

function getJsonFromOss() {
    var jsonUrl = "https://picgorepo.oss-cn-beijing.aliyuncs.com/family_data/jiapu.json"
    jsonHttpReq = new XMLHttpRequest()
    jsonHttpReq.open("GET", jsonUrl, false)

    jsonHttpReq.send()
    console.log("jsonHttpReq response", jsonHttpReq.responseText)
    // jsonResp = jsonHttpReq.responseXML
    var jsonData = JSON.parse(jsonHttpReq.responseText)
    return jsonData

}