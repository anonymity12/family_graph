// url

function getJsonFromOss() {
    var jsonUrl = "https://picgorepo.oss-cn-beijing.aliyuncs.com/family_data/jiapu.json"
    jsonHttpReq = new XMLHttpRequest()
    jsonHttpReq.open("GET", jsonUrl, false)

    jsonHttpReq.send()
    var jsonData = JSON.parse(jsonHttpReq.responseText)
    return jsonData

}