function pagination(model,page,limit,count) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const result = {}
    if(endIndex < count){
        result.next = true
    }
    else {
        result.next = false
    }
    if(startIndex > 0 ){
        result.previous = true
    }else{
        result.previous = false
    }
    result.count = count
    result.data = model;
    return result
}
function walletPagination(model,page,limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const result = {}
    if(endIndex < model?.length){
        result.next = true
    }
    else {
        result.next = false
    }
    if(startIndex > 0 ){
        result.previous = true
    }else{
        result.previous = false
    }
    result.count = model.length
    result.data = model.slice(startIndex,endIndex);
    return result
}

module.exports = {
    pagination,
    walletPagination
}